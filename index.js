const express = require('express');
const bcrypt = require('bcryptjs')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const fs = require('fs');

mongoose.connect('mongodb://localhost:27017/Auth-system')

const app = express()

app.use(bodyparser.json())

app.listen(3000,()=> {
    console.log("le serveur est sur le port 3000");
})

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    hashedPassword: { type: String, required: true },
  });

const User = mongoose.model('User', userSchema);

app.post('/register',async (req,res)=>{
    const email = req.body.email
    const name = req.body.name
    const password = req.body.password

    const hashedPassword = await bcrypt.hash(password, 10);

    const existEmail = await User.findOne({email})
    if (existEmail){
        console.log("cet email est deja utilisé !")
        return res.status(400).json({message: "cet email est deja utilisé !"})
    }

    const newUser = new User({email,name,hashedPassword})
    try{
        await newUser.save();
        res.status(201).json({ message: "Utilisateur créé avec succès !" });
    }catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ message: "Erreur, veuillez réessayer." });
      }
})

app.post('/login',async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    const user = User.findOne({email})
    if(!user) return res.status(400).json({message:"Email invalide !"})

    
    const validePassword = await bcrypt.compare(password,user.hashedPassword)
    if(!validePassword) return res.status(400).json({message:"Mot de Passe invalide !"})

    res.status(200).json({message:"vous etes connecté avec succés !!"})
})