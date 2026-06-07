'use strict';

const express = require('express');
const app = express();

app.set('query parser', 'extended');

require('dotenv').config();
const PORT = process.env?.PORT || 8000;

/* ------------------------------------------------------- */
//* Middlewares:

// Accept JSON:
app.use(express.json());

// Auhentication:
app.use(require('./src/middlewares/authentication'));

// // Query Handler
app.use(require('./src/middlewares/queryHandler'));

// // Logger:
app.use(require('./src/middlewares/logger'));

/* ------------------------------------------------------- */
//* Routes:

// HomePath
app.all('/', (req, res) => {
  res.send({
    error: false,
    message: 'Welcome to FLIGHT API',
    docs: {
      swagger: '/documents/swagger',
      redoc: '/documents/redoc',
      json: '/documents/json',
    },
    user: req.user,
  });
});

// Other path
app.use("/", require("./src/routes"));

/* ------------------------------------------------------- */
//* Error Handlers

// Not found route
app.all("/*splat", (req, res) => {
  res.errStatusCode = 404;
  throw new Error("Route is not found.");
});

// Error handler
app.use(require("./src/middlewares/errorHandler"));


/* ----------------------------------------- */
const server = app.listen(PORT, async () => {
  const { dbConnection } = require('./src/configs/dbConnection');

  await dbConnection()
    .then(() => console.log(`running at: http://127.0.0.1:${PORT}`))
    .catch(() => {
      console.log('Server shutting down due to DB connection failure.');
      server.close(() => process.exit(1));
    });
});
