import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  contact: {
    type: String,
    required: [true, 'Contact number is required'],
  },
  resume: {
    data: Buffer,
    contentType: String,
  },
});

const Applicant = mongoose.model('Applicant', applicantSchema);

export default Applicant;
