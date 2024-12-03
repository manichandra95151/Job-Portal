import { body } from 'express-validator';
import User from '../models/user.js'; // Import User model
import { validationResult } from 'express-validator';

// Middleware to validate user registration inputs
export const RegistrationValidator = async (req, res, next) => {
  const rules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Must be a valid email').custom(async (value) => {
      // Check if email already exists in the database
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error('Email already in use');
      }
      return true;
    }),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ];

  // Run validation rules
  await Promise.all(rules.map(rule => rule.run(req)));

  const errors = validationResult(req); // Get validation errors

  // If validation errors exist, render the registration page with errors
  if (!errors.isEmpty()) {
    return res.render('RecruiterRegister', { errors: errors.array() });
  }

  next(); // Proceed to the next middleware
};

// Middleware to validate job posting inputs
export const JobPostValidator = [
  body('jobType').notEmpty().withMessage('Job type is required'),
  body('jobDesignation').notEmpty().withMessage('Job role is required'),
  body('jobLocation').notEmpty().withMessage('Location is required'),
  body('companyName').notEmpty().withMessage('Company name is required'),
  body('salary').isNumeric().withMessage('Salary must be a number').custom(value => {
    if (parseInt(value) <= 0) {
      throw new Error('Salary must be greater than 0');
    }
    return true;
  }),
  body('numberofOpenings').isNumeric().withMessage('Number of openings must be a number').custom(value => {
    if (parseInt(value) <= 0) {
      throw new Error('Number of openings must be greater than 0');
    }
    return true;
  }),
  body('applyBy').custom(value => {
    const currentDate = new Date();
    const selectedDate = new Date(value);
    if (selectedDate < currentDate) {
      throw new Error('Apply by date cannot be in the past');
    }
    return true;
  })
];
