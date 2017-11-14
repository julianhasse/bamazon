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
        choices: ["View Product Sales by Department", "Create New Department", "Quit"]

    }]).then(function(res){
        switch (res.option){
            case "View Product Sales by Department":
            viewProductSaleDep();
            break;
            case "Create New Department":
            createNewDepartment();
            break;
            case "Quit":
            clear();
            console.log("\n================================================")
            console.log(" Bamazon - All Rights Reserved 2017 - Good bye!")
            console.log("================================================\n")
            connection.end();
            process.exit();
            break;   
        
        }
    });
}; 

function viewProductSaleDep(){
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