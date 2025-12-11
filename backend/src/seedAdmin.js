import connectDB from './utils/db.js';
import User from './models/user.js';

async function createAdmin() {
  await connectDB();
  const admin = await User.create({
    username: 'anshublogger',
    passwordHash: 'blogger53',  // Will be hashed by pre-save hook
    role: 'admin',
  });
  console.log('Admin created:', admin);
  process.exit(0);
}

createAdmin();
