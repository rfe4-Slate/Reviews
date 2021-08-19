const axios = require('axios');
const request = require('supertest');
const express = require('express');
const app = require('../server/server.js');


test('server is running', () => {
  axios.get('localhost:4001/')
  .then((response) => {
    expect(response).toBeDefined();
  })
  .catch((err) => {
    // console.log(err);
  })
});

test('should return the requested number of reviews', () => {
  axios.get('localhost:4001/reviews?count=11')
  .then((response) => {
    console.log('responding', response)
    expect(response).toHaveLength(11);
  })
  .catch((err) => {
    // console.log(err);
  })
});


describe('GET request to localhost /', () => {
  test('get request responds with 200 status', () => {
    return request(app)
      .get('/')
      .then((response) => {
        expect(response.statusCode).toBe(200)
      })
  });
});

describe('GET request to /reviews', () => {
  test('get review request responds with 200 status', () => {
    return request(app)
      .get('/reviews')
      .query({product_id: 212})
      .then((response) => {
        expect(response.statusCode).toBe(200)
      })
  });
});


describe('GET request to /reviews', () => {
  test('get review request returns review query with required structure', () => {
    return request(app)
      .get('/reviews')
      .query({product_id: 212})
      .then((response) => {
        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body.results)).toBe(true)
      })
  });
});

describe('PUT request to /reviews', () => {
test('reviews put request returns with status code 204', () => {
  return request(app)
    .put('/reviews/584544/helpful')
    .then((response) => {
      expect(response.statusCode).toBe(204)
    })
});
});