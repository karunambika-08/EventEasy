/**
 * 
 * @param {string} key 
 * @returns locally stored data of any type['array of Object','string'....]
 */
function fetchFromStorage(key) {
    let fetchedData = JSON.parse(localStorage.getItem(key));
    return fetchedData;
}


// Fetching the current user of the session
const currentUserId = JSON.parse(localStorage.getItem('currentUser')) || undefined;
console.log("currentUserId", currentUserId);
const eventsContainer = document.getElementById('eventsContainer');
const userDetails = JSON.parse(localStorage.getItem('userDetails'));
const currentUserDetails = userDetails.find(userId => userId.userId === currentUserId);
const createdEventsList = fetchFromStorage('eventsDetails') || [];

let mainContainer = document.querySelector('.mainContainer');
console.log(mainContainer);
console.log("currentUserDetails", currentUserDetails.userType);
if (!currentUserId) {
    window.location.href = `../../html/main/signIn.html`
}
else {

    console.log("User ID", currentUserDetails.userType)
    profileSetup();
    console.log("event-->", createdEventsList);
    displayEvents(createdEventsList);



}

function deleteModel() {
    // Get the modal
    let modal = document.getElementById("deleteConfirmationModal");
    let deleteButtons = document.querySelectorAll(".delete-event");
    let cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
    let eventToDeleteId;
    // Add event listener to each delete button
    deleteButtons.forEach(function (deleteButton) {
        deleteButton.onclick = function () {
            eventToDeleteId = this.id;
            modal.style.display = "block";
        };
    });
    let closeModelBtn = document.querySelector(".close");
    closeModelBtn.onclick = function () {
        modal.style.display = "none";
    };
    cancelDeleteBtn.onclick = function () {
        modal.style.display = "none";
    };

    // Function to handle event deletion when confirmed
    function confirmDelete() {
        // Event Deletion Function
        deleteEvent(eventToDeleteId);
        modal.style.display = "none";
    }
    let confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    confirmDeleteBtn.onclick = confirmDelete;
}



function profileSetup() {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const currentUserDetails = userDetails.find(userId => userId.userId === currentUserId);
    console.log("currentUserDetails", currentUserDetails.userType);
    let userProfileName = document.getElementById('userProfileName');
    console.log("User Details --->", userDetails);
    console.log("Current userDetails ---> ", currentUserDetails);
    userProfileName.innerHTML = `${currentUserDetails.username}`
}


function eventCreation() {
    localStorage.removeItem('editEvent');
    window.location.href = `../../html/owner/createAppointment.html`
}

// -----> Funtion to merge the date and time and return the epoch time
function mergeDateAndTimeInput(dateInput) {
    const date = new Date(dateInput)
    // const [hours, mins] = timeInput.split(':');
    const dateTime = date.getTime();
    console.log("Date Time:", dateTime);
    return dateTime;
}
// -----> Function to display the events created <------
function displayEvents(eventsInfo) {

    let events = eventsInfo
    events.sort(function sortEvents(a, b) {
        let event1 = mergeDateAndTimeInput(a.eventStartDate);
        console.log("Event 1 Start Date: " + a.eventStartDate);
        let event2 = mergeDateAndTimeInput(b.eventStartDate);
        console.log("Event 2 Start Date: " + b.eventStartDate);

        return event1 - event2
    })
    console.log("Display Events --->", events);

    if (events.length === 0) {
        //display a message for no appointment
        eventsContainer.innerHTML = '<p>No events available</p>';
        return;
    }
    if (currentUserId) {
        let currentOwnerEventList = events.filter(ownerId => ownerId.ownerId === currentUserId);
        if (currentOwnerEventList.length <= 0) {
            eventsContainer.innerHTML = `<h4>No Events Created , Click <a href="../owner/createAppointment.html">Create Events</a> to create your events</h4>`
        }
        else {
            currentOwnerEventList.forEach(events => {
                const eventsCard = createEventCard(events);
                eventsContainer.appendChild(eventsCard);
            });
        }
        console.log("currentOwnerEventList", currentOwnerEventList);

    }
    else {
        let mainContainer = document.querySelector('.mainContainer');
        console.log(mainContainer);
        mainContainer.innerHTML = `<h3>Please <a href="signIn.html">Sign in</a>/<a href="signup.html">Sign up</a> to create and manage your events </h3>`;

    }
}




