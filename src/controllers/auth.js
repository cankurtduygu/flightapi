'use strict';
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const CustomError = require('../helpers/customError');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../helpers/generateJwt');
const passwordValidation = require('../helpers/passwordValidation');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = {
  register: async (req, res) => {
    /*
        #swagger.tags = ["Authentication"]
        #swagger.summary = "Register"
        #swagger.description = 'Register with username, email and password for create a new user'
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            schema: {
                "username": "test",
                "email": "test@example.com",
                "password": "aA12345.?",
            }
        }
    */
    const { username, email, password, firstName, lastName } = req.body;

    if (!(username && email && password))
      throw new CustomError('Username, email and password are required.', 400);

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      throw new CustomError('Username or email already exists.', 400);
    }

    passwordValidation(password);

    const result = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
    });

    // JWT
    const access = generateAccessToken(result);
    const refresh = generateRefreshToken(result);

    res.status(201).send({
      error: false,
      result,
      bearer: { access, refresh },
    });
  },

  login: async (req, res) => {
    /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Login"
            #swagger.description = 'Login with username (or email) and password for get simpleToken and JWT'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "username": "test",
                    "password": "aA12345.?",
                }
            }
        */

    const { username, email, password } = req.body;

    if (!((username || email) && password))
      throw new CustomError('Username/Email and Password are required.', 401);

    const user = await User.findOne({
      $or: [{ username }, { email }],
      password,
    });

    if (!user)
      throw new CustomError('Incorrect Username/Email or Password.', 401);

    if (!user.isActive)
      throw new CustomError('This account is not active.', 401);

    // JWT
    const access = generateAccessToken(user);
    const refresh = generateRefreshToken(user);

    res.status(200).send({
      error: false,
      bearer: { access, refresh },
    });
  },

  logout: async (req, res) => {
        /*
           #swagger.tags = ["Authentication"]
           #swagger.summary = "Logout"
        */

        res.status(200).send({
            error: false,
            message: 'User logout success You can delete token from your session.'
        });
    },

    refresh: async (req, res, next) => {
        /*
            #swagger.tags = ['Authentication']
            #swagger.summary = 'JWT: Refresh'
            #swagger.description = 'Refresh accessToken with refreshToken'
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    refresh: '...refreshToken...'
                }
            }
        */

        const { refresh } = req.body;

        if (!refresh) throw new CustomError('Refresh Token not Fount.', 401);

        jwt.verify(refresh, process.env.REFRESH_KEY, async (err, refreshData) => {
            if (err) return next(new CustomError(`JWT Error: ${err.message}`, 401));

            const user = await User.findById(refreshData.id);

            if (!user)
                return next(new CustomError("Refresh data is not valid.", 401));

            if (!user.isActive)
                return next(new CustomError("This account is banned.", 401));

            // JWT
            const access = generateAccessToken(user);

            res.status(200).send({
                error: false,
                bearer: { access },
            });
        });

    }

};
