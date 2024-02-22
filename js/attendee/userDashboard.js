const eventsList = JSON.parse(localStorage.getItem('eventsDetails'));
console.log(eventsList);
let currentUserId = JSON.parse(localStorage.getItem('currentUser')) || undefined;
console.log(currentUserId);
const slotcontainer = document.getElementById('slotContainer');


if (!currentUserId) {
    window.location.href = `../../html/main/signIn.html`
}
else {
    profileSetup();
    displayEvents();
    const dashboardButton = document.getElementById('dashboardButton');
    dashboardButton.onclick = () => {
        window.location.href = '../../html/attendee/userbookedDashboard.html'
    }
}

function profileSetup() {
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    console.log("User Details", userDetails);
    let currentUserDetails = userDetails.find(userId => userId.userId === currentUserId);
    console.log("Cuurent userDetails: ", currentUserDetails);
    let userProfileName = document.getElementById('userProfileName');
    userProfileName.innerHTML = `<i class="bi bi-person-fill"></i>${currentUserDetails.username}`
}


 // Function to load SVG file dynamically
 function loadSVG() {
    // Make an AJAX request to fetch the SVG file
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '../../assets/noEventsAvailable.svg', true); // Adjust the path to your SVG file
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let displayEvents =  document.getElementById('eventsContainer');
            // Once the SVG content is loaded, insert it into the DOM
            displayEvents.innerHTML = `${xhr.responseText}<h3> <i class="bi bi-x"></i> No events available </h3>`;
            displayEvents.style.display = 'flex';
            displayEvents.style.justifyContent = 'center';
            displayEvents.style.alignItems = 'center';
            document.getElementById('eventsContainer').style.flexDirection = 'column';
            console.log(document.querySelector('#eventsContainer svg'));
            document.querySelector('#eventsContainer svg').style.width = '50%'
            document.querySelector('#eventsContainer svg').style.height = '50%'
            document.querySelector('.bookedAppointmentsContainer svg').style.margin = '10px';

        }
    };
    xhr.send();
}

/* 
        ----> Display Events Created By Owner <----
*/
function displayEvents() {
const eventsContainer = document.getElementById('eventsContainer');

    const events = eventsList || [];

    if (events.length === 0) {
        //display a message for no events available
        loadSVG();
        return;
    }
    events.forEach(events => {
        const eventsCard = createEventsCard(events);
        eventsContainer.appendChild(eventsCard);
    });


}


function dataToDisplay() {
  console.log("dataToDisplay");
  
  
}
//-----> Function to append owner created event to user <----
/**
 * @param {eventInfo}
 */
function createEventsCard(eventInfo) {
const displayEventContainer = document.getElementById('events');

    const card = document.createElement('div');
    card.classList.add('eventCard');
    const title = document.createElement('h3');
    title.textContent = eventInfo.eventName;

    const eventStartDate = eventInfo.eventStartDate;
    formatDate(eventStartDate);
    const eventEndDate = eventInfo.eventEndDate;
    formatDate(eventEndDate);

    const dateRange = document.createElement('p');
    dateRange.innerHTML = '<i class="bi bi-calendar-check"></i> ' + `<b>${formatDate(eventStartDate)} - ${formatDate(eventEndDate)}</b>`;

    const slotDuration = document.createElement('p');
    slotDuration.innerHTML = `<i class="bi bi-hourglass-bottom"></i><b>Appointment Duration</b>: ${setSessionDuration(eventInfo.slotDuration)}`;

    // View Slot button
    const viewSlots = document.createElement('button');
    viewSlots.textContent = 'View Appointments';
    viewSlots.id = eventInfo.eventId;


    viewSlots.onclick = () => {
        localStorage.setItem('selectedEvent', viewSlots.id);
        window.location.href = `../../html/attendee/slotBooking.html`
        // displaySlots(eventInfo)

    }
    card.appendChild(title);
    card.appendChild(dateRange);
    card.appendChild(slotDuration);
    card.appendChild(viewSlots);
    return card;
}

// ---> Date Formatting  Function for Display <---
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

