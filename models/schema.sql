DROP DATABASE IF EXISTS blanca_rossi;

CREATE DATABASE IF NOT EXISTS blanca_rossi;

USE blanca_rossi;

CREATE TABLE IF NOT EXISTS products(
    product_id VARCHAR(9) PRIMARY KEY,
    product_name VARCHAR(100),
    product_model varchar(100),
    product_description VARCHAR(255),
    price FLOAT(),
    img VARCHAR(255),
)

CREATE TABLE IF NOT EXISTS usuarios(
    usuario_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_name VARCHAR(100),
    user_email varchar(50) unique,
    user_password VARCHAR(255),
)