const express = require('express');
const axios = require('axios');
const port = 4001;
const path = require('path');
const app = express();

const pool = require('../db/index.js');
const { getReviews, postReview, getMetaData, markHelpful, markReported } = require('./queries.js');

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Success!');
});

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


app.put('/reviews/:review_id/helpful', (req, res) => {
  let reviewID = req.params.review_id;

  markHelpful(reviewID, (err, results) => {
    if (err) {
      console.log('Error retrieving messages ' + err);
      res.sendStatus(404);
    } else {
      res.status(204).send('Review marked helpful!');
    }
  });
})


app.put('/reviews/:review_id/report', (req, res) => {
  let reviewID = req.params.review_id; // Id of review to be reported

  markReported(reviewID, (err, results) => {
    if (err) {
      console.log('Error retrieving messages ' + err);
      res.sendStatus(404);
    } else {
      res.status(204).send('Review has been reported!');
    }
  });
})


app.listen(port, () => {
  console.log(`listening on port ${port}`);
});