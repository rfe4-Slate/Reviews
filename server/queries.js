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

  let queryString = `SELECT review.id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness, ARRAY_AGG (json_build_object('id', reviewPhotos.id, 'url' , url)) as photos FROM review LEFT JOIN reviewPhotos ON review_id = review.id WHERE product_id = ${productID} GROUP BY review.id ORDER BY ${orderedBy} LIMIT ${count}`;

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
    finalResult['results'] = results.rows;
    callback(null, finalResult);
  }).catch((err) => {
    callback(err, null);
  });
}

const getPhotos = (callback) => {
  let queryString = 'SELECT * FROM reviewPhotos WHERE review_id = 2283091';

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

const postReview = (callback) => {
  let queryString = 'SELECT * FROM reviewPhotos WHERE review_id = 2283091';

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
  getPhotos: getPhotos
}