let eventsList = JSON.parse(localStorage.getItem('eventsDetails'));
console.log("Events List :", eventsList);
let selectedEventId = localStorage.getItem('selectedEventId');
console.log("selected Event", selectedEventId);
const userDetails = JSON.parse(localStorage.getItem('userDetails'));

let dashBoardButton = document.getElementById('dashboardButton');
dashBoardButton.onclick = () => { backToDashboard() };
let backToDashboardButton = document.getElementById('backToDashboardButton')
console.log(backToDashboardButton);
backToDashboardButton.onclick = () => { backToDashboard() }
let backToDashboard = () => {
    console.log("Go back to dashboard");
    window.location.href = `../../html/owner/ownerDashboard.html`
}

let currentUserId = JSON.parse(localStorage.getItem('currentUser')) || [];
console.log(currentUserId);
if (!currentUserId) {
    window.location.href = `../../html/main/signIn.html`
}
else {
    profileSetup();
    displayEventDetails();  // Display the event Details to the user
    displayBookedDataForEvent(); // Call to display the booked appointment of the event
    console.log("User Details --->", userDetails);
}

function profileSetup() {
    let userProfileName = document.getElementById('userProfileName');
    let currentUserDetails = userDetails.find(userId => userId.userId === currentUserId);
    console.log("Current userDetails ---> ", currentUserDetails);
    userProfileName.innerHTML = `${currentUserDetails.username}`
}

function displayEventDetails() {
    console.log('Event List --->', eventsList);
    console.log("selected Event", selectedEventId);
    let eventInfo = eventsList.find(eventId => eventId['eventId'] === selectedEventId)
    console.log("Display event id", eventInfo);
    let eventDetails = document.getElementById('eventDetails');
    let eventCard = document.createElement('div');
    let workingDaysCard = document.createElement('div');

    eventDetails.appendChild(eventCard);
    eventDetails.appendChild(workingDaysCard);
    let title = document.createElement('h3');
    title.innerHTML = `${eventInfo.eventName}`

    let duration = document.createElement('p');
    duration.innerHTML = `<i class="bi bi-calendar-check"></i> <b>Event Duration:</b> ${formatDate(eventInfo.eventStartDate)} - ${formatDate(eventInfo.eventEndDate)}`;

    let appointmentDuration = document.createElement('p');
    appointmentDuration.innerHTML = `<i class="bi bi-hourglass-split"></i> <b>Appointment Duration:</b> ${setSessionDuration(eventInfo.slotDuration)}`;

    let onlineAppointmentDays = document.createElement('p');
    onlineAppointmentDays.innerHTML = `<i class="bi bi-laptop"></i> <b>Online Appointment Days</b> `

    let keysToDisplay = ['eventDay', 'eventStartTime', 'eventEndTime']

    let scheduleTable = createTable(eventInfo.eventDays, keysToDisplay)
    scheduleTable.className = 'scheduleTable'
    onlineAppointmentDays.appendChild(scheduleTable)
    eventCard.appendChild(title);
    eventCard.appendChild(duration);
    eventCard.appendChild(appointmentDuration);
    eventCard.appendChild(onlineAppointmentDays);
}
// Function to create a dynamic table
function createTable(data, keys) {
    console.log("Table Data-->", data);

    let sorter = {
        "monday" : 1,
        "tuesday" : 2,
        "wednesday" : 3,
        "thursday" : 4,
        "friday" : 5,
        "saturday" : 6,
        "sunday" : 7
    }

    data.sort(function  sortDays(a,b){
        let day1 = a.eventDay
        let day2 = b.eventDay
        return sorter[day1] - sorter[day2]
    });
    // Create a table element
    const table = document.createElement('table');
      // Create table header
      const thead = table.createTHead();
      const headerRow = thead.insertRow();
      keys.forEach(key => {
          const th = document.createElement('th');
          th.textContent = key.toUpperCase();
          headerRow.appendChild(th);
      });
    // Create table body
    const tbody = table.createTBody();
    data.forEach(obj => {
        const row = tbody.insertRow();
        keys.forEach(key => {
            const cell = row.insertCell();
            cell.textContent = toProperCase(obj[key]);
        });
    });

    console.log("Table created", table);
    return table;
}


function toProperCase(str) {
    console.log("Strimg " , str);
    return str.toLowerCase().replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
}

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

