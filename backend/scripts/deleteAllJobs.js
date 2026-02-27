import mongoose from 'mongoose';
import Job from '../jobModel.js';



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
