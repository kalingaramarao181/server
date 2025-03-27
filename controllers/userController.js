const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const registerUser = async (req, res) => {
    const { fullName, email, password, role } = req.body;
    
    
    
    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        await User.createUser(fullName, email, password, role);
        res.status(201).json({ message: "User registered successfully with role: " + role });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
        console.log(err);
        
    }
};

const updateUserRole = async (req, res) => {
    const { userId, newRole } = req.body;
    
    if (req.user.role !== 'super_admin' && req.user.role !== 'enterprise_admin') {
        return res.status(403).json({ message: "Permission Denied" });
    }

    try {
        await User.updateUserRole(userId, newRole);
        res.status(200).json({ message: `User role updated to ${newRole}` });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name, 
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


const getUserProfile = async (req, res) => {
    try {
        const user = await User.findByEmail(req.user.email);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ id: user.id, fullName: user.name, email: user.email, role: user.role });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const getUsersByRole = async (req, res) => {
    try {
        const users = await User.findUserByRole(req.params.roleId);
        
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
        console.log(err);
        
    }
};

const getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ id: user.id, fullName: user.name, email: user.email, role: user.role });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


module.exports = { registerUser, loginUser, getUserProfile, updateUserRole, getUserDetails, getUsersByRole};
