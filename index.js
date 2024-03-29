import express from 'express';
import UserController from './controllers/user.controller.js';
import ejs from 'ejs';
import bodyParser from 'body-parser';
import { RegistrationValidator, JobPostValidator } from './middlewares/validator.js';
import { ExpressValidator } from 'express-validator';
import { auth } from './middlewares/loginAuthenticator.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import { lastVisit } from './middlewares/lastVisit.js'
import { uploadfile } from './middlewares/fileUpload.js';
import path from "path";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.resolve("public")));


const User = new UserController();
app.use(lastVisit);

app.set('view engine', 'ejs');
app.get('/', User.getHomePage);
app.get('/jobs', User.getJobs);
app.get('/register', User.RecruiterRegistration);
app.post('/register', User.addUser)
app.get('/login', User.login);
app.post('/login', User.LoginAuthenticator);
app.get('/dashboard', auth, User.renderRecruiterDashboard);
app.get('/logout', User.logout);
app.get('/postJob', auth, User.postJob);
app.post('/postJob', auth, User.addJob);
app.get('/viewJob/:id', User.viewJob)
app.post('/search', User.searchJob);
app.get('/apply/:id', User.applyJob);
app.post('/jobs', uploadfile.single('resume'), User.addApplication);
app.get('/editJob/:id', User.editJob);
app.post('/viewJob/:id', auth, User.updateJob);
app.get('/jobss', User.deleteJob);
app.get('/viewApplicants', auth, User.viewApplicants);




export default app;