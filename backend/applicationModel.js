import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume: { type: String, default: '' },
  coverLetter: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'reviewed', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Application = mongoose.model('Application', applicationSchema, 'applications');
export default Application;
