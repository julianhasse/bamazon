-- ///////////////////////////////////////////////////

-- author: Julian Hasse
-- project: bamazon / homework
-- date: 2017/11/11

-- ///////////////////////////////////////////////////



-- Init database /////////////////////////////////////

DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;



-- create table products /////////////////////////////

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(80) NULL,
	department_name VARCHAR(80) NULL,
	price DECIMAL(10,2) NULL,
	stock_quantity INT NULL,
	PRIMARY KEY(item_id)
);



-- music gear products //////////////////////////////
 
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES		("Fender Strat Olympic White", "music_gear", 350, 12),
			("Fender Telecaster Blonde", "music_gear", 380, 12),
            ("Gibson 175D Archtop Vintage ", "music_gear", 850, 20),
            ("Gibson Les Paul Burgundy", "music_gear", 900, 20),
            ("Martin D50 Acoustic Oak", "music_gear", 750, 12),
            ("Ibanez George Benson Sunburst", "music_gear", 650, 30),
            ("Taylor Baby Acoustic White", "music_gear", 250, 30);


-- music accesories products //////////////////////////////
 
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES		("Fender Guitar Strap", "music_gear", 24.50, 24),
            ("Gibson Guitar Strap", "music_gear", 28.75, 24),
            ("D'Addario strings Light .09", "music_gear", 9.99, 120),
            ("D'Addario strings Medium .10", "music_gear", 9.99, 120),
            ("D'Addario strings Heavy .12", "music_gear", 10.45, 120),
            ("Ernie Ball Regular Slinky .08", "music_gear", 9.99, 120),
            ("Ernie Ball Heavy Duty .10", "music_gear", 11.99, 3);



SELECT * FROM products;
            
