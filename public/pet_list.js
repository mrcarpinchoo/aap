document.addEventListener('DOMContentLoaded', async function () {
    const pagination = document.getElementById('pet-pagination');

    async function fetchPets() {
        const res = await fetch(
            'https://adopt-a-pet-e5cr.onrender.com//api/pets',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        const pets = await res.json();
        return pets;
    }

    async function renderPets(page = 0) {
        const pets = JSON.parse(sessionStorage.getItem('pets'));

        const urlParams = new URLSearchParams(window.location.search);
        const breed = urlParams.get('breed') || '';
        const age = urlParams.get('age') || '';
        const location = urlParams.get('location') || '';
        const conditions = urlParams.get('conditions') || '';

        let filteredPets = pets.filter(pet => {
            let include = true;
            if (
                breed &&
                !pet.breed.toLowerCase().includes(breed.toLowerCase())
            ) {
                include = false;
            }
            if (age && pet.age !== parseInt(age)) {
                include = false;
            }
            if (
                location &&
                !pet.location.toLowerCase().includes(location.toLowerCase())
            ) {
                include = false;
            }
            if (
                conditions &&
                !pet.conditions.toLowerCase().includes(conditions.toLowerCase())
            ) {
                include = false;
            }
            return include;
        });

        const pageSize = 6;
        const start = page * pageSize;
        const end = start + pageSize;
        const paginatedPets = filteredPets.slice(start, end);

        const petsRow = document.getElementById('pets-row');
        petsRow.innerHTML = '';

        for (const pet of paginatedPets) {
            let imageUrl =
                'https://img.freepik.com/free-vector/flat-illustration-people-with-cute-pets_23-2148967780.jpg';

            if (pet.images && pet.images.length > 0) {
                const imageId = pet.images[0];
                try {
                    const imageData = await fetch(
                        `https://adopt-a-pet-e5cr.onrender.com//api/images/image/${imageId}`
                    );
                    const imageDataJson = await imageData.json();
                    if (imageDataJson.url) {
                        imageUrl = imageDataJson.url;
                    } else {
                        console.error(
                            `Failed to fetch image URL for pet ${pet.name}`
                        );
                    }
                } catch (error) {
                    console.error(
                        `Error fetching image URL for pet ${pet.name}:`,
                        error
                    );
                }
            }

            const petCard = `
        <div class="col-lg-4 mb-4">
          <a href="pet_info.html?uuid=${pet.uuid}" style="text-decoration: none">
            <div class="card">
              <img src="${imageUrl}" class="card-img-top" alt="${pet.name}">
              <div class="card-body">
                <h5 class="card-title">${pet.name}</h5>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">Age: ${pet.age} years</li>
                  <li class="list-group-item">Breed: ${pet.breed}</li>
                  <li class="list-group-item">Location: ${pet.location}</li>
                </ul>
                <a href="pet_info.html?uuid=${pet.uuid}" class="btn btn-success mt-3">View Details</a>
              </div>
            </div>
          </a>
        </div>
      `;
            petsRow.innerHTML += petCard;
        }

        const totalPages = Math.ceil(filteredPets.length / pageSize);
        pagination.innerHTML = '';
        for (let i = 0; i < totalPages; i++) {
            const pageButton = document.createElement('li');
            pageButton.classList.add('page-item');
            const link = document.createElement('a');
            link.classList.add('page-link', 'text-success');
            link.href = '#';
            link.dataset.page = i;
            link.textContent = i + 1;
            pageButton.appendChild(link);
            pagination.appendChild(pageButton);
        }
    }

    const searchInput = document.querySelector('.form-control');
    searchInput.addEventListener('input', function (event) {
        const searchFilter = event.target.value.trim();
        renderPets(0, searchFilter);
    });

    pagination.addEventListener('click', function (e) {
        e.preventDefault();
        const target = e.target;
        if (target !== e.currentTarget && target.tagName === 'A') {
            const page = parseInt(target.dataset.page);
            renderPets(page);
        }
    });

    document
        .getElementById('filter-btn')
        .addEventListener('click', async function () {
            console.log('Filter button clicked');

            const breed = document.getElementById('breed-filter').value.trim();
            const age = document.getElementById('age-filter').value.trim();
            const location = document
                .getElementById('location-filter')
                .value.trim();
            const conditions = document
                .getElementById('conditions-filter')
                .value.trim();

            let url = 'https://adopt-a-pet-e5cr.onrender.com//api/pets?';
            let filterApplied = false;

            if (breed) {
                url += `breed=${breed}&`;
                filterApplied = true;
            }
            if (age) {
                url += `age=${age}&`;
                filterApplied = true;
            }
            if (location) {
                url += `location=${location}&`;
                filterApplied = true;
            }
            if (conditions) {
                url += `conditions=${conditions}&`;
                filterApplied = true;
            }
            if (url.endsWith('&')) {
                url = url.slice(0, -1);
            }

            console.log('URL with filters:', url);

            try {
                const response = await fetch(url);
                const pets = await response.json();
                console.log('Filtered pets:', pets);
                sessionStorage.setItem('pets', JSON.stringify(pets));
                renderPets();
            } catch (error) {
                console.error('Error fetching pets:', error);
            }
        });

    try {
        const pets = await fetchPets();
        sessionStorage.setItem('pets', JSON.stringify(pets));
        renderPets();
    } catch (error) {
        console.error('Error fetching pets:', error);
    }
});
