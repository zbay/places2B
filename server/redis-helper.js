const redis = require("redis"),
    redisClient = redis.createClient();

const secondsPerWeek = 60 * 60 * 24 * 70;

module.exports = {
    retrieveFromRedis: async (cacheKey) => {
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
                }
                return resolve(results);
            }
        }));
    },

    saveResultsToRedis: async (cacheKey, category, results) => {
        return new Promise((resolve) => {
            results = results.map((result) => module.exports.cleanSearchResult(result, category));
            results.forEach((result) => {
                redisClient.hset(cacheKey, result.id, JSON.stringify(result));
                redisClient.expire(cacheKey, secondsPerWeek);
            });
            resolve(results);
        });
    },

    cleanSearchResult: (result, category) => {
            if (result) {
                result = {
                    id: result.id,
                    loc: result.location && result.location.display_address ? result.location.display_address.join(", ") : 'Varies',
                    name: result.name || "Unnamed",
                    image_url: result.image_url || "./assets/question-mark.jpg",
                    url: result.url || "N/A",
                    phone: result.display_phone || "N/A",
                    rating: module.exports.getStars(result.rating),
                    reviews: "Yelp reviews: " + (result.review_count ? result.review_count : "0"),
                    category: category,
                    price: result.price || '',
                    // the next two are unused but may be useful later
                    coordinates: result.coordinates,
                    categories: result.coordinates
                };
            }
            return result;
        },

    getStars: (numStars) => {
        if (!numStars) {
            numStars = 0;
        }
        let stars = [];
        for (let i = 0; i < Math.round(numStars); i++) {
            stars.push('*');
        }
        return stars;
    }

};