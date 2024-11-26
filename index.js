const express = require('express');
const bodyparser = require('body-parser')
const connectDB = require('./src/config/db')
const authRouter = require('./src/routers/authrouter')

const app = express()
connectDB();
app.use(bodyparser.json())

app.use('/auth', authRouter);

app.listen(3000,()=> {
    console.log("le serveur est sur le port 3000");
})