function retrieveBookedData() {
    let bookedAppointmentsList;
    if (localStorage.getItem('bookedAppointments') === null) {

        bookedAppointmentsList = [];
    }
    else {
        bookedAppointmentsList = JSON.parse(localStorage.getItem('bookedAppointments'));

    }

    return bookedAppointmentsList;
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


// Function to load SVG file dynamically
function loadSVG() {
    // Make an AJAX request to fetch the SVG file
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '../../assets/noEventsAvailable.svg', true); // Adjust the path to your SVG file
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let bookedTable = document.querySelector("#bookedAppointmentsTable");
            // Once the SVG content is loaded, insert it into the DOM
            bookedTable.innerHTML = `${xhr.responseText} <h3> <i class="bi bi-x"></i> No Appointments booked Yet</h3>`;
            bookedTable.style.display = 'flex';
            bookedTable.style.justifyContent = 'center';
            bookedTable.style.alignItems = 'center';
            bookedTable.style.flexDirection = 'column';
            document.querySelector('#bookedAppointmentsTable svg').style.width = '50%'
            document.querySelector('#bookedAppointmentsTable svg').style.height = '50%'
            document.querySelector('#bookedAppointmentsTable svg').style.margin = '55px'
        }
    };
    xhr.send();
}


function displayBookedDataForEvent() {

    // else{
    bookedAppointmentsList = retrieveBookedData();
    bookedAppointmentsList.sort((a, b) => {
        // Convert date strings to Date objects for comparison
        const dateA = new Date(a.slotDate + 'T' + a.slotStartTime);
        const dateB = new Date(b.slotDate + 'T' + b.slotStartTime);
        // Compare event dates
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        // If event dates are equal, compare start times
        if (a.slotStartTime < b.slotStartTime) return -1;
        if (a.slotStartTime > b.slotStartTime) return 1;
        return 0;
    });

    console.log("Sorted Appointments list", bookedAppointmentsList);
    let appointmentHTML = "";
    let counter = 1;

    bookedAppointmentsList.forEach(appointmentDetails => {
        console.log('Appointment', appointmentDetails);
        let bookedUserId = appointmentDetails.userId;
        console.log("each booked user id", bookedUserId);
        let bookedUserDetails = userDetails.find(userId => userId.userId === bookedUserId);
        console.log("booked user details", bookedUserDetails);
        if (appointmentDetails.eventId === selectedEventId) {
            let eventInfo = eventsList.find(eventId => eventId['eventId'] === appointmentDetails.eventId)
            appointmentHTML += "<tr>";
            appointmentHTML += `<td>${counter++}</td>`
            appointmentHTML += `<td>${eventInfo.eventName} </td>`;
            appointmentHTML += `<td>${formatDate(appointmentDetails.slotDate)} </td>`;
            appointmentHTML += `<td>${appointmentDetails.slotStartTime}-${appointmentDetails.slotEndTime}  </td>`;
            appointmentHTML += `<td> ${bookedUserDetails.username} </td>`;
            appointmentHTML += `<td> ${bookedUserDetails.useremail} </td>`;
            appointmentHTML += `<td> <button value=${JSON.stringify(appointmentDetails)} class="btn btn-danger deleteButton"><i class="bi bi-x-circle-fill"></i></button></td>`;
            appointmentHTML += "</tr>";
        }

    });
    if (appointmentHTML != "") {
        document.querySelector("#bookedAppointmentsTable tbody").innerHTML = appointmentHTML;

    }
    else {

        document.querySelector("#bookedAppointmentsTable").innerHTML = `${loadSVG()}`;
    }
    // }

}

let deleteAppointmentBtn = document.querySelectorAll('.deleteButton');
console.log("dete btm", deleteAppointmentBtn);
deleteAppointmentBtn.forEach(button => {
    button.addEventListener('click', (e) => {
        let targetAppointment = e.target.value;
        console.log("targetAppointment--> " + targetAppointment);
        const appointmentDetails = JSON.parse(targetAppointment);
        console.log("Index", appointmentDetails);
        let bookedAppointmentsList = retrieveBookedData();
        const indexToDelete = bookedAppointmentsList.findIndex(
            appointment => appointment.slotDate === appointmentDetails.slotDate &&
                appointment.slotStartTime === appointmentDetails.slotStartTime);
        console.log(indexToDelete);
        if (indexToDelete !== -1) {
            if (confirm("Are you sure you want to delete")) {
                bookedAppointmentsList.splice(indexToDelete, 1);
                localStorage.setItem('bookedAppointments', JSON.stringify(bookedAppointmentsList));
                displayBookedDataForEvent();
            }
        }
        else {
            console.log("Appointment Not Found");
        }
    })

})

function logoutUser() {
    let logoutUser = document.getElementById('logoutbtn');
    logoutUser.addEventListener('click', () => {
        localStorage.removeItem("currentUser");
        window.location.href = "../../html/main/home.html";
    })
}
