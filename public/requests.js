async function fetchRequests(uuid) {
    try {
        const response = await fetch(
            `https://adopt-a-pet-e5cr.onrender.com/api/pets/${uuid}`
        );
        const pet = await response.json();
        return pet;
    } catch (error) {
        console.error('Error fetching pet requests:', error);
        return null;
    }
}

async function renderRequest(pet) {
    const requestId =
        pet.requests && pet.requests.length > 0 ? pet.requests[0] : null;

    document.getElementById('pet-name').innerText = `Requests for ${pet.name}`;

    if (requestId) {
        try {
            const requestData = await fetch(
                `https://adopt-a-pet-e5cr.onrender.com/api/requests/request/${requestId}`
            );
            const requestDataJson = await requestData.json();
            if (requestDataJson.userEmail) {
                requestUserEmail = requestDataJson.userEmail;
            } else {
                console.error(
                    `Failed to fetch request data for pet ${pet.name}`
                );
            }
        } catch (error) {
            console.error(
                `Error fetching request data for pet ${pet.name}:`,
                error
            );
        }

        const requestData = await fetch(
            `https://adopt-a-pet-e5cr.onrender.com/api/requests/request/${requestId}`
        );
        const requestDataJson = await requestData.json();
        const requestBody = document.getElementById('requests-body');
        console.log('Request Body:', requestBody);
        requestBody.innerHTML = `
        <tr>
            <th scope="row">First Name</th>
            <td>${requestDataJson.userFirstName}</td>
        </tr>
        <tr>
            <th scope="row">Last Name</th>
            <td>${requestDataJson.userLastName}</td>
        </tr>
        <tr>
            <th scope="row">City</th>
            <td>${requestDataJson.userCity}</td>
        </tr>
        <tr>
            <th scope="row">State</th>
            <td>${requestDataJson.userState}</td>
        </tr>
        <tr>
            <th scope="row">Postal Code</th>
            <td>${requestDataJson.userPostalCode}</td>
        </tr>
        <tr>
            <th scope="row">Direction</th>
            <td>${requestDataJson.userDirection}</td>
        </tr>
        <tr>
            <th scope="row">Age</th>
            <td>${requestDataJson.userAge} years</td>
        </tr>
        <tr>
            <th scope="row">Couple</th>
            <td>${requestDataJson.userCouple}</td>
        </tr>
        <tr>
            <th scope="row">Children Quantity</th>
            <td>${requestDataJson.userChildrenQty}</td>
        </tr>
        <tr>
            <th scope="row">Email</th>
            <td>${requestDataJson.userEmail}</td>
        </tr>
    `;
    } else {
        document.getElementById('body-requests').textContent = 'No requests!';
    }
}

async function initRequestsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get('uuid');
    console.log('UUID from URL:', uuid);

    if (uuid) {
        const pet = await fetchRequests(uuid);
        renderRequest(pet);
    } else {
        console.error('UUID not found in URL query parameters.');
    }
}

document.addEventListener('DOMContentLoaded', initRequestsPage);
