import express from 'express';
import { get } from 'http';
import { addUser, users } from '../models/user.js';
import { jobs, addJobs, ViewJobs, addApplicant, updateJob, deleteJob, viewApplicant } from '../models/jobs.js';
import { RegistrationValidator } from '../middlewares/validator.js';
import { Authenticator } from '../middlewares/loginAuthenticator.js'
import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";
import { validationResult } from "express-validator";
import { Console } from 'console';

export default class UserController {
    getHomePage = (req, res, next) => {
        res.render('homepage');
    };
    RecruiterRegistration = (req, res) => {
        res.render('RecruiterRegister', { errors: 0 });
    };

    login = (req, res) => {
        res.render('RecruiterLogin', { errors: 0 });
    };
    LoginAuthenticator = (req, res, next) => {
        const { email, password } = req.body;
        // Find the user by email

        const user = users.find(user => user.email === email);
        if (user && user.password === password) {
            console.log(user);
            // Authentication successful
            req.session.email = req.body.email;

            res.redirect('/dashboard');

        }
        else if (!user) {
            // User not found
            return res.render('RecruiterLogin', { errors: 'Please Register to login!' });
        }
        else {
            // Authentication failed
            res.render('RecruiterLogin', { errors: 'Invalid email or password' });
        }
    }

    addUser = [
        RegistrationValidator, // Apply the RegistrationValidator middleware first
        (req, res) => {
            const { name, email, password } = req.body;
            const user = {
                name: name,
                email: email,
                password: password
            };
            console.log(user);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render('RecruiterRegister', { errors: errors.array() });
            }

            addUser(user);
            res.redirect('/login'); // Provide the complete URL path
        }
    ];

    renderRecruiterDashboard = (req, res) => {
        res.render('RecruiterDasboard');
    };
    logout = (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/login');
            }
        }); // Close the parenthesis for req.session.destroy
    }
    postJob = (req, res) => {
        res.render('postJob');
    }
    getJobs = (req, res) => {
        const id = req.session.jobId;
        console.log(`session idd:${id}`);
        res.render('getjobs', { jobs, id });
    };
    addJob = (req, res) => {
        const { jobType, jobDesignation, jobLocation, companyName, salary, numberofOpenings, applyBy, skillsRequired } = req.body;

        // Assuming you have some validation for the form fields
        const postedBy = req.session.email;

        console.log(`body:${req.body}`);
        // Create a new job object
        const newJob = {
            id: jobs.length + 1, // Generate unique ID (you may want to use a more robust method)
            jobType: jobType,
            jobDesignation: jobDesignation,
            jobLocation: jobLocation,
            companyName: companyName,
            salary: salary,
            applyBy: applyBy,
            skillsRequired: skillsRequired,
            numberofOpenings: numberofOpenings, // Assuming positions is a number
            jobPosted: new Date().toDateString(),
            applicants: [],
            postedBy: postedBy

        };
        console.log(postedBy);
        console.log(`new jobs:${newJob}`)


        // Add the new job to the jobs array

        addJobs(newJob);

        // Redirect back to the jobs page
        res.redirect('/jobs');
    };
    viewJob = (req, res) => {
        const id = req.params.id;
        req.session.viewId = id;
        console.log(`viewid:${id}`);
        const job = ViewJobs(id);
        console.log(`viewjob:${job}`);

        res.render('viewJob', { job });
    }
    searchJob = (req, res) => {
        const searchTerm = req.body.search ? req.body.search.toLowerCase() : '';
        const matchedJobs = jobs.filter(job => {
            // Check if any part of the job details matches the search term
            return (
                job.jobDesignation.toLowerCase().includes(searchTerm) ||
                job.companyName.toLowerCase().includes(searchTerm) ||
                job.jobLocation.toLowerCase().includes(searchTerm) ||
                job.salary.toLowerCase().includes(searchTerm)

            );
        })

        res.render("getjobs", { jobs: matchedJobs });

    }
    applyJob = (req, res) => {
        req.session.jobId = req.params.id;

        res.render('apply', { jobId: req.session.jobId });
    }
    addApplication = (req, res) => {
        const jobId = req.session.jobId;

        const { name, email, contact } = req.body;

        // Create a transporter object with SMTP details
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "codingninjas2k16@gmail.com",
                pass: "slwvvlczduktvhdj",
            },
        });

        // Define mail options
        let mailOptions = {
            from: "codingninjas2k16@gmail.com",
            to: email,
            text: "Applied for a Job",
            subject: "Applied for Job",
        };

        // Send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log(`Success: Email sent to ${userMail}`);
            }
        });

        let filename = '';
        if (req.file) {
            // Extracting file extension
            filename = '/uploads/' + req.file.filename;
            //console.log(filename);
        } else {
            //console.log('No file uploaded');
            // Handle the case where no file is uploaded, maybe return an error response
        }

        addApplicant(jobId, { name, email, contact, filename });
        const id = req.session.jobId;
        console.log(`session idd:${id}`);
        res.render('getjobs', { jobs, id });

    }
    editJob = (req, res) => {
        const id = req.params.id;
        console.log(id);
        req.session.jobId = id;
        const job = ViewJobs(id);

        res.render('editJob', { job: job }); // Pass the job object to the template
    }
    updateJob = (req, res) => {
        // Retrieve the job id from the request parameters
        const id = req.params.id;

        // Store the job id in the session
        req.session.jobId = id;

        console.log(`id: ${id}`);

        // Retrieve the email from the session
        const postedBy = req.session.email;

        // Extract job details from the request body
        const {
            jobType,
            jobDesignation,
            jobLocation,
            companyName,
            salary,
            numberofOpenings,
            applyBy,
            skillsRequired,
        } = req.body;

        // Create an object with updated job details
        const updatedJobDetails = {
            jobType: jobType,
            jobDesignation: jobDesignation,
            jobLocation: jobLocation,
            companyName: companyName,
            salary: salary,
            applyBy: applyBy,
            skillsRequired: skillsRequired,
            numberofOpenings: numberofOpenings, // Assuming positions is a number
            jobPosted: new Date().toDateString(),
            applicants: [],
            postedBy: postedBy
        };

        // Call the updateJob function passing the id and updated job details
        updateJob(id, updatedJobDetails);

        // Redirect to the jobs page
        res.redirect('/jobs');
    }
    deleteJob = (req, res) => {
        console.log(`deleteid:${req.session.viewId}`)
        const id = req.session.viewId;
        deleteJob(id);
        res.redirect('/jobs');

    }
    viewApplicants = (req, res) => {
        const jobId = req.session.viewId;
        const applicants = viewApplicant(jobId); // Assuming viewApplicant function retrieves applicants based on job ID
        res.render('viewApplicant', { applicants });
    }



}
