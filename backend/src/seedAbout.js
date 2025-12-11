import connectDB from './utils/db.js';
import About from './models/about.js';

async function seedAbout() {
  await connectDB();
  
  // Delete existing
  await About.deleteMany({});
  
  // Create new
  const about = await About.create({
    content: 'These two weeks were crucial for the project as the mid-term evaluation approached, and we needed to cover most of the work. We held a special meeting in addition to our weekly status call, where my mentors and I discussed the project in a more detailed and thorough manner.',
  });
  
  console.log('✅ About content seeded:', about);
  process.exit(0);
}

seedAbout();
