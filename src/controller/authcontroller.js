const authService = require('../services/authService')

const register = async (req,res)=> {
    try {
        const {email,name,password}= req.body;
        const response = await authService.registerUser(email,name,password)
        res.status(201).json(response);
    } catch(err){
        res.status(500).json({ message: err.message });
    }
}

const login = async (req,res) => {
    try {
        const { email, password } = req.body;
        const response = await authService.loginUser(email,password);
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { register, login };