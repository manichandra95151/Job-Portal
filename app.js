import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import userRoutes from './routes/users.js';
import jobRoutes from './routes/jobs.js';
import { lastVisit } from './middlewares/lastVisit.js';
import expressLayouts from "express-ejs-layouts";
import path from 'path';




const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Set the default layout (if needed)
app.set('layout', 'layouts/layout');

// Connect to MongoDB
connectDB();

// Middleware

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'yourSecret', resave: false, saveUninitialized: true }));
app.use(lastVisit);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle multer-specific errors
    return res.status(400).send(err.message);
  } else if (err) {
    // Handle other errors
    return res.status(500).send('Server error');
  }
  next();
});

// Routes
app.use('/', userRoutes);

// Use job routes
app.use('/', jobRoutes);

// Set view engine
app.set('view engine', 'ejs'); // Set EJS as the template engine

// Serve static files
app.use(express.static('public'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});