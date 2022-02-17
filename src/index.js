const { response } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid"); // v4 números rendon



const app = express();


app.use(express.json());
/**
 * cpf - string 
 * name - string
 * id - uuid
 * statement []
 * 
 */

const customers = [];


// Creating an account and validating the cpf
app.post("/account", (req, res) => {
    const { cpf, name } = req.body;

    const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf ); //Busca

    if(customerAlreadyExists){
        return res.status(400).json({ message: "Custome already exists!"})
        // Se existir um cpf ele já retorna um error 404 - Https
    }

    customers.push({
        cpf,
        name,
        id:uuidv4(), //uuid
        statement: []
    });

    return res.status(201).send();  // 201 status de banco criado
})

// Looking for the customer's bank statement
app.get("/statement/:cpf", (req,res) => {
    const { cpf } = req.params;

    const customer = customers.find((customer) => customer.cpf === cpf);
                    //Procurando se existe um cpf estritamente parecido

    if(!customer) {
        return res.status(400).json({error: "Customer not found"})
    }

    return res.json(customer.statement);
})

app.listen(3333, () => {
   console.log( "Correndo em 3333");
})