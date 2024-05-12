'use strict';

async function init() {
    try {
        const wishlist = await fetchWishlist();

        renderWishlist(wishlist);
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

async function fetchWishlist() {
    const url =
        'https://adopt-a-pet-e5cr.onrender.com/api/wishlists/my-wishlist';

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

async function renderWishlist(wishlist) {
    try {
        const pets = await fetchWishlistPets(wishlist);

        const html = await buildCardComponents(pets);

        petsContainer.innerHTML = html;
    } catch (err) {
        console.error(err);
    }
}

async function fetchWishlistPets(wishlist) {
    const petsPromises = wishlist.pets.map(async pet => {
        const url = `https://adopt-a-pet-e5cr.onrender.com/api/pets/${pet}`;

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
    });

    try {
        return await Promise.all(petsPromises);
    } catch (err) {
        throw err;
    }
}

async function buildCardComponents(pets) {
    const cardsPromises = pets.map(async pet => {
        try {
            const [image] = await fetchImage(pet.uuid);

            return `
                <div
                    class="pet-container col-lg-4 mb-4"
                    data-petuuid="${pet.uuid}"
                >  
                    <div class="card">
                        <img
                            src="${image?.url}"
                            class="card-img-top"
                            alt="${pet.name}"
                        />
                        <div class="card-body">
                            <h5 class="card-title">${pet.name}</h5>

                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">Age: ${pet.age} years</li>
                                <li class="list-group-item">Breed: ${pet.breed}</li>
                                <li class="list-group-item">Location: ${pet.location}</li>
                            </ul>

                            <div class="d-flex justify-content-around mx-1">
                                <button
                                    type="button"
                                    class="btn btn-success mt-3"
                                    data-bs-toggle="modal"
                                    data-bs-target="#request-modal"
                                    data-petuuid="${pet.uuid}"
                                    title="Request adoption"
                                >
                                    <i class="bi bi-heart-fill"></i>
                                </button>

                                <a
                                    href="pet_info.html?uuid=${pet.uuid}"
                                    class="btn btn-info mt-3"
                                    title="See details"
                                >
                                    <i class="bi bi-list-ul"></i>
                                </a>

                                <button
                                    type="button"
                                    class="btn btn-danger btn-remove mt-3"
                                    data-petuuid="${pet.uuid}"
                                    title="Remove from wishlist"
                                >
                                    <i class="bi bi-star"></i>
                                </button>
                            </div>   
                        </div>
                    </div>
                </div>
            `;
        } catch (err) {
            throw err;
        }
    });

    try {
        const cards = await Promise.all(cardsPromises);

        return cards.join('\n');
    } catch (err) {
        throw err;
    }
}

async function fetchImage(petUUID) {
    const url = `https://adopt-a-pet-e5cr.onrender.com/api/images/${petUUID}`;

    try {
        const res = await fetch(url);

        if (!res.ok) throw new Error((await res.json()).err);

        return await res.json();
    } catch (err) {
        throw err;
    }
}

function removePetFromWishlist(el) {
    // Elements
    const petContainer = el.closest('.pet-container');

    const uuid = petContainer.dataset['petuuid'];

    swal({
        title: 'Are you sure you want to remove this pet from your wishlist?',
        icon: 'warning',
        buttons: true,
        dangerMode: true
    }).then(willDelete => {
        if (willDelete) {
            removePet(uuid).then(() => {
                swal('Pet has been removed from wishlist!', {
                    icon: 'success'
                }).then(() => init());
            });
        } else swal('Pet has not been removed from wishlist!');
    });
}

async function removePet(uuid) {
    const url = `https://adopt-a-pet-e5cr.onrender.com/api/wishlists/my-wishlist/remove/${uuid}`;

    try {
        const res = await fetch(url, {
            method: 'PUT',
            headers: { 'x-token': sessionStorage.getItem('token') }
        });

        if (!res.ok) throw new Error((await res.json()).err);

        return await res.json();
    } catch (err) {
        throw err;
    }
}

// Elements
const petsContainer = document.getElementById('pets-row');

const btnFilter = document.getElementById('btn-filter');

const inputBreed = document.getElementById('input-breed-filter');
const inputLocation = document.getElementById('input-location-filter');

init();

// event listeners
petsContainer.addEventListener('click', e => {
    const target = e.target;
    const targetClasses = target.classList;
    const targetParentClasses = target.parentElement.classList;

    if (
        targetClasses.contains('btn-remove') ||
        targetParentClasses.contains('btn-remove')
    )
        return removePetFromWishlist(target);
});

btnFilter.addEventListener('click', async () => {
    const breed = inputBreed.value.trim().toLowerCase();
    const location = inputLocation.value.trim().toLowerCase();

    try {
        const wishlist = await fetchWishlist();

        const pets = await fetchWishlistPets(wishlist);

        const result = pets.filter(pet => {
            return (
                pet.breed.toLowerCase().includes(breed) &&
                pet.location.toLowerCase().includes(location)
            );
        });

        const html = await buildCardComponents(result);

        petsContainer.innerHTML = html;
    } catch (err) {
        console.error(err);

        swal({
            title: 'Error',
            text: err.message,
            icon: 'warning',
            button: 'Ok'
        });
    }
});
