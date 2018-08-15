# Bamazon

An App that allows user to store items in a mySQL database and interact with those items via node.js CLI.
### Required npm's
1. inquirer
2. mysql
3. cli-table

## How to Use:
Fill in your own password in var connection.
#### bamazonCustomer.js
User enters node bamazonCustomer.js in command line and is presented with a table of items they can purchase.
Upon completing the transaction, the table is updated with current remaining inventory.
#### bamazonManager.js
User enters node bamazonManager.js in command line and is presented with a menu with 4 options:
1. View Products for Sale
2. View Low Inventory
3. Add to Inventory
4. Add New Product

From here, the user can alter the inventory and add new items if they wish.
#### Use 
This app is a good start for understanding and creating a database of items you wish to keep inventory of and maintain. With some additions, it can also track company expenses, sales and profits.

[Bamazon Demo](https://youtu.be/Igt3z_AAl4c)
