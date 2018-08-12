CREATE DATABASE bamazon;
USE bamazon;
DROP TABLE IF EXISTS products;

CREATE TABLE products (
item_id INTEGER NOT NULL auto_increment,
product_name VARCHAR(200) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price DECIMAL(10,2) NOT NULL,
stock_quantity INTEGER(6) NOT NULL,
primary key (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Neir Automata", "Video Games", 39.95, 100),
("Monster Hunter World", "Video Games", 49.95, 200),
("Call of Duty: Black Ops Eleventeen", "Video Games", 59.95, 1111),
("Cloud Atlas", "Movies", 19.95, 30),
("Super Troopers 2", "Movies", 24.95, 100),
("Pirates of the Caribbean 9: Jack Sparrow's Curse of the Infinite Rum Bottle", "Movies", 29.95, 200),
("110% Real 3ct Diamond Ring", "Jewelry", 12.95, 30000),
("Mr. T's Gold Chain Set", "Jewelry", 9999.95, 1),
("Tesla Death Ray", "Weapons", 249999.95, 10),
("*Used* Prison Shank", "Weapons", 19.95, 187);

SELECT * FROM products;

UPDATE products
SET price = 12.99
WHERE item_id = 7;

UPDATE products
SET stock_quantity = 200
WHERE item_id = 6;

