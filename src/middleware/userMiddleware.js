'use strict';

// Imports
// libraries
const { nanoid } = require('nanoid');
const jwt = require('jsonwebtoken');

// project modules
const User = require('../models/User');
const dbUser = require('../../db/models/User');
const dbWishlist = require('../../db/models/Wishlist');

const NANOID_SIZE = 10;

function validateReqBody(req, res, next) {
    const { name, location, email, password } = req.body;

    try {
        User.validateName(name);
    } catch (err) {
        return res.status(400).send({ err: err._message });
    }

    try {
        User.validateLocation(location);
    } catch (err) {
        return res.status(400).send({ err: err._message });
    }

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

function validateReqBodyForUpdate(req, res, next) {
    const { name, location } = req.body;

    try {
        User.validateName(name);
    } catch (err) {
        return res.status(400).send({ err: err._message });
    }

    try {
        User.validateLocation(location);
    } catch (err) {
        return res.status(400).send({ err: err._message });
    }

    next();
}

async function checkEmailExistence(req, res, next) {
    const { email } = req.body;

    const found = (await dbUser.getUserByEmail(email)) !== null;

    if (found) return res.status(409).send({ err: 'User already exists.' });

    next();
}

async function createWishlist(req, res, next) {
    try {
        const { _id: wishlistID } = await dbWishlist.createWishlist({
            uuid: nanoid(NANOID_SIZE),
            pets: []
        });

        req.wishlistID = wishlistID;
    } catch (err) {
        return res.status(500).send({ err: err.message });
    }

    next();
}

function authorize(req, res, next) {
    const token = req.get('x-token');

    try {
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY, {
            algorithm: 'HS256'
        });

        req.user = { _id: decoded._id, email: decoded.email };
    } catch (err) {
        return res.status(401).send({ err: err.message });
    }

    next();
}

module.exports = {
    validateReqBody,
    validateReqBodyForUpdate,
    checkEmailExistence,
    createWishlist,
    authorize
};
