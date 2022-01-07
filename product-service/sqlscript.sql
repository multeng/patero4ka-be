CREATE DATABASE pyatero4kaDB
CREATE TABLE products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    description text,
    img text,
    price INTEGER
)

CREATE TABLE stocks (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	product_id uuid REFERENCES products (id),
	count INTEGER
)


INSERT INTO products (id, title, description, img, price) VALUES
('12d7d3ac-1e61-4962-9de5-7acc06048afa', 'bread', 'desc', null, 30),
('2fec1dbf-b537-456e-92f9-4bff0d42e96a', 'sausages', 'desc', null, 115),
('370c7641-f5fb-4107-9679-bc2f7668ae50', 'eggs', 'desc', null, 99),
('84f444b6-7efd-4df0-a457-fe98b972033b', 'tomatoes', 'desc', null, 300),
('86f78daa-f78d-4db6-a857-00d8b613d4c5', 'mushrooms', 'desc', null, 288),
('bc1bfa05-c599-41d1-9259-0ce62f703cdf', 'beer', 'desc', null, 56)


INSERT INTO stocks (product_id, count)
    VALUES
    ('12d7d3ac-1e61-4962-9de5-7acc06048afa', 10),
    ('2fec1dbf-b537-456e-92f9-4bff0d42e96a', 40),
    ('370c7641-f5fb-4107-9679-bc2f7668ae50', 80),
    ('84f444b6-7efd-4df0-a457-fe98b972033b', 38),
    ('86f78daa-f78d-4db6-a857-00d8b613d4c5', 24),
    ('bc1bfa05-c599-41d1-9259-0ce62f703cdf', 9999)




create extension if not exists "uuid-ossp";