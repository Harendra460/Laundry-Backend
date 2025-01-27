CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vendors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    address VARCHAR(255),
    city VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    contact_number VARCHAR(20)
);


CREATE TABLE services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100)
);

CREATE TABLE vendor_services (
    vendor_id INT,
    service_id INT,
    price DECIMAL(10, 2),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

INSERT INTO vendors (name, city, latitude, longitude) VALUES
('Clean Wave Laundry', 'Hyderabad', 17.3850, 78.4867),
('Quick Wash', 'Bangalore', 12.9716, 77.5946),
('City Cleaners', 'Chennai', 13.0827, 80.2707),
('Mumbai Laundry Co', 'Mumbai', 19.0760, 72.8777),
('Delhi Dry Cleaners', 'Delhi', 28.6139, 77.2090);


INSERT INTO services (name) VALUES 
('Wash'),
('Fold'),
('Dry Cleaning'),
('Ironing'),
('Wash & Fold'),
('Wash & Ironing');