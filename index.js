const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
// const fs = require('fs');
const path = require('path');
const routes = require('./routes');
require('dotenv').config();

const app = express();

// Ensure the logs directory exists

// const logsDir = path.join(__dirname, 'logs');
// if (!fs.existsSync(logsDir)) {
//   fs.mkdirSync(logsDir, { recursive: true });
// }

// const accessLogStream = fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' });
// const errorLogStream = fs.createWriteStream(path.join(logsDir, 'error.log'), { flags: 'a' });

// app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('combined', {
  stream: {
    write: (message) => console.log(message.trim()) // Log to console
  }
}));
// app.use(morgan('dev')); 

app.use(express.json());

const allowedOrigins = ['http://localhost:5173', 'https://attendance-frontend-iota.vercel.app'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET, POST, PUT, DELETE, PATCH',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
}));

const dbURI = process.env.NODE_ENV === "production"
  ? process.env.MONGODB_URI_PRODUCTION
  : process.env.MONGODB_URI_LOCAL;

mongoose.connect(dbURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    // fs.writeFileSync(path.join(logsDir, 'error.log'), `${new Date().toISOString()} - MongoDB connection error: ${err}\n`, { flag: 'a' });
  });

app.use('/', routes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  // fs.writeFileSync(path.join(logsDir, 'error.log'), `${new Date().toISOString()} - ${err.stack}\n`, { flag: 'a' });
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
