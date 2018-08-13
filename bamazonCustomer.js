var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    displayItems();
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
        makePurchase(res.length);
    });
}

//confirms and updates mysql stock by subtracting order amount
function confirmTransaction(stock, item, total) {
    inquirer.prompt({
        name:"confirm",
        type: "confirm",
        message: `\nYour purchase total comes to $${total}.\n\nAre you sure you want to complete this transaction?`
    }).then(function(answer) {
        if(answer.confirm) {
            var query = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
            connection.query(query, [stock, item], function(err, res){
            if (err) throw err;
            console.log("\nOrder Complete!\n\nThank you for your purchase, please continue shopping.");
            setTimeout(displayItems, 3000);
        });
        } else {
            console.log("\nTransaction Canceled!\n\nPlease try again.\n");
            setTimeout(displayItems, 3000);
        } 
    });
}

//prompts user to make a purchase
function makePurchase(items) {
    inquirer.prompt([{
        name: "buy",
        type: "input",
        message: "Enter the ID number of the product you wish to purchase.",
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
        message: "Enter the amount of units you wish to purchase.",
        validate: function(value){
            if(isNaN(value) == false && value > 0){
                return true;
            } else {
                return false;
            }
        }
    }]).then(function(answer) {
        var query = "SELECT stock_quantity, price FROM products WHERE ?";
        connection.query(query, {item_id: answer.buy}, function(err, res) {
            
            //stores stock/price and performs math to get total cost
            var chosenItemStock = res[0].stock_quantity;
            var orderAmount = parseFloat(answer.units);
            var itemID = parseFloat(answer.buy);
            var purchaseTotal = parseFloat((orderAmount*res[0].price)).toFixed(2);
            var updatedStock = chosenItemStock - orderAmount;
            if (err) throw err;
            
            //checks if enough stock to process order
            if(chosenItemStock >= orderAmount) {
                confirmTransaction(updatedStock, itemID, purchaseTotal);
        
            } else {
                console.log("We're sorry, insufficient quantity.\nPlease make another selection.");
                setTimeout(displayItems, 3000);
            }
        });
    });
}
