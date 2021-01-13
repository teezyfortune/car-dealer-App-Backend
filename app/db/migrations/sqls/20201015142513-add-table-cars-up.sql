CREATE TYPE product_category_type AS ENUM (
     'car',
     'lorry',
     'bus',
     'pick-up'
     'truck'
);

CREATE TABLE IF NOT EXISTS users (
     id uuid PRIMARY KEY,
     email VARCHAR NOT NULL,
     password VARCHAR NOT NULL,
     salt VARCHAR NOT NULL,
     isAdmin BOOLEAN NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product (
     id uuid PRIMARY KEY NOT NULL,
     vehicle_type product_category_type NOT NULL,
     product_name varchar NOT NULL,
     image_url varchar NOT NULL,
     created_at timestamptz DEFAULT NOW(),
     updated_at timestamptz DEFAULT NOW()
     )
