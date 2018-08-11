var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "menikmati",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;
        mainMenu(res.length);
    });
    
});

// displays items in table
function displayItems() {
    var table = new Table({
        head: ['ID:', 'Product name:', 'Department Name:', 'Price:', "Stock:"],
        colWidths: [5, 80, 20, 12, 8]
    });

    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
          table.push(
              [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
          );
        }
        console.log(table.toString());
        mainMenu(res.length);
    });
}

//displays items with <=5 stock
function lowInv(items) {
    var query = "SELECT * FROM products HAVING stock_quantity <=5";
    var table = new Table({
        head: ['ID:', 'Product name:', 'Department Name:', 'Price:', "Stock:"],
        colWidths: [5, 80, 20, 12, 8]
    });
    connection.query(query, function(err,res){
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            table.push(
              [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
          );
        }
        console.log(table.toString());
        mainMenu(items);
    })
}

//confirm adding to inv
function addInv(stock, item, units, name) {
    inquirer.prompt({
        name:"confirm",
        type: "confirm",
        message: `Are you sure you want to add ${units} to '${name}' stock?`
    }).then(function() {
        var query = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
        connection.query(query, [stock, item], function(err,res){
            displayItems();
        });
    });
}
//allows manager to add stock_quantities
function addInvPrompt(items) {
    inquirer.prompt([{
        name: "product",
        type: "input",
        message: "Enter the ID number for the product you wish to adjust.",
        validate: function(value){
            if(isNaN(value) == false && value <= items && value > 0){
                return true;
            } else {
                return false;
            }
        }
    }, {
        name: "units",
        type: "input",
        message: "Enter the amount of units you would like to add",
        validate: function(value){
            if(isNaN(value) == false && value > 0){
                return true;
            } else {
                return false;
            }
        }
    }]).then(function(answer) {
        var query = "SELECT stock_quantity, product_name FROM products WHERE ?";
        connection.query(query, {item_id: answer.product}, function(err,res){
            var productName = res[0].product_name;
            var chosenItemStock = res[0].stock_quantity;
            var unitsToAdd = parseFloat(answer.units);
            var updatedStock = chosenItemStock + unitsToAdd;
            addInv(updatedStock, answer.product, unitsToAdd, productName);
        });
    });
}

//allows manager to add new product into table
function addProduct() {
    inquirer.prompt([{
        name: "name",
        type: "input",
        message: "Enter the Product Name."
    }, {
        name: "department",
        type: "input",
        message: "Enter the Department Name for this product."
    }, {
        name: "price",
        type: "input",
        message: "Enter the Price for this product.",
        validate: function(value){
            if(isNaN(value) == false){
                return true;
            } else {
                return false;
            }
        }
        
    }, {
        name: "stock",
        type: "input",
        message: "Enter the Stock for this product.",
        validate: function(value){
            if(isNaN(value) == false){
                return true;
            } else {
                return false;
            }
        }
    }, {
        name: "confirm",
        type: "confirm",
        message: "Are you sure you would like to add this product?"
    }]).then(function(answer) {
        var query = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)";
        connection.query(query, [answer.name, answer.department, answer.price, answer.stock], function(err,res){
            displayItems();
        });
    });
}

//displays main choices for manager
function mainMenu(items) {
    inquirer.prompt({
        name: "options",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ]
    }).then(function(answer){
        switch (answer.options) {
            case "View Products for Sale":
                displayItems();
                break;
            case "View Low Inventory":
                lowInv(items);
                break;    
            case  "Add to Inventory":
                addInvPrompt(items);
                break;
            case "Add New Product":
                addProduct();
                break;                
        }
    });
}

