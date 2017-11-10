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



// =============== Database Credentials ============
var connection = mysql.createConnection ({
    user: 'root',
    password: '91zv4999',
    host: 'localhost',
    database: 'bamazon'
});



// =================== Functions ==================




