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

app.listen(3333, () => {
   console.log( "Correndo em 3333");
})