const bcrypt = require('bcryptjs');
const User = require('../model/userModel');

const registerUser = async (email, name, password) => {
    const exist = await User.findOne({ email });
    if (exist) {
        throw new Error("Cet email est déjà utilisé !");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, name, hashedPassword });

    try {
        await newUser.save();
        return { message: "Utilisateur créé avec succès !" };
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        throw new Error("Erreur lors de l'inscription. Veuillez réessayer.");
    }
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Email ou mot de passe invalide !");
    }

    const validPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!validPassword) {
        throw new Error("Mot de passe invalide !");
    }

    return { message: "Vous êtes connecté avec succès !" };
};

module.exports = { registerUser, loginUser };
