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

  let queryString = `SELECT review.id, rating, summary, recommend, reported, response, body, date, reviewer_name, helpfulness,
    ARRAY_AGG (json_build_object('id', reviewPhotos.id, 'url' , url)) as photos FROM review
    LEFT JOIN reviewPhotos ON review_id = review.id WHERE product_id = ${productID} GROUP BY review.id
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
    console.log('USER GET promise resolved');
    // results.rows --- an array of all matching rows based on query
    // results.fields --- all fields of table queried
    console.log('results from getting reviews', results.rows);

    finalResult['results'] = results.rows;
    callback(null, finalResult);
  }).catch((err) => {
    callback(err, null);
  });
}



const postReview = (addedReview, callback) => {
  console.log('adding this review', addedReview)
  let productID = addedReview.product_id;
  let rating = addedReview.rating;
  let summary = addedReview.summary;
  let body = addedReview.body;
  let recommend = addedReview.recommend;
  let name = addedReview.name;
  let email = addedReview.email;
  let url = addedReview.photos[0]; // this is an array of url strings
  let allChars = Object.keys(addedReview.characteristics);
  let charID =allChars[0]; // this is the first key of the obj - which represents char_id
  let charRatingValue = addedReview.characteristics[charID];

  let queryString = `WITH newReview AS (
      INSERT INTO review
      (product_id, rating, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
      VALUES
      ('${productID}', '${rating}', '${summary}', '${body}', '${recommend}', false, '${name}', '${email}', null, 0) RETURNING id),
    addPhotos AS (
      INSERT INTO reviewPhotos (review_id, url)
      SELECT id, '${url}' FROM newReview RETURNING *),
    addChars AS (
      INSERT INTO characteristic_reviews(characteristic_id, review_id, value)
      SELECT '${charID}', id, '${charRatingValue}' FROM newReview RETURNING *)
      SELECT * FROM addChars`;

  return new Promise((resolve, reject) => {
    pool.query(queryString, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  }).then((results) => {
    console.log('USER POST promise resolved');
    // console.log('results from posting a review', results)
    callback(null, results);
  }).catch((err) => {
    callback(err, null);
  });
}



const getMetaData = (parameter, callback) => {
  let productID = parameter.product_id;
  let queryString = `SELECT rating, recommend FROM review WHERE product_id = ${productID}`; // given a productID - returns an object

  let queryTwo = `WITH first AS (
    SELECT id, name FROM characteristics WHERE product_id = ${productID} RETURNING id, name),
    second AS (
      SELECT value FROM characteristic_reviews WHERE characteristic_id = id FROM first RETURNING value
    )`;

  let finalResult = {
    "product_id": `${productID}`,
    "ratings": {          /// ratings is in review table -- get rating from all reviews table -- get average for each rating
    },
    "recommended": {        /// recommended is in review table
      "false": 0,
      "true": 0
    },
    "characteristics": {    /// select all char id & names given product_id in chars table ----  search char_reviews table given each id
                                                                                              // get average of all value rating to get final value count
      "Fit": {
        "id": "char_id",
        "value": "avg of all values"
      },
      "Length": {
        "id": "char_id",
        "value": "avg of all values"
      },
      "Comfort": {
        "id": "char_id",
        "value": "avg of all values" // ---varchar datatype
      },
    }
  }



  return new Promise((resolve, reject) => {
    pool.query(queryTwo, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  }).then((results) => {
    let firstQuery = results.rows; // an array of objs
    console.log('what is this first', firstQuery)

    // firstQuery.forEach((item) => {
    //   if (!finalResult['ratings'][item.rating]) { // if not currently in obj, begin count
    //     finalResult['ratings'][item.rating] = 1;
    //   } else {
    //     finalResult['ratings'][item.rating]++;
    //   }
    //   if (item.recommend === true) {
    //     finalResult['recommended']['true']++;
    //   }
    //   if (item.recommend === false) {
    //     finalResult['recommended']['false']++;
    //   }
    // })

    // pool.query(queryTwo, (err, results) => {
    //   if (err) {
    //     console.log('err', err);
    //   } else {
    //     callback(null, results);
    //   }
    // })



    callback(null, results);
  }).catch((err) => {
    callback(err, null);
  });
}



const markHelpful = (reviewID, callback) => {
  // increment helpfulness int

  let queryString = 'UPDATE * FROM review WHERE product_id = 4';

  return new Promise((resolve, reject) => {
    pool.query(queryString, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  }).then((results) => {
    console.log('USER GET promise resolved');
    console.log('results from photos', results)
    callback(null, results);
  }).catch((err) => {
    callback(err, null);
  });
}




const markReported = (reviewID, callback) => {
  // update reported field to true

  let queryString = 'UPDATE * FROM review WHERE product_id = 4';

  return new Promise((resolve, reject) => {
    pool.query(queryString, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  }).then((results) => {
    console.log('USER GET promise resolved');
    console.log('results from photos', results)
    callback(null, results);
  }).catch((err) => {
    callback(err, null);
  });
}



const getPhotos = (callback) => {
  // let queryString = 'SELECT * FROM review WHERE product_id = 4';
  // let queryString = 'SELECT * FROM characteristics WHERE product_id = 37311';
  // let queryString = 'SELECT * FROM review WHERE id = 5774952';

  // let queryString = 'SELECT * FROM review WHERE id = 5774956';
  // my test one with ian but not inserting into photos/chars table

  // let queryString = 'SELECT * FROM reviewPhotos WHERE review_id = 5774963';

  // let queryString = 'SELECT * FROM review WHERE id = 5774963';

  let photos = ["https://source.unsplash.com/random", "https://source.unsplash.com/random"];

  // let queryString = `INSERT INTO reviewPhotos (review_id, url) VALUES (5774963, 'https://source.unsplash.com/random')`; --- this works!
  // let queryString = `INSERT INTO reviewPhotos (review_id, url) VALUES (5774963, photo::text[] FROM unnest(${photos}::text[]) AS t (photo))`; --- this does not work
  let queryString = `INSERT INTO reviewPhotos (review_id, url)
  VALUES (5774963, unnest('${photos}'::text[])
  )`;

  return new Promise((resolve, reject) => {
    pool.query(queryString, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  }).then((results) => {
    console.log('USER GET promise resolved');
    console.log('results from photos', results)
    callback(null, results);
  }).catch((err) => {
    callback(err, null);
  });
}



module.exports = {
  getReviews: getReviews,
  postReview: postReview,
  getMetaData: getMetaData,
  getPhotos: getPhotos,
  markHelpful: markHelpful,
  markReported: markReported
}