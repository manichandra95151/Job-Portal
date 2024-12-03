import Job from '../models/job.js';
import Applicant from '../models/applicant.js';
import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

export default class JobController {
  getJobs = async (req, res) => {
    const search = req.query.search || '';
    try {
      const jobs = await Job.find();
      res.render('getjobs', { jobs, search, errors: [] });
    } catch (err) {
      console.error(err);
      const errorToastMessage = "An error occurred while fetching jobs.";
      res.render('getjobs', { jobs: [], search, errors: [], errorToastMessage });
    }
  };
      postJob = (req, res) => {
        res.render('postJob', { errors: [] });
    };

  addJob = async (req, res) => {
    const { jobType, jobDesignation, jobLocation, companyName, salary, numberofOpenings, applyBy, skillsRequired } = req.body;
    const postedBy = req.user.email;

    try {
      const newJob = new Job({
        jobType,
        jobDesignation,
        jobLocation,
        companyName,
        salary,
        numberofOpenings,
        applyBy,
        skillsRequired,
        postedBy,
        jobPosted: new Date(),
      });

      await newJob.save();
      const successToastMessage = "Job posted successfully!";
      res.redirect('/jobs');
    } catch (err) {
      console.error(err);
      const errorToastMessage = "Failed to post job.";
      res.render('postJob', { errors: [], errorToastMessage });
    }
  };

  viewJob = async (req, res) => {
    const id = req.params.id;
    // console.log(req.session.email);
    try {
      const job = await Job.findById(id);
      if (job) {
        res.render('viewJob', { job: job, user: req.session.email, errors: [] });
      } else {
        res.redirect('/jobs');
      }
    } catch (err) {
      console.error('Error fetching job:', err);
      const errorToastMessage = "Error fetching job details.";
      res.render('getJobs', { errors: [], errorToastMessage });
    }
  };

  updateJob = async (req, res) => {
    const id = req.params.id;
    try {
      await Job.findByIdAndUpdate(id, req.body);
      const successToastMessage = "Job updated successfully!";
      res.redirect('/jobs');
    } catch (err) {
      console.error(err);
      const errorToastMessage = "Failed to update job.";
      res.redirect('/editJob/' + id);
    }
  };

  deleteJob = async (req, res) => {
    const id = req.params.id;
    try {
      await Job.findByIdAndDelete(id);
      const successToastMessage = "Job deleted successfully!";
      res.redirect('/jobs');
    } catch (err) {
      console.error(err);
      const errorToastMessage = "Failed to delete job.";
      res.redirect('/jobs');
    }
  };

  searchJobs = async (req, res) => {
    const searchTerm = req.query.search?.toLowerCase().trim() || '';

    if (searchTerm.length <= 0) {
      const errorToastMessage = "Enter valid text to search.";
      res.render('getJobs', { jobs: [], search: searchTerm, errorToastMessage, errors: [] });
      return;
    }

    try {
      const jobs = await Job.find({
        $or: [
          { jobDesignation: { $regex: searchTerm, $options: 'i' } },
          { companyName: { $regex: searchTerm, $options: 'i' } },
          { jobLocation: { $regex: searchTerm, $options: 'i' } },
          { salary: { $regex: searchTerm, $options: 'i' } },
        ],
      });

      res.render('getJobs', { jobs, search: searchTerm, errors: [] });
    } catch (err) {
      console.error(err);
      const errorToastMessage = "Error searching for jobs.";
      res.render('getJobs', { jobs: [], search: searchTerm, errors: [], errorToastMessage });
    }
  };


  applyJob = (req, res) => {
    req.session.jobId = req.params.id;
    res.render('apply', { jobId:req.params.id , errors: [] });
  };

  viewPostedJobs = async (req, res) => {
    const recruiterEmail = req.user.email;

    try {
      const postedJobs = await Job.find({ postedBy: recruiterEmail });
      res.render('postedJobs', { postedJobs, errors: [] });
    } catch (err) {
      console.error(err);
      const errorToastMessage = "Error fetching posted jobs.";
      res.render('postedJobs', { postedJobs: [], errors: [], errorToastMessage });
    }
  };

  editJob = async (req, res) => {
    const id = req.params.id;

    try {
      const job = await Job.findById(id);
      if (job) {
        res.render('editJob', { job, errors: [] });
      } else {
        res.redirect('/jobs');
      }
    } catch (err) {
      console.error(err);
      const errorToastMessage = "Error fetching job for editing.";
      res.redirect('/jobs');
    }
  };


   viewApplicants = async (req, res) => {
    const jobId = req.params.id; // Get jobId from route parameter
    const recruiterEmail = req.user.email; // Get recruiter email from session
    // console.log("requser"+req.user.email);

    try {
        // Fetch the job details to verify the recruiter
        const job = await Job.findById(jobId);

        if (!job || job.postedBy !== recruiterEmail) {
            // req.flash('error', "You don't have permission to view applicants.");
            console.log("You don't have permission to view applicants.")
            return res.redirect('/dashboard'); // Redirect if unauthorized
        }

        // Fetch applicants for the given jobId
        const applicants = await Applicant.find({ jobId });

        // Render the view with job and applicant details
        res.render('viewApplicant', {
            applicants, // List of applicants
            jobTitle: job.jobDesignation, // Job title for display
            // jobPostedDate: job.createdAt.toDateString(), // Format creation date
            // recruiterEmail, // Email of recruiter (optional context)
            errors: [] // Pass errors array for consistency
        });
        console.log()
    } catch (err) {
        console.error(err);
        // req.flash('error', "Error fetching applicants.");
        res.redirect('/dashboard');
    }
};

viewResume = async (req, res) => {
  try {
      const applicantId = req.params.id; // Get the applicant ID from the route parameter
      const applicant = await Applicant.findById(applicantId);

      if (!applicant || !applicant.resume) {
          return res.status(404).send('Resume not found');
      }

      // Set the content type to match the stored resume's contentType
      res.contentType(applicant.resume.contentType);
      // Send the resume data as a response
      res.send(applicant.resume.data);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving the resume');
  }
};


  addApplication = async (req, res) => {
    const jobId = req.session.jobId; // Ensure the job ID is correctly set in the session
    const { name, email, contact } = req.body;

    try {
      // Validate if jobId is present
      if (!jobId) {
        return res.status(400).send('Job ID is missing.');
      }

      // Create a new applicant
      const applicant = new Applicant({
        jobId,
        name,
        email,
        contact,
        resume: {
          data: req.file.buffer, // Store file buffer in the database
          contentType: req.file.mimetype, // Store file MIME type
        },
      });

      // Save to database
      await applicant.save();
      await Job.findByIdAndUpdate(
        jobId,
        { $push: { applicants: applicant._id } },
        { new: true } // Return the updated job document
    );

      // Send confirmation email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user:process.env.EMAIL,
          pass:process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from:process.env.EMAIL,
        to: email,
        subject: 'Job Application Received',
        text: `Hello ${name},\n\nThank you for applying for the job. Your application has been successfully received.\n\nRegards,\nJob Portal Team`,
      };

      await transporter.sendMail(mailOptions);

      // Redirect after success
      res.redirect('/jobs');
    } catch (err) {
      console.error('Error while applying for a job:', err.message);
      res.redirect('/apply/' + jobId);
    }
  };
}
