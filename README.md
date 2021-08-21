# Reviews & Ratings API for E-Commerce Website

The goal of this project was to replace an existing API with a back end system that can support the full data set for an E-commerce site that can scale to meet the demands of production traffic.

## Tech Stack

**Server:** Node, Express

**Database:** PostgreSQL

**Deployment:** AWS EC2 - 20.04 Ubuntu - 30gb SDD 1gb RAM

**Unit Testing:** Jest, Supertest

**Development Stress Testing:** Artillery

**Production Stress Testing:** Loader.io

## Installation

Install my-project with npm

```bash
  npm install my-project
```

## API Reference

#### Get Reviews

```http
  GET /reviews?product_id=21233
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `page` | `integer` | Selects the page of results to return. Default 1. |

#### Get MetaData for Review

```http
  GET /reviews/meta?product_id=21233
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `product_id`      | `integer` | Required ID of the Product requested |

## Authors
[@SandraM1](https://github.com/SandraM1)
