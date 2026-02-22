import mongoose from 'mongoose';
import Application from './applicationModel.js';
import Job from './jobModel.js';

// POST /api/apply
export async function applyToJob(req, res) {
  try {
    const { jobId, applicantId } = req.body;
    if (!jobId || !applicantId) {
      return res.status(400).json({ error: 'Missing jobId or applicantId' });
    }
    // Check if already applied
    const existing = await Application.findOne({ job: jobId, applicant: applicantId });
    if (existing) {
      return res.status(409).json({ error: 'Already applied to this job' });
    }
    const application = new Application({ job: jobId, applicant: applicantId });
    await application.save();
    res.status(201).json({ success: true, application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
