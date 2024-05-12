// -------------------------------------------------- FUNCIONES RO ------------------------------------------------------------------------------------

const token = sessionStorage.getItem('token');
const tokenPayload = parseJwt(token);
const userEmail = tokenPayload.email;

async function fetchUserPets() {
    console.log(userEmail);

    const res = await fetch(
        `https://adopt-a-pet-e5cr.onrender.com//api/pets?ownerEmail=${userEmail}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-token': token
            }
        }
    );

    const pets = await res.json();

    return pets;
}

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(function (c) {
                    return (
                        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                    );
                })
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error parsing JWT token:', error);
        return {};
    }
}

async function renderPetCard(pet) {
    const imageId = pet.images && pet.images.length > 0 ? pet.images[0] : null;
    let imageUrl =
        'https://img.freepik.com/free-vector/flat-illustration-people-with-cute-pets_23-2148967780.jpg';

    if (imageId) {
        try {
            const imageData = await fetch(
                `https://adopt-a-pet-e5cr.onrender.com//api/images/image/${imageId}`
            );
            const imageDataJson = await imageData.json();
            if (imageDataJson.url) {
                imageUrl = imageDataJson.url;
            } else {
                console.error(`Failed to fetch image URL for pet ${pet.name}`);
            }
        } catch (error) {
            console.error(
                `Error fetching image URL for pet ${pet.name}:`,
                error
            );
        }
    }

    return `
    <div class="col-md-4 mb-4">
        <div class="card">
            <img src="${imageUrl}" class="card-img-top" alt="${pet.name}" />
            <div class="card-body text-center">
                <h5 class="card-title">${pet.name}</h5>
                <p class="card-text">Breed: ${pet.breed}</p>
                <div class="d-flex justify-content-center" style="margin-top: 20px;">
                    <button class="btn btn-success mx-1 btn-requests" title="Requests" data-uuid="${pet.uuid}"><i class="bi bi-ui-checks"></i></button>
                    <button class="btn btn-warning mx-1 edit-pet" data-uuid="${pet.uuid}" title="Edit"><i class="bi bi-pencil-fill text-white"></i></button>
                    <button class="btn btn-danger mx-1 delete-pet" data-uuid="${pet.uuid}" title="Delete"><i class="bi bi-trash-fill"></i></button>
                </div>
            </div>
        </div>
    </div>
  `;
}

function redirectToRequests(uuid) {
    window.location.href = `requests.html?uuid=${uuid}`;
}

document.addEventListener('click', e => {
    if (e.target.classList.contains('btn-requests')) {
        // const urlParams = new URLSearchParams(window.location.search);
        const uuid = e.target.dataset['uuid'];

        redirectToRequests(uuid);
    }
});

