const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('./database');

const protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Fetch user from MySQL
            const [users] = await pool.execute(
                'SELECT id, email, name FROM users WHERE id = ?', 
                [decoded.id]
            );
            
            if (users.length === 0) {
                return next(new AppError('User not found', 401));
            }
            
            req.user = users[0];
            next();
        } catch (error) {
            return next(new AppError('Not authorized, token failed', 401));
        }
    }
    
    if (!token) {
        return next(new AppError('Not authorized, no token', 401));
    }
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    
    try {
        // Fetch user from MySQL
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE email = ?', 
            [email]
        );
        
        if (users.length === 0) {
            return next(new AppError('Invalid email or password', 401));
        }
        
        const user = users[0];
        
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (isMatch) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user.id)
            });
        } else {
            return next(new AppError('Invalid email or password', 401));
        }
    } catch (error) {
        next(error);
    }
};

const register = async (req, res, next) => {
    const { name, email, password } = req.body;
    
    try {
        // Check if user already exists
        const [existingUser] = await pool.execute(
            'SELECT * FROM users WHERE email = ?', 
            [email]
        );
        
        if (existingUser.length > 0) {
            return res.status(400).json('User already exists')
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Insert new user
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        
        const userId = result.insertId;
        
        res.status(201).json({
            id: userId,
            name: name,
            email: email,
            token: generateToken(userId)
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { 
    protect, 
    generateToken,
    login,
    register
};