async function fetchMessages(uuid) {
    try {
      const response = await fetch(`http://localhost:4000/api/pets/${uuid}`);
      const pet = await response.json();
      return pet;
    } catch (error) {
      console.error("Error fetching pet messages:", error);
      return null;
    }
}

async function renderMessages(pet) {
    const messageId = pet.forum && pet.forum.length > 0 ? pet.forum[0] : null;
    
    if (messageId) {
        try {
            const messageData = await fetch(
                `http://localhost:4000/api/messages/message/${messageId}`
            );
            const messageDataJson = await messageData.json();
            if (messageDataJson.userEmail) {
                messageUserEmail = messageDataJson.userEmail;
            } else {
                console.error(`Failed to fetch message data for pet ${pet.name}`);
            }
        } catch (error) {
            console.error(`Error fetching message data for pet ${pet.name}:`, error);
        }
    }

    document.getElementById("pet-name").innerText = `Messages about ${pet.name}`;
    
    const messageData = await fetch(
        `http://localhost:4000/api/messages/message/${messageId}`
    );
    const messageDataJson = await messageData.json();
    const messageBody = document.getElementById("messages-body");
    console.log("Message Body:", messageBody); 
    messageBody.innerHTML = `
        <div class="badge text-bg-light">
            ${messageDataJson.userEmail}
            <h6 class="text-bg-light">${messageDataJson.content}</h6>
        </div>
    `;
}

async function initMessagesPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    console.log("UUID from URL:", uuid);
  
    if (uuid) {
      const pet = await fetchMessages(uuid);
      renderMessages(pet);
    } else {
      console.error("UUID not found in URL query parameters.");
    }
  }
  
  document.addEventListener("DOMContentLoaded", initMessagesPage);

  
