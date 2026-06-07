"use strict";

// Logger
// $ npm i morgan
// https://expressjs.com/en/resources/middleware/morgan.html

const morgan = require("morgan");

const customLog =
  'TIME=":date[clf]" - URL=":url" - Method=":method" - IP=":remote-addr" - Ref=":referrer" - Status=":status" - Sing=":user-agent" - (:response-time[digits] ms)';

// v3
const rfs = require('rotating-file-stream');
const path = require('node:path');
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily // 1m // 1w // 1m
  path: path.join(__dirname, '../../logs')
});

module.exports = morgan(customLog, { stream: accessLogStream });