async function renderUserPets() {
    try {
        const pets = await fetchUserPets();
        const petCardsHtml = (await Promise.all(pets.map(renderPetCard))).join(
            ''
        );
        const userPetsContainer = document.getElementById(
            'user-pets-container'
        );
        userPetsContainer.innerHTML = petCardsHtml;
    } catch (error) {
        console.error('Error fetching or rendering user pets:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    renderUserPets();
    const editPetModal = document.getElementById('edit-pet-modal');
    const editPetForm = document.getElementById('edit-pet-form');
    const editPetNameInput = document.getElementById('edit-pet-name');

    document.addEventListener('click', async function (event) {
        if (event.target.classList.contains('delete-pet')) {
            const uuid = event.target.dataset.uuid;
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then(async result => {
                if (result.isConfirmed) {
                    try {
                        const response = await fetch(
                            `https://adopt-a-pet-e5cr.onrender.com//api/pets/${uuid}`,
                            {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'x-token': sessionStorage.getItem('token')
                                }
                            }
                        );
                        if (response.ok) {
                            Swal.fire({
                                title: 'Deleted!',
                                text: 'Your pet has been deleted.',
                                icon: 'success',
                                timer: 2000,
                                timerProgressBar: true,
                                showConfirmButton: false
                            });
                            renderUserPets();
                        } else {
                            Swal.fire({
                                title: 'Error!',
                                text: 'Failed to delete the pet.',
                                icon: 'error',
                                timer: 2000,
                                timerProgressBar: true,
                                showConfirmButton: false
                            });
                        }
                    } catch (error) {
                        console.error('Error deleting pet:', error);
                    }
                }
            });
        }
    });

    const closeButtons = document.querySelectorAll("[data-bs-dismiss='modal']");
    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            editPetModal.classList.remove('show');
            editPetModal.style.display = 'none';
        });
    });

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('edit-pet')) {
            const uuid = event.target.dataset.uuid;
            editPetModal.classList.add('show');
            editPetModal.style.display = 'block';
            fetch(`https://adopt-a-pet-e5cr.onrender.com//api/pets/${uuid}`)
                .then(response => response.json())
                .then(pet => {
                    editPetNameInput.value = pet.name;
                    document.getElementById('edit-pet-description').value =
                        pet.description;
                    document.getElementById('edit-pet-breed').value = pet.breed;
                    document.getElementById('edit-pet-age').value = pet.age;
                    document.getElementById('edit-pet-weight').value =
                        pet.weight;
                    document.getElementById('edit-pet-location').value =
                        pet.location;
                    document.getElementById('edit-pet-character').value =
                        pet.character;
                    document.getElementById('edit-pet-conditions').value =
                        pet.conditions;
                    document.getElementById('edit-pet-vaccinations').value =
                        pet.vaccinations;
                    editPetForm.dataset.uuid = uuid;
                })
                .catch(error =>
                    console.error('Error fetching pet data:', error)
                );
        }
    });

    editPetForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const uuid = event.target.dataset.uuid;
        const formData = new FormData(editPetForm);
        console.log(sessionStorage.getItem('token'));

        try {
            const response = await fetch(
                `https://adopt-a-pet-e5cr.onrender.com//api/pets/${uuid}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-token': sessionStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        name: formData.get('name'),
                        description: formData.get('description'),
                        breed: formData.get('breed'),
                        age: formData.get('age'),
                        ownerEmail: userEmail,
                        weight: formData.get('weight'),
                        location: formData.get('location'),
                        character: formData.get('character'),
                        conditions: formData.get('conditions'),
                        vaccinations: formData.get('vaccinations')
                    })
                }
            );
            if (response.ok) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Your pet has been updated.',
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                editPetModal.classList.remove('show');
                editPetModal.style.display = 'none';
                renderUserPets();
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to update the pet.',
                    icon: 'error',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error('Error updating pet:', error);
        }
    });

    const addPetForm = document.getElementById('add-pet-form');
    const submitPetBtn = document.getElementById('submit-pet-btn');
    const addPetModal = document.getElementById('add-pet-modal');

    submitPetBtn.addEventListener('click', function () {
        const bsModal = new bootstrap.Modal(addPetModal);
        bsModal.show();
    });

    addPetForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const petFormData = new FormData(this);
        let imageUrl = document.getElementById('add-image-url').value;

        const isValidUrl = url => {
            try {
                new URL(url);
                return true;
            } catch (error) {
                return false;
            }
        };

        if (!imageUrl.trim() || !isValidUrl(imageUrl)) {
            imageUrl =
                'https://img.freepik.com/free-vector/flat-illustration-people-with-cute-pets_23-2148967780.jpg';
        }

        try {
            const petData = {
                ...Object.fromEntries(petFormData),
                ownerEmail: userEmail
            };

            const petResponse = await fetch(
                'https://adopt-a-pet-e5cr.onrender.com//api/pets',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-token': sessionStorage.getItem('token')
                    },
                    body: JSON.stringify(petData)
                }
            );

            if (!petResponse.ok) {
                throw new Error('Failed to add pet');
            }
            const { uuid } = await petResponse.json();
            const imageData = {
                name: petFormData.get('name'),
                url: imageUrl,
                description: petFormData.get('description'),
                binary: 'binary'
            };

            const imageResponse = await fetch(
                `https://adopt-a-pet-e5cr.onrender.com//api/images/${uuid}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-token': sessionStorage.getItem('token')
                    },
                    body: JSON.stringify(imageData)
                }
            );

            if (imageResponse.ok) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Your pet has been added for adoption.',
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                }).then(() => {
                    document
                        .getElementById('add-pet-modal')
                        .classList.remove('show');
                    document.getElementById('add-pet-modal').style.display =
                        'none';
                    renderUserPets();
                    window.location.href = 'profile.html';
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to add the image.',
                    icon: 'error',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error('Error adding pet:', error);
        }
    });
});

async function init() {
    try {
        const user = await fetchUser();

        renderProfile(user);
    } catch (err) {
        console.error(err);

        swal({
            title: 'Error',
            text: err.message,
            icon: 'warning',
            button: 'Ok'
        });
    }
}

async function fetchUser() {
    const url = 'https://adopt-a-pet-e5cr.onrender.com//api/users';

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: { 'x-token': sessionStorage.getItem('token') }
        });

        if (!res.ok) throw new Error((await res.json()).err);

        return await res.json();
    } catch (err) {
        throw err;
    }
}

function renderProfile(user) {
    const formProfile = document.getElementById('form-profile');
    const headingProfile = document.getElementById('heading-name-profile');

    headingProfile.textContent = user.name;

    formProfile.innerHTML = `
      <div class="mb-3">
          <input
          type="text"
          class="form-control"
          name="input-name-profile"
          id="input-name-profile"
          placeholder="Name"
          value="${user.name}"
          />
      </div>
      <div class="mb-3">
          <input
          type="email"
          class="form-control"
          name="input-email-profile"
          id="input-email-profile"
          placeholder="Email"
          value="${user.email}"
          disabled
          />
      </div>
      <div class="mb-3">
          <input
          type="text"
          class="form-control"
          name="input-location-profile"
          id="input-location-profile"
          placeholder="Location"
          value="${user.location}"
          />
      </div>
  `;
}

async function updateUser(name, location) {
    const url = 'https://adopt-a-pet-e5cr.onrender.com//api/users';

    const body = {
        name,
        location
    };

    try {
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) throw new Error((await res.json()).err);

        return await res.json();
    } catch (err) {
        throw err;
    }
}

// Elements
const btnEdit = document.getElementById('btn-edit');

init();

btnEdit.addEventListener('click', async () => {
    const inputName = document.getElementById('input-name-profile');
    const inputLocation = document.getElementById('input-location-profile');

    try {
        const updatedUser = await updateUser(
            inputName.value,
            inputLocation.value
        );

        renderProfile(updatedUser);

        swal.fire({
            title: 'Profile updated!',
            icon: 'success',
            timer: 1500,
            timerProgressBar: true
        });
    } catch (err) {
        console.error(err);

        swal.fire({
            title: 'Error',
            text: err.message,
            icon: 'warning'
        });
    }
});
