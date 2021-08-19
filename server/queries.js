const pool = require('../db/index.js');


const getReviews = (parameters, callback) => {
  let productID = parameters.product_id;
  let count = parameters.count || 5;
  let page = parameters.page || 1;
  let sort = parameters.sort || 'relevant'; // sort could be by newest helpful relevant

  if (sort === 'newest') {
    let orderedBy = 'date DESC'
  }
  if (sort === 'helpful') {
    orderedBy = 'helpfulness DESC'
  }
  if (sort === 'relevant') {
    orderedBy = 'date DESC, helpfulness DESC'
  }
  // REPORTED can be false or null   --- do not send back if reported is true

  let queryString = `SELECT review.id AS review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness,
    ARRAY_AGG (json_build_object('id', reviewPhotos.id, 'url' , url)) as photos FROM review
    LEFT JOIN reviewPhotos ON review_id = review.id WHERE product_id = ${productID} AND reported != true
    GROUP BY review.id
    ORDER BY ${orderedBy} LIMIT ${count}`;

  let finalResult = {
    "product": `${productID}`,
    "page": `${page}`,
    "count": `${count}`,
    "results": []
  }

  return new Promise((resolve, reject) => {
    pool.query(queryString, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  }).then((results) => {
    finalResult['results'] = results.rows;
    callback(null, finalResult);
  }).catch((err) => {
    callback(err, null);
  });
}



const postReview = (addedReview, callback) => {
  let productID = addedReview.product_id;
  let rating = addedReview.rating;
  let summary = addedReview.summary;
  let body = addedReview.body;
  let recommend = addedReview.recommend;
  let name = addedReview.name;
  let email = addedReview.email;
  let url = addedReview.photos; // this is an array of url strings
  let allChars = Object.keys(addedReview.characteristics);
  let allValues = Object.values(addedReview.characteristics);

  let values = [addedReview.product_id, addedReview.rating, addedReview.summary, addedReview.body, addedReview.recommend, addedReview.name,
    addedReview.email, addedReview.photos, allChars, allValues]

  let queryString = `WITH newReview AS (
      INSERT INTO review
      (product_id, rating, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
      VALUES
      ($1, $2, $3, $4, $5, false, $6, $7, null, 0) RETURNING id),
    addPhotos AS (
      INSERT INTO reviewPhotos (review_id, url)
      SELECT id, unnest(($8)::text[]) FROM newReview RETURNING *),
    addChars AS (
      INSERT INTO characteristic_reviews(characteristic_id, review_id, value)
      SELECT unnest(($9)::int[]), id, unnest(($10)::int[]) FROM newReview RETURNING *)
      SELECT * FROM addChars`;

  return new Promise((resolve, reject) => {
    pool.query(queryString, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  }).then((results) => {
    callback(null, results);
  }).catch((err) => {
    callback(err, null);
  });
}



const getMetaData = (parameter, callback) => {
  let productID = parameter.product_id;
  let queryOne = `SELECT rating, recommend FROM review WHERE product_id = ${productID}`; // given a productID - returns an object

  let queryTwo = `SELECT name, product_id, characteristic_id, AVG(characteristic_reviews.value) FROM characteristics
        INNER JOIN characteristic_reviews ON characteristics.id = characteristic_id
        WHERE product_id = ${productID}
        GROUP BY characteristic_id, name, product_id`;

  let finalResult = {
    "product_id": `${productID}`,
    "ratings": {},      /// ratings is in review table -- get rating from all reviews table -- get average for each rating
    "recommended": {    /// recommended is in review table
      "false": 0,
      "true": 0
    },
    "characteristics": {}
  }

  return new Promise((resolve, reject) => {
    pool.query(queryOne, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  }).then((results) => {
    let firstQuery = results.rows; // an array of objs

    firstQuery.forEach((item) => {
      if (!finalResult['ratings'][item.rating]) { // if not currently in obj, begin count
        finalResult['ratings'][item.rating] = 1;
      } else {
        finalResult['ratings'][item.rating]++;
      }
      if (item.recommend === true) {
        finalResult['recommended']['true']++;
      }
      if (item.recommend === false) {
        finalResult['recommended']['false']++;
      }
    })

    pool.query(queryTwo, (err, results) => {
      if (err) {
        console.log('err', err);
      } else {
        results.rows.map((item) => {
          finalResult['characteristics'][item.name] = {'id': item.characteristic_id, 'value': item.avg};
        })

        callback(null, finalResult);
      }
    })
  }).catch((err) => {
    callback(err, null);
  });
}



const markHelpful = (reviewID, callback) => {  // increment helpfulness int
  let queryString = `UPDATE review SET helpfulness = helpfulness + 1 WHERE id = ${reviewID}`;

  return new Promise((resolve, reject) => {
    pool.query(queryString, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  }).then((results) => {
    callback(null, results);
  }).catch((err) => {
    callback(err, null);
  });
}


const markReported = (reviewID, callback) => {  // update reported field to true
  let queryString = `UPDATE review SET reported = true WHERE id = ${reviewID}`;

  return new Promise((resolve, reject) => {
    pool.query(queryString, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  }).then((results) => {
    callback(null, results);
  }).catch((err) => {
    callback(err, null);
  });
}


module.exports = {
  getReviews: getReviews,
  postReview: postReview,
  getMetaData: getMetaData,
  markHelpful: markHelpful,
  markReported: markReported
}