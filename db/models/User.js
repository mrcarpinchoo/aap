'use strict';

// Imports
// libraries
const bcrypt = require('bcryptjs');

// project modules
const mongoose = require('../connection');

// user schema
const userSchema = mongoose.Schema({
    uuid: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    wishlistID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wishlist',
        unique: true,
        required: true
    },
    location: {
        type: String,
        required: true
    }
});

// User CRUD operations -----
// create
userSchema.statics.createUser = async data => {
    const hash = bcrypt.hashSync(data.password);

    data.password = hash;

    try {
        return await dbUser(data).save(); // returns the new user object
    } catch (err) {
        throw new Error(err.message);
    }
};

// read
userSchema.statics.getUserByID = async id => {
    try {
        return await dbUser.findById(id);
    } catch (err) {
        throw new Error(err.message);
    }
};

userSchema.statics.getUserByUUID = async uuid => {
    try {
        return await dbUser.findOne({ uuid });
    } catch (err) {
        throw new Error(err.message);
    }
};

userSchema.statics.getUserByEmail = async email => {
    try {
        return await dbUser.findOne({ email });
    } catch (err) {
        throw new Error(err.message);
    }
};

// update
userSchema.statics.updateUser = async (id, data) => {
    try {
        return await dbUser.findByIdAndUpdate(id, data, { new: true });
    } catch (err) {
        throw new Error(err.message);
    }
};

// delete
userSchema.statics.deleteUser = async id => {
    try {
        return await dbUser.findByIdAndDelete(id);
    } catch (err) {
        throw new Error(err.message);
    }
};

const dbUser = mongoose.model('User', userSchema);

module.exports = dbUser;
