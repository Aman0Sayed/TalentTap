import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { buildUserProfileFromUser } from './userProfileUtil.js';
import Job from './jobModel.js';
import Application from './applicationModel.js';
import { applyToJob } from './applyController.js';
import fs from 'fs';

const required = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_URL'];
required.forEach(key => {
  if (!process.env[key]) {
    console.error(`FATAL: Missing environment variable: ${key}`);
    process.exit(1);
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.options('*', cors());

app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

// Update user schema to support all profile fields
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  company: String,
  about: { type: String, default: "" },
  skills: { type: [String], default: [] },
  projects: { type: [{ name: String, description: String }], default: [] },
  certifications: { type: [{ name: String, year: String }], default: [] },
  languages: { type: [{ name: String, level: String }], default: [] },
  contact: {
    email: { type: String, default: undefined }, // default undefined so it can be set from user.email
    phone: { type: String, default: "" },
    linkedin: { type: String, default: "" },
  },
  profileImage: { type: String, default: "" },
  coverImage: { type: String, default: "" },
  role: { type: String, enum: ["jobseeker", "recruiter", "manager"], required: true }, // Add manager role
  companyStatus: { type: String, enum: ["approved", "waiting"], default: "approved" },
  location: { type: String, default: "Unknown" },
  resume: {
    data: Buffer,
    filename: String,
    mimetype: String,
    uploadedAt: Date,
  },
});
const User = mongoose.model('User', userSchema, 'users');

// Routes
app.get('/', (req, res) => {
  res.json({ status: 'API running' });
});

// Get all users
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Register user
app.post('/api/users', async (req, res) => {
  let { name, email, password, company, role } = req.body; // Accept role
  let status = "approved";
  // If creating a company, force role to manager
  if (role === "manager") {
    status = "approved";
  } else if (role === "recruiter") {
    // Recruiters joining an existing company need approval
    if (company) {
      const existing = await User.findOne({ company, role: "manager" });
      if (!existing) {
        role = "manager";
        status = "approved";
      } else {
        status = "waiting";
      }
    }
  }
  // Job seekers are always approved immediately
  const user = new User({ name, email, password, company, role, companyStatus: status }); // Save role
  await user.save();
  // Always return id as string for frontend
  res.status(201).json({ ...user.toObject(), id: user._id });
});

// Login user (simple, no JWT)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    if (user.companyStatus && user.companyStatus === "waiting") {
      return res.status(403).json({ success: false, message: 'Your account is pending manager approval.' });
    }
    // Always return id as string for frontend
    res.json({ success: true, user: { ...user.toObject(), id: user._id } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Get user profile by ID
app.get('/api/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  // Build a full profile object with defaults for missing fields
  res.json(buildUserProfileFromUser(user));
});

// PATCH user profile
app.patch('/api/users/:id', async (req, res) => {
  let update = req.body;
  // Prevent contact.email from being updated
  if (update.contact && 'email' in update.contact) {
    delete update.contact.email;
  }
  const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(buildUserProfileFromUser(user));
});

// Create a new job posting
app.post('/api/jobs', async (req, res) => {
  try {
    const { title, company, location, description, requirements, salary, postedBy } = req.body;
    const job = new Job({ title, company, location, description, requirements, salary, postedBy });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all job postings
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name email');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a job posting
app.patch('/api/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a job posting
app.delete('/api/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve or reject join requests (manager only)
app.post('/api/company/approve', async (req, res) => {
  const { userId, approve } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.companyStatus = approve ? "approved" : "waiting";
  await user.save();
  res.json({ success: true, user });
});

// Remove team member (manager only)
app.post('/api/company/remove', async (req, res) => {
  const { userId } = req.body;
  const user = await User.findByIdAndDelete(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true });
});

// Get all applications for a specific job
app.get('/api/jobs/:id/applications', async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.id }).populate('applicant', 'name email');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Apply to a job (updated to match applyController.js signature)
app.post('/api/apply', (req, res) => applyToJob(req, res));

// Upload resume and save in MongoDB with user
app.post('/api/upload-resume', upload.single('resume'), async (req, res) => {
  const userId = req.body.userId;
  if (!req.file || !userId) return res.status(400).json({ error: 'No file or userId provided' });
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Read file buffer from disk (multer saves to disk by default)
    const fileBuffer = fs.readFileSync(req.file.path);
    user.resume = {
      data: fileBuffer,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      uploadedAt: new Date(),
    };
    await user.save();
    // Remove file from disk after saving to DB
    fs.unlinkSync(req.file.path);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save resume' });
  }
});

// Endpoint to download/view resume
app.get('/api/users/:id/resume', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.resume || !user.resume.data) return res.status(404).json({ error: 'Resume not found' });
    res.set('Content-Type', user.resume.mimetype);
    res.set('Content-Disposition', `inline; filename="${user.resume.filename}"`);
    res.send(user.resume.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

// Endpoint to delete resume from user
app.delete('/api/users/:id/resume', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.resume = undefined;
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});