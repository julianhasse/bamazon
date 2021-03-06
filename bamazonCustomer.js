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
displayItems();

function displayItems(){
    clear();
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
                table.push([results[i].item_id, results[i].product_name, results[i].department_name, "$ " + results[i].price, results[i].stock_quantity]);
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
            message: "Please enter the product ID of the item you would like to purchase:\n",
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
            message: "Please enter how many units you would like to purchase:\n",
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
                console.log(chalk.gray('-------------------------'));
                console.log("Your total is: " + chalk.red("$ " + totalAmount.toFixed(2)));
                console.log(chalk.gray('-------------------------'));
                console.log("\n");

                // start update ///////////////////////////////////////////////////////////

                var totalCost = selectedItem.price * selectedUnits;
                var selectedDepartment = selectedItem.department_name;
                
                connection.query('SELECT * FROM departments', function(err, departResults){
                    if (err) {
                        throw err;
                    } else { 
                        departResults.forEach(function(salesRes){
                            
                            connection.query('UPDATE departments SET ? WHERE ?', [{
                                total_sales: totalCost,
                            }, {
                                department_name: selectedDepartment,
                            }], function(err){
                                if (err) {
                                    throw err;
                                };
                            })
                        });
                    }
                });
                
                // end update ////////////////////////////////////////////////////////////

                menu();
            }
        );
        } else {
            console.log(chalk.gray('----------------------------------------------------------------------'));
            console.log("We are sorry.\nWe don't have enough: " + chalk.red(selectedItem.product_name) + " to fulfill your order.")
            console.log(chalk.gray('----------------------------------------------------------------------'));
            console.log("\n");
            menu();
        }
    });  
}

function menu(){
    inquirer.prompt([{
        type: "list",
        message: "Select an option\n",
        name: "option",
        choices: ["Continue shopping", "Quit"]

    }]).then(function(res){
        switch (res.option){
            case "Continue shopping":
            displayItems();
            break;
            case "Quit":
            quit();
            break;   
        
        }
    });
}; 

function quit(){
    console.log("\n\n");
    connection.end();
    process.exit();
};

