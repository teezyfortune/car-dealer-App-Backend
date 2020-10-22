CREATE TABLE IF NOT EXISTS vehicles_category (
     cat_id uuid PRIMARY KEY NOT NULL,
     vehicle_name varchar(125) NOT NULL,
     created_at timestamptz DEFAULT NOW(),
     updated_at timestamptz DEFAULT NOW());


CREATE TABLE IF NOT EXISTS vehicle_product (
     vehicle_id uuid PRIMARY KEY NOT NULL,
     vehicle_type uuid REFERENCES vehicles_category (cat_id) CASCADE  NOT NULL,
     vehicle_name varchar(125) NOT NULL,
     imageUrl varchar(125) NOT NULL,
     created_at timestamptz DEFAULT NOW(),
     updated_at timestamptz DEFAULT NOW())
