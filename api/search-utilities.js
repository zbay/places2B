const maxRandomTries = 10;

module.exports = {
    fixRadius: function (radius) {
        radius = radius * 1609.344; // convert radius from miles to meters
        if (radius > 40000) { // yelp only accepts up to 40000 meters
            radius = 40000;
        } else if (radius < 0) {
            radius = 0;
        }
        return Math.floor(radius); // yelp API only accepts integers for distance
    },

 getEmptyDestination: function () {
    return {
        name: "No result! Try again?",
        loc: "",
        image_url: "./assets/question-mark.jpg",
        url: "",
        phone: "",
        rating: [],
        reviews: "",
        category: 'none',
        price: "",
        coordinates: {
            latitude: null,
            longitude: null
        }
    };
},

getCacheKey: function (queryData) {
    return queryData.city.toUpperCase() + queryData.category + module.exports.bucketizeRadius(queryData.radius) + queryData.price;
},

bucketizeRadius: function (num) {
    return Math.floor(num / 10001);
},

selectRandomResultsForCategory: function (randomConfig) {
    const { results, randomDestinations, randomDestinationsSet, destinations, category, res } = randomConfig;
    console.log(randomDestinations);
    console.log(category);
    let randomDest;
    for (let i = 0; i < destinations.length; i++){
        if (destinations[i].kind === category){
            for (let j = 0; j < maxRandomTries; j++) {
                randomDest = results[Math.floor(Math.random() * results.length)];
                if (randomDest && !randomDestinationsSet.has(randomDest.id)) {
                    randomDestinations[i] = randomDest;
                    randomDestinationsSet.add(randomDest.id);
                    break;
                } else {
                    randomDest = null;
                }
            }
            if(!randomDest) {
                randomDestinations[i] = module.exports.getEmptyDestination();
            }
            if (module.exports.truthyLength(randomDestinations) >= destinations.length) {
                return res.json(randomDestinations);
            }
        }
    }
},
    selectOneRandomResult: function (results, otherDestIDs, res) {
        const idSet = new Set(otherDestIDs);
        if(!results.length) {
            return res.json(module.exports.getEmptyDestination());
        } else {
            let randomDest;
            for (let i = 0; i < maxRandomTries; i++) {
                randomDest = results[Math.floor(Math.random() * results.length)];
                if(!idSet.has(randomDest.id)) {
                    break;
                }
            }
            if(!randomDest) {
                randomDest = module.exports.getEmptyDestination();
            }
            return res.json(randomDest);
        }
},

 truthyLength: function (arr) {
    return arr.reduce((count, val) => {return count + !!val}, 0);
}
};
