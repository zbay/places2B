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

const { Observable } = require('rxjs');
const { first } = require('rxjs/operators');


module.exports = function Routes(app){

    app.post("/api/search", function process(req, res){ // process search requests
        const requestData = req.body;
        const destinations = requestData.destinations;

        const allDestinations = {};
        let randomDestinations = [];
        let count = 0;

        const radius = fixRadius(requestData.radius);

        // doesn't repeat, if multiple queries of same type
        requestData.queryTypes.map((queryCategory) => {
          allDestinations[queryCategory] = {};
            return yelpThrottle(() => yelpClient.search({
              location: requestData.city,
              radius: radius,
              categories: queryCategory
            }).then(response => {
                const cacheKey = getCacheKey({city: requestData.city, radius: radius, category: queryCategory});
                retrieveFromRedis(cacheKey).pipe(first()).subscribe((results) => {
                    if (results && results.length > 0) {
                        console.log("Many results! " + results.length);
                    } else {
                        console.log("No results");
                    }
                    saveResultsToRedis(cacheKey, queryCategory, response.jsonBody.businesses);
                    response.jsonBody.businesses.forEach(business => {
                        if(!allDestinations[(business.id)]){
                            if(!allDestinations[queryCategory][business.id]){
                                allDestinations[queryCategory][business.id] = business;
                            }
                            allDestinations[queryCategory][business.id] = business;
                        }
                    });
                    for(let i = 0; i < destinations.length; i++){
                        if(destinations[i].kind === queryCategory){
                            randomDestinations[i] = randomDestination(allDestinations, queryCategory);
                            count++;
                        }
                    }
                    if(count >= destinations.length){
                        res.json({results: randomDestinations});
                    }
                }, (err) => {
                    console.log("Redis error!");
                    res.sendStatus(500).json({error: "Result caching messed up. Try again later!"});
                });

            })
            .catch((err) => {
              console.log(err);
              res.sendStatus(500).json({error: "The Yelp API messed up. Try again later!"});
            }));
        });
    });

    app.post("/api/swap", function(req, res){
        const requestData = req.body;
        yelpThrottle(() => {
            yelpClient.search({
                location: requestData.city,
                radius: fixRadius(requestData.radius),
                categories: requestData.category
            }).then(response => {
                let results = response.jsonBody.businesses;
                deleteRedundant(requestData.otherDests, results); // delete redundant destinations from other categories
                res.json(randomDestinationFromArray(results, requestData.category));
            })
                .catch((err) => {
                    console.log(err);
                    res.sendStatus(500).json({error: "The Yelp API messed up. Try again later!"});
                });
        });
  });

    app.all("*", (req, res, next) => { // front-end views
        res.sendFile(path.resolve("./public/dist/index.html"))
    });

    function randomDestinationFromArray(results, category){
      if(results.length === 0){
        return getEmptyDestination(category);
      }  else{
          const randomDest = results[Math.floor(Math.random() * results.length)];
          console.log(randomDest);
          let stars = [];
          for(let i = 0; i < Math.round(randomDest.rating); i++){
            stars.push('*');
          }
          return {
              name: randomDest.name || "Unnamed",
              loc: randomDest["location"].display_address.join(", ") || "Varies",
              image_url: randomDest.image_url || "./assets/question-mark.jpg",
              url: randomDest.url || "N/A",
              phone: randomDest.display_phone || "N/A",
              rating: stars,
              reviews: "Yelp reviews: " + (randomDest.review_count ? randomDest.review_count : "0"),
              category: category,
              price: randomDest.price || ''
          };
      }
    }

    function randomDestination(destinations, category){
      const destinationsOfType = destinations[category];
      const keys = destinationsOfType ? Object.keys(destinationsOfType) : [];
      if(keys.length === 0){
        return getEmptyDestination(category);
      }
      else{
        const randomIndex = Math.round(Math.random() * keys.length);
        const randomDest = destinationsOfType[keys[randomIndex]];
        let stars = [];
        // console.log(randomDest);
        for(let i = 0; i < Math.round(randomDest.rating); i++){
          stars.push('*');
        }
        const returnDest = Object.assign({}, {
            loc: randomDest["location"].display_address.join(", ") || "Varies",
            name: randomDest.name || "Unnamed",
            image_url: randomDest.image_url || "./assets/question-mark.jpg",
            url: randomDest.url || "N/A",
            phone: randomDest.display_phone || "N/A",
            rating: stars,
            reviews: "Yelp reviews: " + (randomDest.review_count ? randomDest.review_count : "0"),
            category: category,
            price: randomDest.price
        });
        if(randomDest && randomDest.id){
          for(let searchCategory in destinations){
            delete destinations[searchCategory][randomDest.id]; // prevents redundancy
          }
        }
        return returnDest;
      }
    }

    function deleteResult(name, results){ // helper to delete a chosen result, to prevent redundancy
        for(let i = 0; i < results.length; i++){
            if(name === results[i].name){
                results.splice(i, 1);
                break;
            }
        }
    }

    function deleteRedundant(alreadySelected, results){ // deletes redundant destinations previously chosen from other categories
        for(let i = 0; i < alreadySelected.length; i++){
            if(alreadySelected[i]){
                deleteResult(alreadySelected[i], results);
            }
        }
    }

    function fixRadius(radius){
        radius = radius * 1609.344; // convert radius from miles to meters
        if(radius > 40000){ // yelp only accepts up to 40000 meters
            radius = 40000;
        } else if(radius < 0){
            radius = 0;
        }
        return Math.floor(radius); // yelp API only accepts integers for distance
    }

    function getEmptyDestination(category) {
        return {
            name: "No result! Try again?",
            loc: "N/A",
            image_url: "./assets/question-mark.jpg",
            url: "",
            phone: "",
            rating: [],
            reviews: "Reviews: 0",
            category: category,
            price: ''
        };
    }

    function retrieveFromRedis(cacheKey) {
        return Observable.create(observer => {
            redisClient.hgetall(cacheKey, function (err, obj) {
                if (err) {
                    console.log('retrieval error');
                    observer.error(err);
                } else {
                    const results = [];
                    if(obj) {
                        console.log('Retrieved data?');
                        for (let key in obj) {
                            if (obj.hasOwnProperty(key)) {
                                results.push(obj[key]);
                            }
                        }
                    } else {
                        console.log('No retrieval');
                    }
                    observer.next(results);
                }
            });
        });
    }

    function saveResultsToRedis(cacheKey, category, results) {
        results.forEach((result) => {
            redisClient.hset(cacheKey, result.id, JSON.stringify(cleanResult(result, category)));
        });
        retrieveFromRedis(cacheKey);
    }

    function getCacheKey(queryData) {
        return queryData.city.toUpperCase() + queryData.category + roundDownRadius(queryData.radius);
    }

    function cleanResult(result, category) {
        if(result){
            result = {
                loc: result.location.display_address.join(", ") || 'Varies',
                name: result.name || "Unnamed",
                image_url: result.image_url || "./assets/question-mark.jpg",
                url: result.url || "N/A",
                phone: result.display_phone || "N/A",
                rating: getStars(result.stars),
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

    function getStars(numStars){
        if (!numStars) {
            numStars = 0;
        }
        let stars = [];
        for(let i = 0; i < Math.round(numStars); i++){
            stars.push('*');
        }
        return stars;
    }

    function roundDownRadius(num) {
        return Math.floor(num / 10001);
    }
};
