'use strict';
const yelp = require('yelp-fusion');
const path = require('path');
require('dotenv').config(); // access process.env variables

const apiKey = process.env.YELP_API_KEY;

const client = yelp.client(apiKey);

const throttledQueue = require('throttled-queue');
const yelpThrottle = throttledQueue(1, 500); // dole out Yelp API calls every half-second

module.exports = function Routes(app){

    app.post("/api/search", function process(req, res){ // process search requests
        const requestData = req.body;
        const destinations = requestData.destinations;

        const allDestinations = {};
        let randomDestinations = [];
        let count = 0;

        // doesn't repeat, if multiple queries of same type
        requestData.queryTypes.map((queryCategory) => {
          allDestinations[queryCategory] = {};
            return yelpThrottle(() => client.search({
              location: requestData.city,
              radius: fixRadius(requestData.radius),
              categories: queryCategory
            }).then(response => {
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
            client.search({
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
        console.log(randomDest);
        // randomDest is sometimes undefined??
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
};
