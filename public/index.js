'use strict';

// elements
// login modal
const btnLogin = document.getElementById('btn-login-1');

const inputEmailLogin = document.getElementById('input-email-1');
const inputPasswordLogin = document.getElementById('input-password-1');

// sign up modal
const btnSignUp = document.getElementById('btn-sign-up');

const inputNameSignUp = document.getElementById('input-name-sign-up');
const inputLocationSignUp = document.getElementById('input-location-sign-up');
const inputEmailSignUp = document.getElementById('input-email-sign-up');
const inputPasswordSignUp = document.getElementById('input-password-sign-up');

// event listeners
btnLogin.addEventListener('click', async e => {
    e.preventDefault();

    const url = 'https://adopt-a-pet-e5cr.onrender.com//api/auth/login';
    const body = {
        email: inputEmailLogin.value,
        password: inputPasswordLogin.value
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!res.ok) throw new Error((await res.json()).err);

        const { token } = await res.json();

        sessionStorage.setItem('token', token);

        swal({
            title: 'Login Successful!',
            icon: 'success',
            timer: 1500,
            button: 'Ok',
            timerProgressBar: true
        });
    } catch (err) {
        console.error(err);

        swal({
            title: err.name,
            text: err.message,
            icon: 'error',
            button: 'Ok'
        });
    }
});

btnSignUp.addEventListener('click', async e => {
    e.preventDefault();

    const url = 'https://adopt-a-pet-e5cr.onrender.com//api/users';
    const body = {
        name: inputNameSignUp.value,
        location: inputLocationSignUp.value,
        email: inputEmailSignUp.value,
        password: inputPasswordSignUp.value
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!res.ok) throw new Error((await res.json()).err);

        const { token } = await res.json();

        sessionStorage.setItem('token', token);

        swal({
            title: 'Sign Up Successful!',
            icon: 'success',
            timer: 1500,
            button: 'Ok',
            timerProgressBar: true
        });
    } catch (err) {
        console.error(err);

        swal({
            title: err.name,
            text: err.message,
            icon: 'error',
            button: 'Ok'
        });
    }
});
