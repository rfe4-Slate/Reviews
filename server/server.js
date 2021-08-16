const express = require('express');
const axios = require('axios');
const port = 4001;
const path = require('path');
const app = express();

const pool = require('../db/index.js');
const { getReviews, postReview, getMetaData, getPhotos, markHelpful, markReported } = require('./queries.js');

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Success!');
});


// user sends get request --> /reviews?product_id=1
// /reviews?product_id=17068&count=10&sort=helpful&page=2
// queryParams { product_id: '17068', count: '10', sort: 'helpful', page: '2' }

app.get('/reviews', (req, res) => {
  let queryParams = req.query;

  if (!queryParams.product_id) {
    res.status(422).send('Error: invalid product_id provided');
  } else {

    getReviews(queryParams, (err, results) => {
      if (err) {
        console.log('Error retrieving messages ' + err);
        res.sendStatus(404);
      } else {
        res.status(200).json(results);
      }
    });

  }
});

app.post('/reviews', (req,res) => {
  let newReview = req.body;

  postReview(newReview, (err, results) => {
    if (err) {
      console.log('Error retrieving messages ' + err);
      res.sendStatus(404);
    } else {
      res.status(201).send('Posted!');
    }
  });

});


app.get('/reviews/meta', (req, res) => {

  let queryParams = req.query; // user will send product_id
  console.log('meta data req', queryParams)

  if (!queryParams.product_id) {
    res.status(422).send('Error: invalid product_id provided');
  } else {

    getMetaData(queryParams, (err, results) => {
      if (err) {
        console.log('Error retrieving messages ' + err);
        res.sendStatus(404);
      } else {
        res.status(200).json(results);
      }
    });

  }

});


app.put('/reviews/review_id/helpful', (req, res) => {
  let reviewID = req.params; // ?

  markHelpful(reviewID, (err, results) => {
    if (err) {
      console.log('Error retrieving messages ' + err);
      res.sendStatus(404);
    } else {
      res.status(200).send('Review marked helpful!');
    }
  });
})


app.put('/reviews/review_id/report', (req, res) => {
  let reviewID = req.params; // ?

  markHelpful(reviewID, (err, results) => {
    if (err) {
      console.log('Error retrieving messages ' + err);
      res.sendStatus(404);
    } else {
      res.status(200).send('Review has been reported!');
    }
  });
})


app.get('/reviews/test', (req, res) => {

  getPhotos((err, results) => {
    if (err) {
      console.log('Error retrieving messages ' + err);
      res.sendStatus(404);
    } else {
      res.status(200).json(results);
    }
  });

})

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});



























    // getPhotos((err, results) => {
    //   if (err) {
    //     console.log('Error retrieving messages ' + err);
    //     res.sendStatus(404);
    //   } else {
    //     // console.log('I got some results back', results);
    //     // results.rows --- an array of all matching rows based on query
    //     // results.fields --- all fields of table queried
    //     res.status(200).json(results);
    //   }
    // });