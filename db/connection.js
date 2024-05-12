'use strict';

// Imports
// libraries
const mongoose = require('mongoose');

// project modules
const config = require('./config');

const atlasURI = config.getURI();

mongoose
    .connect(atlasURI, { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB Atlas successfully!'))
    .catch(err => console.error('MongoDB Atlas connection error:', err));

module.exports = mongoose;
