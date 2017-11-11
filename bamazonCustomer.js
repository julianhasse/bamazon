// -------------------------------------------------
// [Author: Julian Hasse]
// [Entry point: bamazonCustomer.js]
// [Homework Coding Boot Camp - UNC at Chapel Hill]
// [License: MIT]
// -------------------------------------------------


// ================ Packages =======================
var inquirer = require('inquirer');
// A collection of common interactive command line user interfaces.
var mysql = require('mysql');
// This is a node.js driver for mysql.
var Table = require('cli-table');
// Renders unicode-aided tables on the command line from your node.js scripts.
var chalk = require('chalk');
// Terminal string styling done right.
var figlet = require("figlet"); 
// Implements the FIGfont spec in JavaScript.



// =============== Database Credentials ============
var connection = mysql.createConnection({
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
            console.log("connected as id " + connection.threadId + "\n");
            // console.log(results);
            var table = new Table({
                head:['ID', 'Product', 'Department', 'Price', 'Quantity'],
            });

            for (var i = 0; i < results.length; i++){
                table.push([results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]);
            }
            console.log(chalk.bold.yellow(table.toString()));
            quit();
        }
    })
};

function quit(){
connection.end();
process.exit();
};

