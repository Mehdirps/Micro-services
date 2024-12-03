import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

// JWT
const createToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Inscription
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = new User({ username, email, password });
        await user.save();

        const token = createToken(user._id);
        res.status(201).json({ token, user: { id: user._id, username, email }, message: 'Registration successful' });
    } catch (err) {
        res.status(500).json({ message: 'Error during registration', error: err.message });
    }
};

// Connexion
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = createToken(user._id);
        res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email }, message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ message: 'Error during login', error: err.message });
    }
};