// Setting session Duration
function setSessionDuration(duration) {
    let durationInput = duration;
    let sessionDuration;
    switch (durationInput) {
        case "30":
            sessionDuration = "30 Minutes";
            break;
        case "60":
            sessionDuration = "1 hour";
            break;
        case "90":
            sessionDuration = "1 hour 30 Minutes";
            break;
        case "120":
            sessionDuration = "2 hours";
            break;
        case "180":
            sessionDuration = "2 hour 30 Minutes";
            break;
        default:
            sessionDuration = "30 Minutes";
            break;
    }
    return sessionDuration;
}

// -------> Function to Display slot <--------

function displayEventDetails(events) {
    let eventsDetails = document.getElementById('eventsDetails');
    let cardTitle = document.createElement('h3');
    cardTitle.innerHTML = 'Event Details';
    let eventsName = document.createElement('p');
    eventsName.innerHTML = `<i class="bi bi-easel-fill"></i>Event : ${events.eventName}`
    let eventDuration = document.createElement('p');
    eventDuration.innerHTML = `<i class="bi bi-calendar-check"></i>Date : ${formatDate(events.eventStartDate)} - ${formatDate(events.eventEndDate)}`;
    let appointmentDuration = document.createElement('p');
    appointmentDuration.innerHTML = `Appointment Duration : ${setSessionDuration(events.slotDuration)} `
    eventsDetails.appendChild(cardTitle);
    eventsDetails.appendChild(eventsName);
    eventsDetails.appendChild(eventDuration);
}


function displaySlots(events) {
    // Display event Details for selected Slot
    displayEventDetails(events);

    console.log("Display Event:", events);
    document.getElementById("headerContainer").firstElementChild.textContent = events.eventName + " Slots ";
    eventsDateControl(events.eventStartDate, events.eventEndDate);
    let datePicked = document.getElementById('currentDateSlotPicker');
    datePicked.addEventListener('input', () => {
        let selectedSlotDate = datePicked.value;
        const d = new Date(selectedSlotDate);
        let daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        if (events.createdAppointments.some(obj => Object.values(obj).includes(daysOfWeek[d.getDay()]))) {
            const selectedDateDetails = events.createdAppointments.find(obj => obj.day === daysOfWeek[d.getDay()]);
            console.log("Slot Details --->", selectedDateDetails);
            slotCreation(events, selectedSlotDate, selectedDateDetails);
        }
        else {
            NoSlotAvailable(selectedSlotDate);
            console.log("No Slot Available");
        }
    })
    // ---> Function to Enable Start and End Date of the Event <---
    function eventsDateControl(eventsStartDate, eventsEndDate) {
        let enableStartandEndDate = () => {
            let currentDate = new Date();
            let startDate = new Date(eventsStartDate)
            console.log(eventsStartDate)
            if (startDate < currentDate) {
                eventsStartDate = formatForSpecificDate(currentDate);
                datePicked.setAttribute("min", eventsStartDate);
                datePicked.setAttribute("max", eventsEndDate);
            }
            else {
                datePicked.setAttribute("min", eventsStartDate);
                datePicked.setAttribute("max", eventsEndDate);
            }
        }

        let datePicked = document.getElementById('currentDateSlotPicker');
        datePicked.addEventListener('input', enableStartandEndDate())
    }
}

/* --> Format Date function for Date Mapping <--- 
*/
function formatForSpecificDate(date) {
    let dateInput = date;
    let dateObj = new Date(dateInput);
    if (!isNaN(dateObj)) {
        let day = dateObj.getDate();
        let month = dateObj.getMonth() + 1;
        let year = dateObj.getUTCFullYear();
        if (day < 10) {
            day = `0${day}`
        }
        if (month < 10) {
            month = `0${month}`
        }
        let date = `${year}-${month}-${day}`;
        return date;
    }
}

function logoutUser() {
    let logoutUser = document.getElementById('logoutbtn');
    logoutUser.addEventListener('click', () => {
        localStorage.removeItem("currentUser");
        window.location.href = "../../html/main/home.html";
    })
}
