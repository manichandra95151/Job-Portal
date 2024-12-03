import express from 'express';
import JobController from '../controllers/jobController.js';
import { uploadFile } from '../middlewares/fileUpload.js';
import { auth } from '../middlewares/loginAuthenticator.js';

const router = express.Router();
const jobController = new JobController();

// Job routes
router.get('/jobs', jobController.getJobs);
router.get('/postJob', auth, jobController.postJob);
router.post('/postJob', auth, jobController.addJob);
router.get('/postedJobs', auth, jobController.viewPostedJobs);
router.get('/viewJob/:id', jobController.viewJob);
router.post('/viewJob/:id', auth, jobController.updateJob);
router.get('/jobs/search', jobController.searchJobs);
router.get('/editJob/:id', jobController.editJob);
router.get('/deleteJob/:id', auth, jobController.deleteJob);
router.get('/apply/:id', jobController.applyJob);
router.get('/viewApplicants/:id', auth, jobController.viewApplicants);
router.post('/jobs', uploadFile, jobController.addApplication);
router.get('/resume/:id', jobController.viewResume);

export default router;
