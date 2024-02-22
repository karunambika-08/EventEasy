let eventsList = JSON.parse(localStorage.getItem('eventsDetails'));
// console.log("Event Details: " ,eventsList);
let currentUserId = JSON.parse(localStorage.getItem('currentUser'));
console.log(currentUserId);
if (!currentUserId) {
    window.location.href = `../../html/main/signIn.html`
}
else {
    profileSetup(); //Current User Setup Call
    displayBookedData(); //Display Booked Data 
    deleteBookedAppointment()
    let eventsBoardButton = document.getElementById('eventsBoardButton');
    eventsBoardButton.onclick = () => {
        window.location.href = "../../html/attendee/userEventsDashboard.html"
    }
}

function fetchCurrentUserBookedList() {
    let userBookedAppointmentsList = JSON.parse(localStorage.getItem('bookedAppointments'))
    console.log("bookedAppointmentsList --->", userBookedAppointmentsList);
    let currentUserBookedList = userBookedAppointmentsList.filter(userId => userId.userId === currentUserId) || "SZ0wyXzr";
    console.log("currentUserBookedList --->", currentUserBookedList);
    return currentUserBookedList;
}

function profileSetup() {
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    console.log("User Details---->", userDetails);
    let currentUserDetails = userDetails.find(userId => userId.userId === currentUserId);
    console.log("Current userDetails ---> ", currentUserDetails);
    let userProfileName = document.getElementById('userProfileName');
    userProfileName.innerHTML = `<i class="bi bi-person-fill"></i>${currentUserDetails.username}`
}




function displayBookedData() {
    let bookedAppointmentsList = retrieveBookedData();
    if (bookedAppointmentsList.length > 0) {
        bookedAppointmentsList = sortBookedAppointments(bookedAppointmentsList)
        displayAppointments(bookedAppointmentsList);
        displayPastAppointments(bookedAppointmentsList);
    }
    else {
        displayNoAppointmentsMessage();
    }
}

function displayAppointments(bookedAppointmentsList) {
    let appointment = "";
    let counter = 1;
    bookedAppointmentsList.forEach(appointmentDetails => {
        let eventInfo = eventsList.find(eventId => eventId['id'] === appointmentDetails.eventId)
        appointment += "<tr>";
        appointment += `<td>${counter++}</td>`
        appointment += `<td>${eventInfo.eventName} </td>`;
        appointment += `<td> ${formatDate(appointmentDetails.slotDate)} </td>`;
        appointment += `<td> ${appointmentDetails.slotStartTime}-${appointmentDetails.slotEndTime}  </td>`;
        let deleteDetails = JSON.stringify(appointmentDetails);
        appointment += `<td> <button  value=${deleteDetails} class="btn btn-danger deleteButton">Delete</button></td>`
        appointment += "</tr>";
        // console.log("Hello",appointmentDetails);
    });
    document.querySelector("#bookedAppointmentsTable tbody").innerHTML = appointment;
}

 // Function to load SVG file dynamically
 function loadSVG() {
    // Make an AJAX request to fetch the SVG file
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '../../assets/noEventsAvailable.svg', true); // Adjust the path to your SVG file
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let displayEvents =  document.querySelector(".bookedAppointmentsContainer");
            // Once the SVG content is loaded, insert it into the DOM
            displayEvents.innerHTML = `${xhr.responseText}<h3><i class="bi bi-x" style="background-color:'none'"></i>No Booked Appointments </h3>
            <p>Please <a href="../../html/attendee/userEventsDashboard.html">Click Here</a> to book new appointment</p>`;
            displayEvents.style.display = 'flex';
            displayEvents.style.justifyContent = 'center';
            displayEvents.style.alignItems = 'center';
            displayEvents.style.flexDirection = 'column';
            console.log(document.querySelector('.bookedAppointmentsContainer svg'));
            document.querySelector('.bookedAppointmentsContainer svg').style.width = '50%'
            document.querySelector('.bookedAppointmentsContainer svg').style.height = '50%'
            document.querySelector('.bookedAppointmentsContainer svg').style.margin = '10px';
        }
    };
    xhr.send();
}

function displayNoAppointmentsMessage() {
    document.querySelector(".bookedAppointmentsContainer").innerHTML = `
   ${loadSVG()}`
}


