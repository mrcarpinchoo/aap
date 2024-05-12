'use strict';

// Imports
// libraries
const bcrypt = require('bcryptjs');

// project modules
const User = require('../models/User');
const dbUser = require('../../db/models/User');

function validateReqBody(req, res, next) {
    const { email, password } = req.body;

    try {
        User.validateEmail(email);
    } catch (err) {
        return res.status(400).send({ err: err._message });
    }

    try {
        User.validatePassword(password);
    } catch (err) {
        return res.status(400).send({ err: err._message });
    }

    next();
}

/**
 * Retrieves the user with the email specified in req.body. If no instance with that email exists in the
 * database, req.body.user is null.
 */
async function getUserFromDb(req, res, next) {
    const { email } = req.body;

    req.body.user = await dbUser.getUserByEmail(email);

    next();
}

function checkEmailExistence(req, res, next) {
    const found = req.body.user !== null;

    if (!found) return res.status(404).send({ err: 'User email not found.' });

    next();
}

function validatePassword(req, res, next) {
    const { password } = req.body;
    const user = req.body.user;

    if (!bcrypt.compareSync(password, user.password))
        return res.status(401).send({ err: 'Incorrect password.' });

    next();
}

module.exports = {
    validateReqBody,
    getUserFromDb,
    checkEmailExistence,
    validatePassword
};
