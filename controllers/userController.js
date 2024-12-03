import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import { validationResult } from 'express-validator';
import { RegistrationValidator } from '../middlewares/validator.js';
import jwt from 'jsonwebtoken';


export default class UserController {
    getHomePage = (req, res) => {
        res.render('homepage', { errors: [] });
    };

    RecruiterRegistration = (req, res) => {
        res.render('RecruiterRegister', { errors: [] });
    };

    login = (req, res) => {
        res.render('RecruiterLogin', { errors: [] });
    };

    LoginAuthenticator = async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });

            if (user) {
                // Compare the entered password with the hashed password in the database
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    // req.session.email = email;
                    const token = jwt.sign({ userId: user._id, email: user.email }, "jwtSec", { expiresIn: '1h' });
                    // res.cookie('token', token, { httpOnly: true });
                    req.session.token=token;
                    req.session.email = user.email; 
                    res.redirect('/dashboard');
                } else {
                    const errorToastMessage = "Invalid email or password.";
                    res.render('RecruiterLogin', { errors: [], errorToastMessage });
                }
            } else {
                const errorToastMessage = "Please register to login!";
                res.render('RecruiterLogin', { errors: [], errorToastMessage });
            }
        } catch (err) {
            console.error(err);
            const errorToastMessage = "An error occurred during login.";
            res.render('RecruiterLogin', { errors: [], errorToastMessage });
        }
    };

    renderRecruiterDashboard = (req, res) => {
        res.render('RecruiterDasboard', { errors: [] });
    };

    addUser = [
        RegistrationValidator,
        async (req, res) => {
            const { name, email, password } = req.body;
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.render('RecruiterRegister', {
                        errors: errors.array(),
                        errorToastMessage: "Validation errors occurred.",
                    });
                }

                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    const errorToastMessage = "User with this email already exists!";
                    return res.render('RecruiterRegister', { errors: [], errorToastMessage });
                }

                // Hash the password before saving the user
                const hashedPassword = await bcrypt.hash(password, 10);

                const newUser = new User({
                    name,
                    email,
                    password: hashedPassword,
                });

                await newUser.save();
                // req.session.email = email; 
                res.redirect('/login');
            } catch (err) {
                console.error(err);
                const errorToastMessage = "Failed to register user.";
                res.render('RecruiterRegister', { errors: [], errorToastMessage });
            }
        },
    ];

    logout = (req, res) => {
        req.session.destroy(err => {
            if (err) console.error(err);
            res.redirect('/');
        });
    };
}
