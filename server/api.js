'use strict';
const yelp = require('yelp-fusion');
const path = require('path');
require('dotenv').config(); // access process.env variables

const apiKey = process.env.YELP_API_KEY;

const yelpClient = yelp.client(apiKey);

const throttledQueue = require('throttled-queue');
const yelpThrottle = throttledQueue(1, 500); // dole out Yelp API calls every half-second

const redis = require("redis"),
    redisClient = redis.createClient();

const maxRandomTries = 10;

module.exports = function Routes(app) {

    app.post("/api/search", async function process(req, res) { // process search requests
        const requestData = req.body;
        const destinations = requestData.destinations;

        let randomDestinations = [];
        let randomRestinationsSet = new Set();

        const radius = fixRadius(requestData.radius);

        // doesn't repeat, if multiple queries of same type
        requestData.queryTypes.map(async (queryCategory) => {
            const cacheKey = getCacheKey({
                city: requestData.city,
                radius: radius,
                category: queryCategory
            });

            await retrieveFromRedis(cacheKey).then((results) => {
                if (results && results.length > 0) {
                    selectRandomResult(results, randomDestinations, randomRestinationsSet, destinations.length, res);
                } else {
                    yelpThrottle(async () => {
                        await yelpQuery(requestData.city, radius, queryCategory).then(async (response) => {
                            await saveResultsToRedis(cacheKey, queryCategory, response.jsonBody.businesses).then((businesses) => {
                                selectRandomResult(businesses, randomDestinations, randomRestinationsSet, destinations.length, res);
                            }).catch((err) => {
                                console.log(err);
                                res.sendStatus(500).json({error: "Failed to save results!"});
                            });
                        }).catch((err) => {
                            console.log(err);
                            res.sendStatus(500).json({error: "The Yelp API messed up. Try again later!"});
                        })
                    });
                }
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500).json({error: "Failed Redis retrieval. Try again later!"});
            });
        });

    });

    app.post("/api/swap", async (req, res) => {
        const requestData = req.body;
        const radius = fixRadius(requestData.radius);
        if(requestData.category === 'none') {
            res.json(getEmptyDestination());
        } else {
            const cacheKey = getCacheKey({
                city: requestData.city,
                radius: radius,
                category: requestData.category
            });
            await retrieveFromRedis(cacheKey).then((results) => {
                if (results && results.length > 0) {
                    selectOneRandomResult(results, requestData.otherDestIDs, res);
                } else {
                    yelpThrottle(async () => {
                        await yelpQuery(requestData.city, radius, requestData.category).then(async (response) => {
                            await saveResultsToRedis(cacheKey, requestData.category, response.jsonBody.businesses).then((businesses) => {
                                selectOneRandomResult(businesses, requestData.otherDestIDs, res);
                            }).catch((err) => {
                                console.log(err);
                                res.sendStatus(500).json({error: "Failed to save results!"});
                            });
                        }).catch((err) => {
                            console.log(err);
                            res.sendStatus(500).json({error: "The Yelp API messed up. Try again later!"});
                        })
                    });
                }
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500).json({error: "Failed Redis retrieval. Try again later!"});
            });
        }
    });

    app.all("*", (req, res, next) => { // front-end views
        res.sendFile(path.resolve("./public/dist/index.html"))
    });

    function fixRadius(radius) {
        radius = radius * 1609.344; // convert radius from miles to meters
        if (radius > 40000) { // yelp only accepts up to 40000 meters
            radius = 40000;
        } else if (radius < 0) {
            radius = 0;
        }
        return Math.floor(radius); // yelp API only accepts integers for distance
    }

    function getEmptyDestination() {
        return {
            name: "No result! Try again?",
            loc: "N/A",
            image_url: "./assets/question-mark.jpg",
            url: "",
            phone: "",
            rating: [],
            reviews: "Reviews: 0",
            category: 'none',
            price: ''
        };
    }

    async function retrieveFromRedis(cacheKey) {
        return new Promise((resolve, reject) => redisClient.hgetall(cacheKey, function (err, obj) {
            if (err) {
                console.log('retrieval error');
                return reject('Retrieval error');
            } else {
                const results = [];
                if (obj) {
                    for (let key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            results.push(JSON.parse(obj[key]));
                        }
                    }
                } else {
                    console.log('No retrieval');
                }
                return resolve(results);
            }
        }));
    }

    async function saveResultsToRedis(cacheKey, category, results) {
        return new Promise((resolve) => {
            results = results.map((result) => cleanResult(result, category));
            const secondsPerWeek = 60 * 60 * 24 * 70;
            results.forEach((result) => {
                redisClient.hset(cacheKey, result.id, JSON.stringify(result));
                redisClient.expire(cacheKey, secondsPerWeek);
            });
            resolve(results);
        });
    }

    function getCacheKey(queryData) {
        return queryData.city.toUpperCase() + queryData.category + roundDownRadius(queryData.radius);
    }

    function cleanResult(result, category) {
        if (result) {
            result = {
                id: result.id,
                loc: result.location && result.location.display_address ? result.location.display_address.join(", ") : 'Varies',
                name: result.name || "Unnamed",
                image_url: result.image_url || "./assets/question-mark.jpg",
                url: result.url || "N/A",
                phone: result.display_phone || "N/A",
                rating: getStars(result.rating),
                reviews: "Yelp reviews: " + (result.review_count ? result.review_count : "0"),
                category: category,
                price: result.price || '',
                // the next two are unused but may be useful later
                coordinates: result.coordinates,
                categories: result.coordinates
            };
        }
        return result;
    }

    function getStars(numStars) {
        if (!numStars) {
            numStars = 0;
        }
        let stars = [];
        for (let i = 0; i < Math.round(numStars); i++) {
            stars.push('*');
        }
        return stars;
    }

    function roundDownRadius(num) {
        return Math.floor(num / 10001);
    }

    function selectRandomResult(results, randomDestinations, randomDestinationsSet, numDestinations, res) {
        let randomDest;
        for (let i = 0; i < maxRandomTries; i++) {
            randomDest = results[Math.floor(Math.random() * results.length)];
            if (randomDest && !randomDestinationsSet.has(randomDest.id)) {
                randomDestinations.push(randomDest);
                randomDestinationsSet.add(randomDest.id);
                break;
            } else {
                randomDest = null;
            }
        }
        if(!randomDest) {
            randomDestinations.push(getEmptyDestination());
        }
        if (randomDestinations.length >= numDestinations) {
            res.json({results: randomDestinations});
        }
    }

    function selectOneRandomResult(results, otherDestIDs, res) {
        if(!results.length) {
            res.json(getEmptyDestination());
        } else {
            let randomDest;
            for (let i = 0; i < maxRandomTries; i++) {
                randomDest = results[Math.floor(Math.random() * results.length)];
                for (let j = 0; j < otherDestIDs.length; j++){
                    if(randomDest.id === otherDestIDs[j]) {
                        randomDest = null;
                        break;
                    }
                }
                if (randomDest) {
                    break;
                }
            }
            if(!randomDest) {
                randomDest = getEmptyDestination();
            }
            res.json(randomDest);
        }
    }

    async function yelpQuery(city, radius, queryCategory) {
        return yelpClient.search({
            location: city,
            radius: radius,
            categories: queryCategory
        });
    }
}
