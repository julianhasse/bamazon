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
    console.log("\n================================================")
    console.log(" Supervisor Interface - Bamazon 2017")
    console.log("================================================\n")

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
    connection.query('SELECT * FROM departments', function(err, results){
        if (err){
            throw err;
        } else {
            console.log(chalk.yellow("\n///// Supervisor Interface - Departments Reports ///// \n"));
           
            var table = new Table({
                head:['ID', 'Department', 'Overhead Costs', 'Total Sales'],
            });

            for (var i = 0; i < results.length; i++){
                table.push([results[i].department_id, results[i].department_name, results[i].over_head_costs, "$ " + results[i].total_sales]);
            }
            console.log(chalk.bold.yellow(table.toString()));
            console.log("\n");
            quit();
        }
    })
};


function createNewDepartment(){
    clear();
    inquirer.prompt([{
        name: "newDepartment",
        message: "Please enter the Department's name: "
    } , {
        name: "overheadCost",
        message: "Please indicate the Department's overhead cost: "
    }]).then(function(resp){
        var inputDepartment = resp.newDepartment;
        var inputOverhead = resp.overheadCost;
        connection.query('INSERT INTO departments SET ?', {
            department_name: inputDepartment,
            over_head_costs: inputOverhead,
            total_sales:  0
        })
        console.log("\n=======================================================================");
        console.log("The new deparment " + chalk.red(inputDepartment) + " was added to the database.")
        console.log("=======================================================================\n");
        quit();
    });
        
};



function quit(){
    console.log("\n================================================")
    console.log(" Bamazon - All Rights Reserved 2017 - Good bye!")
    console.log("================================================\n")
    connection.end();
    process.exit();
};