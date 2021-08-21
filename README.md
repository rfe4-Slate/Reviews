# Reviews & Ratings API for E-Commerce Website

The goal of this project was to replace an existing API with a back end system that can support the full data set for an E-commerce site that can scale to meet the demands of production traffic. 
Data consisted of over 10 million lines of csv data. This data comprised of ratings and reviews for several million products.
Used PostgreSQL to create my database and designed my schema to account for the relationship of data I would be responsible for. Utilized the ETL process to transfer the data set into my database, while altering my column datatypes if it was not in the correct type as required by the front end. 
For deployment, utilized two EC2 Instances in order to deploy my server on one and database on the other. 

## Tech Stack

**Server:** Node, Express

**Database:** PostgreSQL

**Deployment:** AWS EC2 - 20.04 Ubuntu - 30gb SDD 1gb RAM

**Unit Testing:** Jest, Supertest

**Development Stress Testing:** Artillery

**Production Stress Testing:** Loader.io

## Installation

Install [PostgreSQL](https://www.postgresql.org/download/) 

Install with npm

```bash
  npm install
  npm start
```

## API Reference

#### Get Reviews

  Returns all reviews for a given product ID

```http
  GET /reviews?product_id=21233
```

Query Parameters

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `product_id` | `int` | Required. Specifies the product for which to retrieve reviews for |
| `page` | `int` | Optional. Specifies the page of results to return. Default 1 |
| `count` | `int` | Optional. Specifies the number of results per page to return. Default 5 |
| `sort` | `string` | Optional. Changes the sort order of reviews. Options - newest, helpful, relevant. Default relevant |

  Response

```http
  Status: 200 OK
```


#### Get MetaData for Reviews
  
  Returns metadata for a given product ID

```http
  GET /reviews/meta?product_id=21233
```

Query Parameters

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `product_id`      | `int` | Required. Specifies the product for which to retrieve metadata for |


  Response

```http
  Status: 200 OK
```


## Authors
[@SandraM1](https://github.com/SandraM1)
