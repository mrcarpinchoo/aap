async function fetchPetInfo(uuid) {
    try {
        const response = await fetch(
            `https://adopt-a-pet-e5cr.onrender.com/api/pets/${uuid}`
        );
        const pet = await response.json();
        return pet;
    } catch (error) {
        console.error('Error fetching pet information:', error);
        return null;
    }
}

async function renderPetInfo(pet) {
    const imageId = pet.images && pet.images.length > 0 ? pet.images[0] : null;
    let imageUrl =
        'https://img.freepik.com/free-vector/flat-illustration-people-with-cute-pets_23-2148967780.jpg';

    if (imageId) {
        try {
            const imageData = await fetch(
                `https://adopt-a-pet-e5cr.onrender.com/api/images/image/${imageId}`
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

    document.getElementById('pet-name').innerText = `Meet ${pet.name}`;
    document.getElementById('pet-image').src = imageUrl;

    const petInfoBody = document.getElementById('pet-info-body');
    petInfoBody.innerHTML = `
      <tr>
        <th scope="row">Name</th>
        <td>${pet.name}</td>
      </tr>
      <tr>
        <th scope="row">Age</th>
        <td>${pet.age} years</td>
      </tr>
      <tr>
        <th scope="row">Breed</th>
        <td>${pet.breed}</td>
      </tr>
      <tr>
        <th scope="row">Weight</th>
        <td>${pet.weight} lbs</td>
      </tr>
      <tr>
        <th scope="row"><i class="bi bi-geo-alt fs-4 me-2"></i>Location</th>
        <td>${pet.location}</td>
      </tr>
      <tr>
        <th scope="row"><i class="bi bi-clipboard-check fs-4 me-2"></i>Vaccinations</th>
        <td>${pet.vaccinations}</td>
      </tr>
      <tr>
        <th scope="row"><i class="bi bi-person fs-4 me-2"></i>Owner Information</th>
        <td>
          <ul>
            <li><i class="bi bi-envelope me-2"></i>${pet.ownerEmail}</li>
          </ul>
        </td>
      </tr>
      <tr>
        <th scope="row">Owner's Description</th>
        <td>${pet.description}</td>
      </tr>
      <tr>
        <th scope="row"><i class="bi bi-heart fs-4 me-2"></i>Dog's Character</th>
        <td>${pet.character}</td>
      </tr>
      <tr>
        <th scope="row"><i class="bi bi-bandaid fs-4 me-2"></i>Known Conditions</th>
        <td>${pet.conditions}</td>
      </tr>
      <tr>
        <td colspan="2">
            <br />
            <div class="text-center">
            <button
                class="btn btn-success me-2"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#contactOwnerModal"
            >
                <i class="bi bi-person-fill me-2 text-white"></i>
                Contact Owner
            </button>
            <button class="btn btn-success btn-add me-2" data-petuuid="${pet.uuid}">
                <i class="bi bi-star-fill me-2 text-white"></i>
                Add to Wishlist
            </button>
            <button class="btn btn-success btn-forum" type="button">
                <i
                class="bi bi-chat-right-text-fill me-2 text-white"
                ></i>
                Pet Forum
            </button>
            </div>
            <br />
        </td>
        </tr>
    `;
}

function redirectToForum(uuid) {
    window.location.href = `forum.html?uuid=${uuid}`;
}

document.addEventListener('click', e => {
    if (e.target.classList.contains('btn-forum')) {
        const urlParams = new URLSearchParams(window.location.search);
        const uuid = urlParams.get('uuid');
        redirectToForum(uuid);
    }
});

async function initPetInfoPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get('uuid');
    console.log('UUID from URL:', uuid);

    if (uuid) {
        const pet = await fetchPetInfo(uuid);
        renderPetInfo(pet);
    } else {
        console.error('UUID not found in URL query parameters.');
    }
}

async function addPetToWishlist(el) {
    const uuid = el.dataset['petuuid'];

    try {
        await addPet(uuid);

        swal({
            title: 'Pet added to wishlist!',
            icon: 'success',
            timer: 1500,
            button: 'Ok',
            timerProgressBar: true
        });
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

async function addPet(uuid) {
    const url = `https://adopt-a-pet-e5cr.onrender.com/api/wishlists/my-wishlist/add/${uuid}`;

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

// Event listeners
document.addEventListener('DOMContentLoaded', initPetInfoPage);

document.addEventListener('click', e => {
    const btnAdd = e.target.closest('.btn-add');

    if (btnAdd) {
        const target = e.target;
        const targetClasses = target.classList;
        const targetParentClasses = target.parentElement.classList;

        if (
            targetClasses.contains('btn-add') ||
            targetParentClasses.contains('btn-add')
        )
            return addPetToWishlist(btnAdd);
    }
});
