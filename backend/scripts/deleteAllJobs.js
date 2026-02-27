import mongoose from 'mongoose';
import Job from '../jobModel.js';

const MONGO_URI = 'mongodb+srv://backend:12345@inter.mgnp44y.mongodb.net/Tal?retryWrites=true&w=majority&appName=Inter';

async function deleteAllJobs() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const result = await Job.deleteMany({});
  console.log(`Deleted ${result.deletedCount} jobs.`);
  await mongoose.disconnect();
}

deleteAllJobs().catch(err => {
  console.error(err);
  process.exit(1);
});
