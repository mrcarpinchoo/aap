'use strict';

// Imports
// libraries
const dotenv = require('dotenv');

dotenv.config(); // loads .env file contents into process.env

module.exports = {
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
    getURI() {
        return `mongodb+srv://${this.dbUser}:${this.dbPass}@adopt-a-pet-cluster.hunogxb.mongodb.net/${this.dbName}?retryWrites=true&w=majority&appName=adopt-a-pet-cluster`;
    }
};
