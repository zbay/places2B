// problem: seasonal events show up in results
'use strict';
const express = require("express");
const yelp = require('yelp-fusion');
const path = require('path');
require('dotenv').config(); // access process.env variables

const clientId = process.env.YELP_CLIENT_ID;
const clientSecret = process.env.YELP_CLIENT_SECRET;

const app = express();

module.exports = function Routes(app){

    app.post("/api/search", function process(req, res){ // process search requests
        const requestData = req.body;
        
        let promise = new Promise((fulfill, reject) => { // begin promise 1
            let searchRequests = [];
        
            for(let i = 0; i < requestData.queryTypes.length; i++){ // create a search request for each necessary category
                searchRequests[i] = {
                location: requestData.city,
                radius: fixRadius(requestData.radius), 
                categories: requestData.queryTypes[i]
                }
                if(searchRequests.length === requestData.queryTypes.length){ // verify that all searchRequests have been generated before sending them along
                    fulfill(searchRequests);
                }
            }
            }).then((searchRequests) => { // end promise 1, begin promise 2
                yelp.accessToken(clientId, clientSecret).then(response => { // get a yelp token
                    const client = yelp.client(response.jsonBody.access_token); // establish a client using the token
                    let randomDestinations = []; // array of destination objects
                    let destNames = []; // array of destination names only, to easily prevent redundancy
                    let count = 0;
            
                    for(let i = 0; i < searchRequests.length; i++){ // for each destination type...
                        client.search(searchRequests[i]).then(response => { // ...search for that destination type
                            let results = response.jsonBody.businesses;
                            deleteRedundant(destNames, results); // delete redundant destinations from other categories
                            
                            for(let j = 0; j < requestData.destinations.length; j++){ // for each requested destination...
                                if(searchRequests[i].categories === requestData.destinations[j].kind){ //...if the destination's type matches that of the outer loop...
                                    let randomResult = randomDestination(results, searchRequests[i].categories); //...pick random destination
                                    deleteResult(randomResult.name, results); // delete the chosen destination from further consideration (avoid redundancy)
                                    randomDestinations[j] = randomResult; 
                                    destNames.push(randomResult.name);
                                    count++;
                                    if(count === requestData.destinations.length){ // if the random array has been fully populated, return results
                                        res.json({results: randomDestinations}); // send the results to the client  
                                        return;
                                    }
                                }
                            }
                        }).then(() => { /* end Yelp search promise */ 
                            return;
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(500).json({error: "The Yelp API messed up. Try again later!"});
                        });
                    }
                }).then(() => { /*end Yelp promise*/
                    return;
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({error: "The Yelp API messed up. Try again later!"});
                });;
            }).then(randomDestinations => { /* end promise 2, begin promise 3 */ 
                console.log("Finished!");
            })
            .catch((error) => { // process any errors
                console.error(error);
                res.status(500).json({error: "The Yelp API messed up. Try again later!"});
            });
    });
    
    app.post("/api/swap", function(req, res){
        const requestData = req.body;
        console.log(requestData);
        console.log("swapping");
        let searchRequest = {
                location: requestData.city,
                radius: fixRadius(requestData.radius), 
                categories: requestData.category
        };
                yelp.accessToken(clientId, clientSecret).then(response => { // get a yelp token
                    const client = yelp.client(response.jsonBody.access_token); // establish a client using the token
                    
                    client.search(searchRequest).then(response => { // ...search for that destination type
                        let results = response.jsonBody.businesses;
                        deleteRedundant(requestData.otherDests, results); // delete redundant destinations from other categories
                        res.json(randomDestination(results, searchRequest.categories)); //...pick random destination, send to client
                        return;
                    }).then((results) => { /* end Yelp search promise */ 
                        return;
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json({error: "The Yelp API messed up. Try again later!"});
                    });
                }).then((randomResult) => { /*end Yelp promise*/
                    return;
                }).catch((err) => {
                    console.log(err);
                    res.status(500).json({error: "The Yelp API messed up. Try again later!"});
                });
    });

    app.all("*", (req, res, next) => { // front-end views
        res.sendFile(path.resolve("./public/dist/index.html"))
    });

    function randomDestination(results, category){
        let count = 0;
            if(results.length == 0){ // if no results in that category were retrieved, send back placeholder data
                return {
                    name: "No result! Try again?",
                    loc: "N/A",
                    image_url: "./public/src/assets/question-mark.jpg",
                    url: "",
                    phone: "",
                    rating: 0,
                    reviews: "Reviews: 0",
                    category: category
                };
            }
            else{
                let randomDestination = results[Math.floor((Math.random() * results.length))];  // extract a random destination from the category
                return {
                    name: randomDestination.name || "Unnamed", 
                    loc: randomDestination["location"].display_address.join(", ") || "Varies",
                    image_url: randomDestination.image_url || "./public/src/assets/question-mark.jpg",
                    url: randomDestination.url || "N/A",
                    phone: randomDestination.display_phone || "N/A",
                    rating: Math.round(randomDestination.rating) || 0,
                    reviews: ("Yelp reviews: " + randomDestination.review_count) || "Reviews: 0",
                    category: category
                };
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
            }
            if(radius < 0){
                radius = 0;
            }
            return Math.floor(radius); // yelp API only accepts integers for distance
    }
    }