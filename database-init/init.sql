-- This script will be run automatically when the PostgreSQL container starts for the first time.

-- Create the restaurants table with all necessary columns
CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cuisine VARCHAR(50),
    address VARCHAR(255),
    image_url VARCHAR(255),
    rating NUMERIC(2, 1),
    delivery_time VARCHAR(50)
);

-- Create the menu_items table
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image_url VARCHAR(255)
);

-- Insert all the restaurant data
INSERT INTO restaurants (id, name, cuisine, address, image_url, rating, delivery_time) VALUES
(1, 'Burger Palace', 'American', '101 Burger Ave', 'burger-palace.jpg', 4.5, '30-45 min'),
(2, 'Pizza Haven', 'Italian', '202 Pizza Pl', 'pizza-haven.jpg', 4.3, '40-55 min'),
(3, 'Tandoori Treats', 'Indian', '303 Curry Rd', 'tandoori-treats.jpg', 4.7, '25-35 min'),
(4, 'Sushi Delight', 'Japanese', '404 Wasabi St', 'sushi-delight.jpg', 4.8, '20-30 min'),
(5, 'Dim Sum Dynasty', 'Chinese', '505 Dumpling Ct', 'dim-sum-dynasty.jpg', 4.6, '30-40 min'),
(6, 'Mexican Fiesta', 'Mexican', '606 Taco Blvd', 'mexican-fiesta.jpg', 4.4, '35-50 min'),
(7, 'Bistro Paris', 'French', '707 Eiffel Pk', 'bistro-paris.jpg', 4.5, '45-60 min'),
(8, 'Lebanese Bites', 'Lebanese', '808 Shawarma Wy', 'lebanese-bites.jpg', 4.3, '25-35 min'),
(10, 'Greek Eats', 'Greek', '909 Gyro Ln', 'greek-eats.jpg', 4.7, '30-40 min');

-- Insert all the menu item data
INSERT INTO menu_items (restaurant_id, id, name, description, price, image_url) VALUES
(1, 1, 'Classic Burger', 'Juicy beef patty with fresh vegetables', 9.99, 'classic-burger.jpg'),
(1, 2, 'Cheese Fries', 'Crispy fries with melted cheese', 4.99, 'cheese-fries.jpg'),
(2, 3, 'Margherita Pizza', 'Classic tomato and mozzarella', 12.99, 'margherita-pizza.jpg'),
(2, 4, 'Pepperoni Pizza', 'Spicy pepperoni with cheese', 14.99, 'pepperoni-pizza.jpg'),
(1, 6, 'Spaghetti Carbonara', 'Classic Italian pasta dish with pancetta and creamy sauce', 11.99, 'spaghetti-carbonara.jpg'),
(1, 7, 'BBQ Ribs', 'Tender pork ribs with a smoky barbecue glaze', 15.99, 'bbq-ribs.jpg'),
(1, 9, 'Buffalo Wings', 'Spicy chicken wings served with a side of ranch dressing', 9.49, 'buffalo-wings.jpg'),
(1, 10, 'Veggie Burger', 'Plant-based patty with fresh vegetables and vegan mayo', 10.49, 'veggie-burger.jpg'),
(1, 11, 'Chocolate Cake', 'Rich and moist chocolate cake with a ganache topping', 5.99, 'chocolate-cake.jpg'),
(1, 12, 'Iced Coffee', 'Refreshing iced coffee with your choice of milk', 3.99, 'iced-coffee.jpg'),
(3, 13, 'Tandoori Chicken', 'Chicken marinated in yogurt and spices', 13.99, 'tandoori-chicken.jpg'),
(3, 14, 'Garlic Naan', 'Soft flatbread with garlic and butter', 3.99, 'garlic-naan.jpg');

