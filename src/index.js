const { response } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid"); // v4 números rendon



const app = express();


app.use(express.json());


const customers = [];

//Middleware
function verifyExistsAccountCPF(req,res,next) {
    const { cpf } = req.headers;

    const customer = customers.find((customer) => customer.cpf === cpf);
                    //Procurando se existe um cpf estritamente parecido

                    
    if(!customer) {
        return res.status(400).json({error: "Customer not found"})
    }

    req.customer = customer;

    return next();
    }
// GetBalance
function getBalance(statement) {
    const balance = statement.reduce((acc, operation) => {
        //Se for uma operação de credito
        if(operation.type === 'credit') {
            return acc + operation.amount;
        }// Se for uma operation de debito
        else {
            return acc - operation.amount;
        }
    }, 0);

    return balance;
}

//Reduce pega as informaçãos de determinando valor que vamos passar
// ela e fazer o calculo que entrou e o que saiu 

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
});

// Looking for the customer's bank statement
app.get("/statement/", verifyExistsAccountCPF, (req,res) => {

    const { customer } = req;
    return res.json(customer.statement);
});
// Creating account deposit
app.post("/deposit", verifyExistsAccountCPF, (req,res) => {
    const { description, amount } = req.body; 

    const { customer } = req;

    const statementOperations = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperations)

    return res.status(201).send()
});
//Creating account withdrawal
app.post("/withdrawal",verifyExistsAccountCPF, (req,res) => {
        const { amount } = req.body;
        const { customer } = req;

        const balance = getBalance(customer.statement);

        //Se o valor for maior do que o total - error
        if(balance < amount) {
            return res.status(400).json({error: "Insufficient funds"})
        }

        const statementOperations = {
            amount,
            created_at: new Date(),
            type: "debit",           
        };

        customer.statement.push(statementOperations);

        return res.status(201).send()
})
//List bank statement by date
app.get("/statement/date", verifyExistsAccountCPF, (req,res) => {

    const { customer } = req;
    const { date } = req.query;

    // Formatação
    const dateFormat = new Date(date + "00:00");

    const statement = customer.statement.filter(
    (statement) =>
     statement.created_at.toDateString() === 
     new Date(dateFormat).toDateString()
     );

    return res.json(statement);
});
// update account - name
app.put("/account", verifyExistsAccountCPF, (req, res) => {
    const { name } = req.body;
    const { customer } = req;

    customer.name = name;

    return res.status(201).send();
})
// status account
app.get("/account", verifyExistsAccountCPF, (req,res) => {
    const { customer } = req;

    return res.json(customer);
} )
// Delete accont
app.delete("/account", verifyExistsAccountCPF, (req,res) => {
    const { customer } = req;

    //splice

    customers.splice(customer, 1);

    return res.status(200).json(customers);
}) 
// Status Balance
app.get("/balance", verifyExistsAccountCPF, (req,res) => {
    const { customer } = req;
    const balance = getBalance(customer.statement);

    return res.json(balance);
})




// Porta
app.listen(3333, () => {
   console.log( "Correndo em 3333");
})