function displayPastAppointments(appointments) {
    const currentDate = new Date(); // Get current date and time
    const pastAppointments = appointments.filter(appointment => {
        const appointmentDateTime = new Date(appointment.slotDate + 'T' + appointment.slotStartTime);
        return appointmentDateTime < currentDate; // Filter out past appointments
    });
    
    if (pastAppointments.length > 0) {
        const pastAppointmentsHTML = generatePastAppointmentsHTML(pastAppointments);
        let pastAppointmentsContainer =document.querySelector("#pastAppointmentsContainer");
        let pastAppointmentsTable =  document.createElement('div');
        pastAppointmentsTable.className = 'pastAppointmentsTable';
        pastAppointmentsTable.innerHTML = pastAppointmentsHTML;
        pastAppointmentsContainer.appendChild(pastAppointmentsTable);
    }
    //  else {
    //     document.querySelector("#pastAppointments").innerHTML = "<p>No past appointments.</p>";
    // }
}

function generatePastAppointmentsHTML(appointments) {
    let pastAppointmentsHTML = "<h5>Completed Appointments</h5><table>";
    pastAppointmentsHTML += "<thead><tr><th>S.no</th><th>Event Name</th><th>Date</th><th>Time</th></tr></thead>";
    pastAppointmentsHTML += "<tbody>";
    appointments.forEach((appointment, index) => {
        console.log("Past Appointments", appointment);
        let eventInfo = eventsList.find(eventId => eventId['id'] === appointment.eventId)

        pastAppointmentsHTML += `<tr><td>${index + 1}</td><td>${eventInfo.eventName}</td><td>${formatDate(appointment.slotDate)}</td><td>${appointment.slotStartTime}-${appointment.slotEndTime}</td></tr>`;
    });
    pastAppointmentsHTML += "</tbody></table>";
    return pastAppointmentsHTML;
}

function sortBookedAppointments(bookedAppointmentsList) {
    bookedAppointmentsList.sort((a, b) => {
        const dateA = new Date(a.slotDate + 'T' + a.slotStartTime);
        const dateB = new Date(b.slotDate + 'T' + b.slotStartTime);
        // Comparing Dates
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        // If event dates are equal, compare start times
        if (a.slotStartTime < b.slotStartTime) return -1;
        if (a.slotStartTime > b.slotStartTime) return 1;

    });
    return bookedAppointmentsList;
}

function retrieveBookedData() {
    let bookedAppointmentsList;
    if (localStorage.getItem('bookedAppointments') === null) {
        bookedAppointmentsList = [];
    }
    else {
        bookedAppointmentsList = fetchCurrentUserBookedList();
        console.log("current user ", bookedAppointmentsList);
    }

    return bookedAppointmentsList;


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

function deleteBookedAppointment() {
    let deleteAppointmentBtn = document.querySelectorAll('.deleteButton');
    console.log("dete btm", deleteAppointmentBtn);
    deleteAppointmentBtn.forEach(button => {
        button.addEventListener('click', (e) => {
            if(confirm('Are you sure you want to delete?')){
                let targetAppointment = e.target.value;
                console.log("targetAppointment: " + targetAppointment);
                let appointmentDetails = JSON.parse(targetAppointment);
                console.log("Index", appointmentDetails);
                let bookedAppointmentsList = retrieveBookedData();
                let indexToDelete = bookedAppointmentsList.findIndex(
                    appointment => appointment.slotDate === appointmentDetails.slotDate &&
                        appointment.slotStartTime === appointmentDetails.slotStartTime);
                console.log(indexToDelete);
                if (indexToDelete !== -1) {
                    bookedAppointmentsList.splice(indexToDelete, 1);
                    localStorage.setItem('bookedAppointments', JSON.stringify(bookedAppointmentsList));
                    displayBookedData();
                }
                else {
                    console.log("Appointment Not Found");
                }
            }
            
        })

    })
}


function logoutUser() {
    let logoutUser = document.getElementById('logoutbtn');
    logoutUser.addEventListener('click', () => {
        localStorage.removeItem("currentUser");
        window.location.href = "../../html/main/home.html";
    })
}


// deleteAppointmentBtn.onclick = () => {
//    console.log(deleteAppointmentBtn.id)
// };