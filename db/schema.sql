DROP DATABASE IF EXISTS sdcService;

CREATE DATABASE sdcService;

CREATE TABLE review (
  id SERIAL PRIMARY KEY,
  product_id int NOT NULL,
  rating int NOT NULL,
  date bigint NOT NULL,
  summary varChar(500) NOT NULL,
  body varChar(1000) NOT NULL,
  recommend boolean,
  reported boolean,
  reviewer_name varChar(100) NOT NULL,
  reviewer_email varChar(200) NOT NULL,
  response varChar(500),
  helpfulness int
);

CREATE TABLE reviewPhotos (
  id SERIAL PRIMARY KEY NOT NULL,
  review_id int NOT NULL,
  url varChar(1000) NOT NULL,
  FOREIGN KEY (review_id) REFERENCES review(id)
);

CREATE TABLE characteristics (
  id SERIAL PRIMARY KEY NOT NULL,
  product_id int NOT NULL,
  name varChar(200)
);

CREATE TABLE characteristic_reviews (
  id SERIAL PRIMARY KEY NOT NULL,
  characteristic_id int NOT NULL,
  review_id int NOT NULL,
  value int,
  FOREIGN KEY (characteristic_id) REFERENCES characteristics(id),
  FOREIGN KEY (review_id) REFERENCES review(id)
);






--- sudo service postgresql start
--- sudo -i -u postgres psql

--- within postgres=#

--- \i (runs file)
--- \i *filepath /schema.sql*