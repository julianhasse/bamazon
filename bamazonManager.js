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
const clear = require('clear');


// =============== Database Credentials ============
const connection = mysql.createConnection({
    user: 'root',
    password: '91zv4999',
    host: 'localhost',
    database: 'bamazon'
});

menu();

// =================== Functions ==================
function menu(){
    clear();    
    console.log(chalk.blue(figlet.textSync(" Bamazon ", {
        font: 'Sub-zero',
        horizontalLayout: 'fitted',
        verticalLayout: 'fitted'
    })));

    inquirer.prompt([{
        type: "list",
        message: "Select an option\n",
        name: "option",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]

    }]).then(function(res){
        switch (res.option){
            case "View Products for Sale":
            viewProductsSale();
            break;
            case "View Low Inventory":
            viewLowInventory();
            break;
            case "Add to Inventory":
            addToInventory();
            break;
            case "Add New Product":
            addNewProduct();
            break;
            case "Quit":
            quit();
            break;   
        
        }
    });
}; 

function viewProductsSale(){
    clear();
    connection.query('SELECT * FROM products', function(err, results){
        if (err){
            throw err;
        } else {
            console.log(chalk.yellow("\n///// Manager Interface - Products for Sale ///// \n"));
           
            var table = new Table({
                head:['ID', 'Product', 'Department', 'Price', 'Quantity'],
            });

            for (var i = 0; i < results.length; i++){
                table.push([results[i].item_id, results[i].product_name, results[i].department_name, "$ " + results[i].price, results[i].stock_quantity]);
            }
            console.log(chalk.bold.yellow(table.toString()));
            console.log("\n");
            quit();
        }
    })
};


function  viewLowInventory(){
    clear();
    connection.query('SELECT * FROM products WHERE stock_quantity BETWEEN 0 AND 5', function(err, results){
        if (err){
            throw err;
        } else {
            console.log(chalk.yellow("\n///// Manager Interface - View Low Inventory (less than 5 items) ///// \n"));
           
            var table = new Table({
                head:['ID', 'Product', 'Department', 'Price', 'Quantity'],
            });

            for (var i = 0; i < results.length; i++){
                table.push([results[i].item_id, results[i].product_name, results[i].department_name, "$ " + results[i].price, results[i].stock_quantity]);
            }
            console.log(chalk.bold.yellow(table.toString()));
            console.log("\n");
            quit();
        }
    })


};


function addToInventory() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        inquirer.prompt([{
            name: "productName",
            type: "list",
            message: "Please select the product you would like to update:\n",
            choices: function() {
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].product_name);
                }
                return choiceArray;
            }

        }, {
            name: "amount",
            type: "input",
            message: "Please enter the quantity you would like to add:\n",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }]).then(function(answer) {
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                if (results[i].product_name == answer.productName) {
                    chosenItem = results[i];
                    break;
                }
            }
            var addAmount = parseInt(answer.amount);
            if (addAmount > 0) {
                var newAmount = addAmount + chosenItem.stock_quantity;
                connection.query(
                    "UPDATE products SET ? WHERE ?", [{
                        stock_quantity: newAmount
                    }, {
                        item_id: chosenItem.item_id
                    }],
                    function(err) {
                        if (err) throw err;
                        viewProductsSale();
                        console.log("======================================================================");
                        console.log("Stock updated. We added " + addAmount + " units of: ");
                        console.log(chalk.red("ID:" + chosenItem.item_id + " - " + chosenItem.product_name));
                        console.log("to the sale inventory.");
                        console.log("======================================================================\n");
                    })
            }

        });
    })
}

function  addNewProduct(){};

function quit(){
    console.log("\n\n");
    connection.end();
    process.exit();
};

