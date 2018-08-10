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
    displayItems();
});

// displays items in table
var displayItems = function() {
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
        makePurchase();
    });
}

//prompts user to make a purchase
var makePurchase = function () {
    inquirer.prompt([{
        name: "buy",
        type: "input",
        message: "Enter the ID number of the product you wish to purchase."
    }, {
        name: "units",
        type: "input",
        message: "Enter the ammount of units you wish to purchase."
    }]).then(function(answer) {
        var query = "SELECT stock_quantity, price FROM products WHERE ?";
        connection.query(query, {item_id: answer.buy}, function(err, res) {
            //stores stock/price and performs math to get total cost
            var chosenItemStock = res[0].stock_quantity;
            var orderAmount = parseFloat(answer.units);
            var itemID = parseFloat(answer.buy);
            var purchaseTotal = orderAmount * res[0].price;

            if (err) throw err;
            
            //checks if enough stock to process order
            if(chosenItemStock >= orderAmount) {
                inquirer.prompt({
                    name:"confirm",
                    type: "confirm",
                    message: "\nYour purchase total come's to $" + purchaseTotal + ".\n\nAre you sure you want to complete this transaction?"
                }).then(function(){

                    //updates mysql stock by subtracting order amount
                    var query = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
                    var updatedStock = chosenItemStock - orderAmount;
                    connection.query(query, [updatedStock, itemID], function(err, res){
                        if (err) throw err;
                        console.log("\nOrder Complete!\n\nThank you for your purchase, please continue shopping.");
                        setTimeout(displayItems, 3000);
                    });
                });
            } else {
                console.log("We're sorry, insufficient quantity selected.\nPlease make another selection.");
                setTimeout(displayItems, 3000);
            }
        });
    });
}