// ----> Function to append owner created appointment to user <-----
function createEventCard(eventInfo) {

    let card = document.createElement('div');
    card.className = 'event-card';
    card.classList.add('eventsCard');
    console.log("Appointment Card Creation --->", eventInfo.eventId)
    let title = document.createElement('h3');
    title.textContent = eventInfo.eventName;

    let eventStartDate = eventInfo.eventStartDate;
    formatDate(eventStartDate);
    let eventEndDate = eventInfo.eventEndDate;
    formatDate(eventEndDate);

    let dateRange = document.createElement('p');

    dateRange.innerHTML = `<i class="bi bi-calendar-check"></i> <b>${formatDate(eventStartDate)} - ${formatDate(eventEndDate)}</b>`;


    let slotDuration = document.createElement('p');
    slotDuration.innerHTML = `<i class="bi bi-hourglass-bottom"></i> <b>Appointment Duration:</b> ${setSessionDuration(eventInfo.slotDuration)}`;
    // ----> Event Edit Button <----
    let editEvent = document.createElement('button');
    editEvent.innerHTML = `<i class="bi bi-pencil-square"></i>`;
    editEvent.className = 'edit-event';

    // ---> Triggering Edit btn <---
    editEvent.addEventListener('click', () => {
        editEvent.id = eventInfo.eventId;
        localStorage.setItem('editEvent', editEvent.id);
        window.location.href = `../../html/owner/createAppointment.html`;
    });
    // ---> Delete Button <----
    let deleteCard = document.createElement('button');
    deleteCard.innerHTML = `<i class="bi bi-trash-fill"></i>`;
    deleteCard.className = 'delete-event';
    deleteCard.id = eventInfo.eventId;
    // ---> Triggering the delete event function
    deleteCard.onclick = () => {
        // deleteCard.id = eventInfo.eventId;
        deleteModel()
        // if (confirm(`Are you sure you want to delete?`)) {
        //     console.log("Coming");
        //     deleteEvent(deleteCard.id, eventInfo.eventName)
        // }

    }
    let view = document.createElement('button');
    view.innerHTML = `<span><i class="bi bi-trash-fill"></i></span>`
    view.textContent = 'View Appointments';
    view.className = 'view-event'
    view.onclick = () => {
        view.id = eventInfo.eventId;
        localStorage.setItem('selectedEventId', view.id);
        window.location.href = `../../html/owner/viewAppointment.html`
    }
    let manipulateCard = document.createElement('div');
    manipulateCard.className = 'manipulate-card';
    manipulateCard.appendChild(editEvent);
    manipulateCard.appendChild(deleteCard);
    manipulateCard.appendChild(view);

    card.appendChild(title);
    card.appendChild(dateRange);
    card.appendChild(slotDuration);
    card.appendChild(manipulateCard);

    return card;
}



// -----> Date Formatting  Function for Display <-----
function formatDate(date) {
    let dateInput = date;
    let dateObj = new Date(dateInput);
    if (!isNaN(dateObj)) {
        let day = dateObj.getDate();
        const month = dateObj.toLocaleString('default', { month: 'short' });
        let year = dateObj.getUTCFullYear();
        let date = `${month} ${day} ${year}`;
        return date;
    }
}



// ----> Setting session Duration <-----
function setSessionDuration(duration) {
    let durationInput = Number(duration);

    let sessionDuration;
    switch (durationInput) {
        case 30:
            sessionDuration = "30 Minutes";
            break;
        case 60:
            sessionDuration = "1 hour";
            break;
        case 90:
            sessionDuration = "1 hour 30 Minutes";
            break;
        case 120:
            sessionDuration = "2 hours";
            break;
        case 150:
            sessionDuration = "2 hours 30 Minutes";
            break;
        default:
            sessionDuration = "30 Minutes";
            break;
    }
    return sessionDuration;
}


// ----> Deleting a Event <---
function deleteEvent(eventId, eventName) {
    console.log("Coming to delete", eventId);
    let eventsArray = [];
    if (createdEventsList) {
        eventsArray = createdEventsList;
    }
    let eventsAfterDelete = eventsArray.filter(eventToDelete => eventToDelete.eventId !== eventId) || [];
    console.log('eventsAfterDelete', eventsAfterDelete);
    saveEventsToLocalStorage(eventsAfterDelete)
    eventsContainer.innerHTML = '';
    setTimeout(() => {
        showToast('Event deleted successfully', 'success')

    }, 1500);
    displayEvents(eventsAfterDelete);

}

function saveEventsToLocalStorage(key) {
    localStorage.setItem('eventsDetails', JSON.stringify(key));
}


// Function to show toast Message
function showToast(toastMessage, type) {
    let toastContainer = document.getElementById("toast-container");
    toastContainer.style.display = "block";
    if (type == "error") {
        toastContainer.style.backgroundColor = "red";
        toastContainer.innerHTML = `<i class="bi bi-x-circle"></i> ${toastMessage} `
    }
    else {
        toastContainer.style.backgroundColor = "green";
        toastContainer.innerHTML = `<i class="bi bi-check"></i> ${toastMessage} `
    }
    // To Hide the toast message after 3 seconds
    setInterval(function () {
        toastContainer.style.display = "none";
    }, 3000);
}

// ---> Logging out the user <---

function logoutUser() {
    let logoutUser = document.getElementById('logoutbtn');
    logoutUser.addEventListener('click', () => {
        localStorage.removeItem("currentUser");
        window.location.href = "../../html/main/home.html";
    })
}

