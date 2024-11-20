const express = require('express');
const bcrypt = require('bcryptjs')
const bodyparser = require('body-parser')
const fs = require('fs');

const app = express()

app.use(bodyparser.json())

app.listen(3000,()=> {
    console.log("le serveur est sur le port 3000");
})

const jsonFile = './users.json';

app.post('/register',async (req,res)=>{
    const email = req.body.email
    const name = req.body.name
    const password = req.body.password

    //crypter le mot de passe 
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = { email , name , hashedPassword }
    

    let data = []

    if(fs.existsSync(jsonFile)){
        const oldUsers = fs.readFileSync(jsonFile,'utf-8');
        if(oldUsers) data = JSON.parse(oldUsers)
    }
    //checker si l'email existe deja 
    const existEmail = data.find(user => user.email === email)
    if (existEmail){
        console.log("cet email est deja utilisé !")
        return res.status(400).json({message: "cet email est deja utilisé !"})
    }
    //inserer  l'utilisateur dasn la liste puis inserer la liste dans le fichier JSON
    data.push(user);
    fs.writeFileSync(jsonFile,JSON.stringify(data,null,2))
})

app.post('/login',async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    let data = []

    if (fs.existsSync(jsonFile)){
        const Users = fs.readFileSync(jsonFile,'utf8')
        data = JSON.parse(Users)
    }

    const user = data.find(u => u.email === email)
    if(!user) return res.status(400).json({message:"Email invalide !"})

    
    const validePassword = await bcrypt.compare(password,user.hashedPassword)
    if(!validePassword) return res.status(400).json({message:"Mot de Passe invalide !"})

    res.status(200).json({message:"vous etes connecté avec succés !!"})
})