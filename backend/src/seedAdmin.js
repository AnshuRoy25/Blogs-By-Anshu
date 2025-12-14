import connectDB from './utils/db.js';
import User from './models/user.js';

async function createAdmin() {
  try {
    await connectDB();
    const admin = await User.create({
      username: "anshublogger",
      passwordHash: "blogger53",
      role: "admin",
    });
    console.log("Admin created:", admin._id);
  } catch (error) {
    console.error("Failed to create admin:", error.message);
  } finally {
    process.exit(0);
  }
}


createAdmin();
