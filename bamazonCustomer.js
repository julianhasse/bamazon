// -------------------------------------------------
// [Author: Julian Hasse]
// [Entry point: bamazonCustomer.js]
// [Homework Coding Boot Camp - UNC at Chapel Hill]
// [License: MIT]
// -------------------------------------------------


// ================ Packages =======================
const inquirer = require('inquirer');
// A collection of common interactive command line user interfaces.
const mysql = require('mysql');
// This is a node.js driver for mysql.
const Table = require('cli-table');
// Renders unicode-aided tables on the command line from your node.js scripts.
const chalk = require('chalk');
// Terminal string styling done right.
const figlet = require("figlet"); 
// Implements the FIGfont spec in JavaScript.



// =============== Database Credentials ============
const connection = mysql.createConnection({
    user: 'root',
    password: '91zv4999',
    host: 'localhost',
    database: 'bamazon'
});



// =================== Functions ==================
displayItems();

function displayItems(){

    console.log(chalk.blue(figlet.textSync(" Bamazon ", {
        font: 'Sub-zero',
        horizontalLayout: 'fitted',
        verticalLayout: 'fitted'
    })));

    connection.query('SELECT * FROM products', function(err, results){
        if (err){
            throw err;
        } else {
            console.log("        New and Interesting finds in Bamazon: \n");
           
            var table = new Table({
                head:['ID', 'Product', 'Department', 'Price', 'Quantity'],
            });

            for (var i = 0; i < results.length; i++){
                table.push([results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]);
            }
            console.log(chalk.bold.yellow(table.toString()));
            console.log("\n");
            promptUser(results);
        }
    })
};

function promptUser(results){
    inquirer.prompt([{
            type: "input",
            message: "Please enter the product ID of the item you would like to purchase\n",
            name: "productId",
            validate: function(value) {
                if (isNaN(value) === false){
                    return true;
                }
                    return false;
            }
        },
        {
            type: "input",
            message: "Please enter how many units you would like to purchase\n",
            name: "productUnits",
            validate: function(value) {
                if (isNaN(value) === false){
                    return true;
                }
                    return false;
            }  
        }
    ]).then(function(response){
        var selectedItem = "";
        var selectedUnits = parseInt(response.productUnits);

        for (var i = 0; i < results.length; i++){
            if (results[i].item_id == response.productId) {
                selectedItem = results[i];
                break;
            }
        }
        if (selectedItem.stock_quantity >= selectedUnits) {
            var updateQuantity = selectedItem.stock_quantity - selectedUnits;
            connection.query('UPDATE products SET ? WHERE ?', [{
                stock_quantity: updateQuantity
            }, {
                item_id: selectedItem.item_id

            }],
            function(err){
                if (err) throw err;
                var totalAmount = selectedUnits * selectedItem.price;
                console.log("Your total is: " + chalk.red("$" + totalAmount.toFixed(2)));
                quit();
            }
        );
        } else {
            console.log("We are sorry. There are not enough of: \n" + chalk.red(selectedItem.product_name) + "\n" + "in stock to complete your order")
            quit();
        }
    });  
}


function quit(){
connection.end();
process.exit();
};

