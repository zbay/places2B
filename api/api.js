'use strict';
const yelp = require('yelp-fusion');
const path = require('path');
require('dotenv').config(); // access process.env variables

const apiKey = process.env.YELP_API_KEY;

const yelpClient = yelp.client(apiKey);

const throttledQueue = require('throttled-queue');
const yelpThrottle = throttledQueue(1, 500); // dole out Yelp API calls every half-second

const redisHelper = require('./redis-helper.js');

const utilities = require('./search-utilities.js');

module.exports = function Routes(app) {

    const defaultPriceArray = [1, 2, 3, 4];

    app.post(`/api/search`, (req, res) => { // process search requests
        const requestData = req.body;
        console.log(requestData);
        if (!requestData.price || !requestData.price.length) {
            requestData.price = defaultPriceArray;
        }
        const destinations = requestData.destinations;

        let randomDestinations = [];
        let randomDestinationsSet = new Set();

        const radius = utilities.fixRadius(requestData.radius);


        // doesn't repeat, if multiple queries of same type
        requestData.queryTypes.map((queryCategory) => {
            const cacheKeyQuery = {
                category: queryCategory,
                city: requestData.city + requestData.country,
                price: requestData.price,
                radius: radius
            };
            const cacheKey = utilities.getCacheKey(cacheKeyQuery);

            redisHelper.retrieveFromRedis(cacheKey).then((results) => {
                if (results && results.length > 0) {
                    const randomConfig = {results, randomDestinations, randomDestinationsSet, destinations, category: queryCategory, res};
                    utilities.selectRandomResultsForCategory(randomConfig);
                } else {
                    yelpThrottle(() => {
                        const yelpQueryConfig = {location: requestData.city + ', ' + requestData.country,
                            radius: radius, 
                            categories: queryCategory,
                            price: requestData.price
                        };
                        yelpQuery(yelpQueryConfig).then((response) => {
                            redisHelper.saveResultsToRedis(cacheKey, queryCategory, response.jsonBody.businesses).then((businesses) => {
                                const randomConfig = {results: businesses, randomDestinations, randomDestinationsSet, destinations, category: queryCategory, res};
                                utilities.selectRandomResultsForCategory(randomConfig);
                            }).catch((err) => {
                                console.log(err);
                                return res.sendStatus(500).json({error: "Failed to save results to cache!"});
                            });
                        }).catch((err) => {
                            console.log(err);
                            return res.sendStatus(500).json({error: "The Yelp API messed up. Try again later!"});
                        })
                    });
                }
            }).catch((err) => {
                console.log(err);
                return res.sendStatus(500).json({error: "Failed cache retrieval. Try again later!"});
            });
        });

    });

    app.post("/api/swap", (req, res) => {
        console.log('swapping');
        const requestData = req.body;
        if (!requestData.price || !requestData.price.length) {
            requestData.price = defaultPriceArray;
        }
        const radius = utilities.fixRadius(requestData.radius);
        if(requestData.category === 'none') {
            return res.json(utilities.getEmptyDestination());
        } else {
            const cacheKey = utilities.getCacheKey({
                city: requestData.city + requestData.country,
                radius: radius,
                category: requestData.category
            });
            redisHelper.retrieveFromRedis(cacheKey).then((results) => {
                if (results && results.length > 0) {
                    utilities.selectOneRandomResult(results, requestData.otherDestIDs, res);
                } else {
                    yelpThrottle(() => {
                        const yelpQueryConfig = {location: requestData.city + ', ' + requestData.country, radius: radius, categories: requestData.category, price: requestData.price};
                        yelpQuery(yelpQueryConfig).then((response) => {
                            redisHelper.saveResultsToRedis(cacheKey, requestData.category, response.jsonBody.businesses).then((businesses) => {
                                utilities.selectOneRandomResult(businesses, requestData.otherDestIDs, res);
                            }).catch((err) => {
                                console.log(err);
                                return res.sendStatus(500).json({error: "Failed to save results!"});
                            });
                        }).catch((err) => {
                            console.log(err);
                            return res.sendStatus(500).json({error: "The Yelp API messed up. Try again later!"});
                        })
                    });
                }
            }).catch((err) => {
                console.log(err);
                return res.sendStatus(500).json({error: "Failed Redis retrieval. Try again later!"});
            });
        }
    });

    app.all("*", (req, res) => { // front-end code
        return res.sendFile(path.resolve("./public/dist/index.html"))
    });

    function yelpQuery(queryConfig) {
        return yelpClient.search({
            categories: queryConfig.categories,
            limit: 50,
            location: queryConfig.location,
            price: queryConfig.price,
            radius: queryConfig.radius,
        });
    }
};
