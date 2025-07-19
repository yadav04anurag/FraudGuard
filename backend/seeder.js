require('dotenv').config();
const mongoose = require('mongoose');
const { FraudApp, FraudUrl } = require('./models/FraudData');
const User = require('./models/User');
const data = require('./data.json');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeder...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const importData = async () => {
  await connectDB();
  try {
    await FraudApp.deleteMany();
    await FraudUrl.deleteMany();
    await User.deleteMany();

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@frauddashboard.com',
      password: 'password123',
      role: 'admin',
    });
    const adminId = adminUser._id;

    const sampleApps = data.fraudulent_apps.map(app => ({ ...app, reportedBy: adminId }));
    const sampleUrls = data.fraudulent_urls.map(url => ({ ...url, reportedBy: adminId }));

    await FraudApp.insertMany(sampleApps);
    await FraudUrl.insertMany(sampleUrls);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error during data import: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  await connectDB();
  try {
    await FraudApp.deleteMany();
    await FraudUrl.deleteMany();
    await User.deleteMany();
    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error during data destruction: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}