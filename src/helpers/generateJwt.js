'use strict';
const jwt = require('jsonwebtoken');

module.exports = {
    generateAccessToken: (user) => {

        const accessData = {
            _id: user._id,
            username: user.username,
            isActive: user.isActive,
            isAdmin: user.isAdmin,
            isStaff: user.isStaff
        };

        return jwt.sign(accessData, process.env.ACCESS_KEY, { expiresIn: '1d' })
    },

    generateRefreshToken: (user) => {
        return jwt.sign({ id: user._id }, process.env.REFRESH_KEY, { expiresIn: '7d' });
    }
}