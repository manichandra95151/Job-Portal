import mongoose from 'mongoose';

// Define the schema for applicants
const applicantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    resumePath: { type: String, required: true }, // Path to uploaded resume
});

// Define the schema for jobs
const jobSchema = new mongoose.Schema({
    jobType: { type: String, required: true },
    jobDesignation: { type: String, required: true },
    jobLocation: { type: String, required: true },
    companyName: { type: String, required: true },
    salary: { type: String, required: true },
    numberofOpenings: { type: Number, required: true },
    applyBy: { type: Date, required: true },
    skillsRequired: { type: [String], required: true },
    jobPosted: { type: Date, default: Date.now },
    postedBy: { type: String, required: true }, // Reference email or user ID
    applicants: [applicantSchema], // Array of applicants
});
export const addApplicant = async (jobId, applicantData) => {
    const db = await connectDB();
    const jobsCollection = db.collection('jobs'); // Assuming you have a jobs collection

    // Find the job by jobId and add the applicant data
    await jobsCollection.updateOne(
        { _id: jobId },
        {
            $push: { applicants: applicantData }
        }
    );
};

// Create the model
const Job = mongoose.model('Job', jobSchema);

export default Job;
