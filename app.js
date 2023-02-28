require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();


// Extra security
const helmet = require("helmet");
const cors = require('cors');
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");




// ConnecDb

const connectDB = require("./db/connect")

//routers
const jobsRouter = require('./routes/jobs');
const authRouter = require('./routes/auth');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const { verifyToken } = require('./middleware/authentication');

app.set("trust proxy", 1);
app.use(express.json());
// extra packages
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  // burst: 20,
  methods: ['GET', 'POST', 'PATCH', 'PUT']
  }));

app.use(helmet());
app.use(cors());
app.use(xss());



// routes

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs",verifyToken ,jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3002;

const start = async () => {
  try {
    await connectDB(process.env.URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
