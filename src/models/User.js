'use strict';

class UserException {
    constructor(message) {
        this._name = 'UserException';
        this._message = message;
    }
}

class User {
    // Static methods
    static validateName(name) {
        // checks if name is not a string
        if (typeof name !== 'string')
            throw new UserException('User name must be a string.');

        // checks if name is not an empty string
        if (name.trim() === '')
            throw new UserException('User name cannot be empty.');
    }

    static validateLocation(location) {
        // checks if location is not a string
        if (typeof location !== 'string')
            throw new UserException('User location must be a string.');

        // checks if location is not an empty string
        if (location.trim() === '')
            throw new UserException('User location cannot be empty.');
    }

    static validateEmail(email) {
        // checks if email is not a string
        if (typeof email !== 'string')
            throw new UserException('User email must be a string.');

        // checks if email is not an empty string
        if (email.trim() === '')
            throw new UserException('User email cannot be empty.');
    }

    static validatePassword(password) {
        // checks if password is not a string
        if (typeof password !== 'string')
            throw new UserException('User password must be a string.');

        // checks if password is not an empty string
        if (password.trim() === '')
            throw new UserException('User password cannot be empty.');
    }
}

module.exports = User;
