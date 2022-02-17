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
    const id = uuidv4();

    customers.push({
        cpf,
        name,
        id,
        statement: []
    });

    return res.status(201).send();  // 201 status de banco criado
})

app.listen(3333, () => {
   console.log( "Correndo em 3333");
})