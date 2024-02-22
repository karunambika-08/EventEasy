const eventsList = JSON.parse(localStorage.getItem('eventsDetails'))
console.log("Locally Stored Data", eventsList);
let selectedEvent = localStorage.getItem('selectedEvent');
console.log(selectedEvent);
let currentUserId = JSON.parse(localStorage.getItem('currentUser')) || undefined;
console.log(currentUserId);
const userDetails = JSON.parse(localStorage.getItem('userDetails'));
console.log("User Details---->", userDetails);
const currentUserDetails = userDetails.find(userId => userId.userId === currentUserId);
console.log("Current userDetails ---> ", currentUserDetails);

if (!currentUserId) {
    window.location.href = `../../html/main/signIn.html`
}
else {
    profileSetup()
}

function profileSetup() {
    let userProfileName = document.getElementById('userProfileName');
    userProfileName.innerHTML = `<i class="bi bi-person-fill"></i>${currentUserDetails.username}`
}


const userBookedAppointments = JSON.parse(localStorage.getItem('bookedAppointments')) || [];
console.log(userBookedAppointments);
let eventInfo = eventsList.find(eventInfo => eventInfo.eventId === selectedEvent);
console.log("Event Info -->", eventInfo);

document.addEventListener('DOMContentLoaded', function () {
    displaySlots(eventInfo);
    displayEventDetails(eventInfo)
});

const slotcontainer = document.getElementById('slotContainer');
const displaySlotsContainer = document.getElementById('slots');
const displayEventContainer = document.getElementById('eventInfo');
let logoutUser = document.getElementById('logoutbtn');
// ----> Return to the display events <-----

let backToDashboardbtn = document.querySelector('.backToDashboard');
backToDashboardbtn.addEventListener('click', (e) => {
    window.location.href = '../../html/attendee/userEventsDashboard.html'
    localStorage.removeItem('selectedEvent');
})
const dashboardButton = document.getElementById('dashboardButton');

dashboardButton.onclick = () => {
    window.location.href = '../../html/attendee/userbookedDashboard.html'
}


let eventsBoardButton = document.getElementById('eventsBoardButton');
eventsBoardButton.onclick = () => {
    window.location.href = "../../html/attendee/userEventsDashboard.html"
}

function displayEventDetails(eventInfo) {
    let eventsDetails = document.getElementById('eventsDetails');
    let cardTitle = document.createElement('h3');
    cardTitle.innerHTML = 'Event Details';
    let eventsName = document.createElement('p');
    eventsName.innerHTML = `<i class="bi bi-easel-fill"></i> <b>Event :</b> ${eventInfo.eventName}`
    let eventDuration= document.createElement('p');
    eventDuration.innerHTML = `<i class="bi bi-calendar-check"></i> <b> Date : </b>${formatDate(eventInfo.eventStartDate)} - ${formatDate(eventInfo.eventEndDate)}`;
    let appointmentDuration = document.createElement('p');
    appointmentDuration.innerHTML = `<i class="bi bi-hourglass-bottom"></i> <b>Appointment Duration : </b>${setSessionDuration(eventInfo.slotDuration)} `;
    let onlineAppointmentDays = document.createElement('p');
    onlineAppointmentDays.innerHTML = `<i class="bi bi-laptop"></i> <b>Online Appointment Days</b> `
    let keysToDisplay = ['eventDay', 'eventStartTime', 'eventEndTime']
    let scheduleTable = createTable(eventInfo.eventDays, keysToDisplay)
    scheduleTable.className = 'scheduleTable'
    onlineAppointmentDays.appendChild(scheduleTable)
    eventsDetails.appendChild(cardTitle);
    eventsDetails.appendChild(eventsName);
    eventsDetails.appendChild(eventDuration);
    eventsDetails.appendChild(appointmentDuration);
    eventsDetails.appendChild(onlineAppointmentDays);
}

// Function to create a dynamic table
function createTable(data, keys) {
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
    return table;
}

function toProperCase(str) {
   
    return str.toLowerCase().replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
}

function displaySlots(eventInfo) {
    // Display event Details for selected Slot
    console.log("Display Event:", eventInfo);
    eventsDateControl(eventInfo.eventStartDate, eventInfo.eventEndDate);
    let datePicked = document.getElementById('currentDateSlotPicker');
    datePicked.addEventListener('input', () => {
        let selectedSlotDate = datePicked.value;
        const d = new Date(selectedSlotDate);
        let daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        if (eventInfo.eventDays.some(obj => Object.values(obj).includes(daysOfWeek[d.getDay()]))) {
            const selectedDateDetails = eventInfo.eventDays.find(obj => obj.eventDay === daysOfWeek[d.getDay()]);
            console.log("Slot Details --->", selectedDateDetails);
            slotPreparation(eventInfo.eventId, eventInfo.slotDuration, selectedSlotDate, selectedDateDetails);
        }
        else {
            NoSlotAvailable(selectedSlotDate);
            console.log("No Slot Available");
        }
    })
    // ---> Function to Enable Start and End Date of the Event <---
    eventsDateControl(eventInfo.eventStartDate, eventInfo.eventEndDate);
}

// ---> Function to Enable Start and End Date of the Event <---
function eventsDateControl(eventStartDate, eventEndDate) {
    let enableStartandEndDate = () => {
        let currentDate = new Date();
        let startDate = new Date(eventStartDate)
        console.log(eventStartDate)
        if (startDate < currentDate) {
            eventStartDate = formatForSpecificDate(currentDate);
            datePicked.setAttribute("min", eventStartDate);
            datePicked.setAttribute("max", eventEndDate);
        }
        else {
            datePicked.setAttribute("min", eventStartDate);
            datePicked.setAttribute("max", eventEndDate);
        }
    }

    let datePicked = document.getElementById('currentDateSlotPicker');
    datePicked.addEventListener('input', enableStartandEndDate())
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

// ----->Slot Creation Function <---

function createSlotCard(appointmentsArray, slotCount) {
    // console.log("Hi",appointmentsArray);
    document.querySelector(".specificDaysSlot").innerHTML = `${formatDate(appointmentsArray.slotDate)}'s Slots`;
    document.querySelector(".noOfSlotsAvailable").innerHTML = `<h6><i class="bi bi-calendar-check"></i> Slot Available : <b>${slotCount}</b></h6>`
    const card = document.createElement('div');
    card.classList.add('slotDetailsCard');
    const eachSlotDuration = document.createElement("p");
    eachSlotDuration.innerHTML = `<i class="bi bi-hourglass-split"></i> Slot Duration ${appointmentsArray.slotStartTime} - ${appointmentsArray.slotEndTime}`
    const bookBtn = document.createElement('button');
    bookBtn.textContent = "Book";
    bookBtn.onclick = () => {
        document.getElementById("displaySlotDetails").style.display = 'none';
        document.getElementById("bookSlotForm").style.display = 'block';
        // localStorage.setItem("seletedSlotID", appointmentsArray);
        console.log("Slot Card Creation ---> ", appointmentsArray);

        bookingSlotPanel(appointmentsArray);
    }
    card.appendChild(eachSlotDuration);
    card.appendChild(bookBtn);
    return card;
}



// --->Function to handle not Available slots <----
function NoSlotAvailable(selectDate) {
    document.querySelector(".specificDaysSlot").innerHTML = '';
    document.querySelector(".noOfSlotsAvailable").innerHTML = '';
    slotcontainer.innerHTML = `<h2> <i class="bi bi-calendar-x"></i> No Slots Available on  ${formatDate(selectDate)}</h2>`
}


// ----> Function to Trigger slot Creation based on available slots <-----
function slotPreparation(eventId, slotsDuration, slotDate, slotDateDetails) {
    slotcontainer.innerHTML = '';
    let currentTime = new Date().getTime();
    console.log("Current time: " + currentTime);
    let slotStartTime = slotDateDetails.eventStartTime;
    let slotEndTime = slotDateDetails.eventEndTime;
    let slotDuration = Number(slotsDuration) * 60000;
    let slotStartTimeInMinutes = mergeDateAndTimeInput(slotDate, slotStartTime);
    let tempSlotEndTime = mergeDateAndTimeInput(slotDate, slotEndTime);
    let intervalExists = slotDateDetails.hasOwnProperty('intervalStartTime') && slotDateDetails.hasOwnProperty('intervalEndTime');
    let intervalStartTime, intervalEndTime, slotEndTimeInEpoch = 0;
    let slotsAvailable = [];
    // splitSlotforAppointment()
    while (slotStartTimeInMinutes <= tempSlotEndTime && slotEndTimeInEpoch < tempSlotEndTime) {
        slotEndTimeInEpoch = slotStartTimeInMinutes + slotDuration;
        if (intervalExists) {
            intervalStartTime = mergeDateAndTimeInput(slotDate, slotDateDetails.intervalStartTime);
            intervalEndTime = mergeDateAndTimeInput(slotDate, slotDateDetails.intervalEndTime);
            if (intervalStartTime >= slotStartTimeInMinutes && intervalStartTime < slotEndTimeInEpoch) {
                if (intervalEndTime > slotStartTimeInMinutes && intervalEndTime <= slotEndTimeInEpoch) {
                    slotStartTimeInMinutes = intervalEndTime
                    slotEndTimeInEpoch = slotStartTimeInMinutes + slotDuration;
                }
                else if (intervalEndTime >= slotStartTimeInMinutes && intervalEndTime > slotEndTimeInEpoch) {
                    slotStartTimeInMinutes = intervalEndTime
                    slotEndTimeInEpoch = slotStartTimeInMinutes + slotDuration;
                    continue;
                }
            }
        }

        // setSlotData(slotStartTimeInMinutes,slotEndTimeInEpoch,tempSlotEndTime);
            if (slotEndTimeInEpoch <= tempSlotEndTime) {
                if(slotStartTimeInMinutes > currentTime){
                const slotDetails = {
                    eventId: eventId
                    , slotDate: slotDate
                    , slotStartTime: convertEpochtoLocal(slotStartTimeInMinutes)
                    , slotEndTime: convertEpochtoLocal(slotEndTimeInEpoch)
                };
                
                if (removeBookedAppointment(slotDetails)) {
                    
                    slotsAvailable.push(removeBookedAppointment(slotDetails));
                }
                console.log("Slot Available Array after push", slotsAvailable);
            }
            }
        
      
        // Increment slot start time for the next iteration
        slotStartTimeInMinutes += slotDuration;
    }
    console.log("Slot Availabe:", slotsAvailable)
    displaySlotsCard(slotsAvailable);

}

function setSlotData(slotStartTimeInMinutes,slotEndTimeInEpoch,tempSlotEndTime){
    let currentTime = new Date().getTime();
    let slotsAvailable = [];
    if(slotStartTimeInMinutes > currentTime){
        if (slotEndTimeInEpoch <= tempSlotEndTime) {
            const slotDetails = {
                eventId: eventId
                , slotDate: slotDate
                , slotStartTime: convertEpochtoLocal(slotStartTimeInMinutes)
                , slotEndTime: convertEpochtoLocal(slotEndTimeInEpoch)
            };
            if (removeBookedAppointment(slotDetails)) {
                
                slotsAvailable.push(removeBookedAppointment(slotDetails));
            }
            console.log("Slot Available Array after push", slotsAvailable);
        }
    }
    return slotsAvailable;
}


// function removeBookedAppointment(userBookedAppointments, slotsAvailableArray){
//     if(userBookedAppointments.length == slotsAvailableArray.length){
//         slotcontainer.innerHTML = ''
//         slotcontainer.innerHtml = 'All Slots are booked'
//     } 

//     slotsAvailableArray.forEach(appointment =>{
//         if(userBookedAppointments.length > 0){
//             let filterSlot = userBookedAppointments
//                         .filter(eventInfo => eventInfo.eventId === appointment.appointmentId)
//                         .filter(appointmentDate => appointmentDate.slotDate === appointment.slotDate)
//                         .filter(slotTime => slotTime.slotStartTime === appointment.slotStartTime
//                             &&
//                             slotTime.slotEndTime === appointment.slotEndTime
//                         );
//                 console.log(filterSlot);
//                     }
//                     else{
//                         console.log(appointment ,"SLot Avail in else");
//                     }
//     })

//     let temp = slotsAvailableArray.map(eventInfo =>({
//         eventIdobj : eventInfo
//         ,userbooked : userBookedAppointments.find(eventIdInfo => eventIdInfo['eventId'] === eventInfo['eventId'])
//     }))

//     console.log(temp,"Temp")

// }


function removeBookedAppointment(slotDetails) {
    console.log("User Booking", userBookedAppointments);
    if (userBookedAppointments.length > 0) {
        let filterSlot = userBookedAppointments
            .filter(eventInfo => eventInfo.eventId === slotDetails.eventId)
            .filter(appointmentDate => appointmentDate.slotDate === slotDetails.slotDate)
            .filter(slotTime => slotTime.slotStartTime === slotDetails.slotStartTime
                &&
                slotTime.slotEndTime === slotDetails.slotEndTime
            );

        if (filterSlot.length === 0) {
            return slotDetails;
        }

        console.log("filterSlot", filterSlot);
    }
    else {
        console.log(slotDetails, "SLot Avail in else");

        return slotDetails;
    }
}


function displaySlotsCard(slotsDetails) {
    if (slotsDetails.length === 0) {
        slotcontainer.innerHTML = '';
        slotcontainer.innerHTML = `<h3>Sorry,All appointments are booked for this day</h3>`;
    }

    else {
        let slotCount = slotsDetails.length;
        slotsDetails.forEach(appointment => {
            const appoitmentsSlotDetailsCard = createSlotCard(appointment, slotCount);
            slotcontainer.appendChild(appoitmentsSlotDetailsCard);
        })
    }


}

// -----> Funtion to merge the date and time and return the epoch time
function mergeDateAndTimeInput(dateInput, timeInput) {
    const date = new Date(dateInput)
    const [hours, mins] = timeInput.split(':');
    const dateTime = date.setHours(parseInt(hours, 10), parseInt(mins, 10), 0, 0);
    return dateTime;
}

// --> Function to convert epoch to local for display purposes <---
function convertEpochtoLocal(epochTime) {
    let date = new Date(epochTime);
    let hours = date.getHours().toString().padStart(2, '0');
    let mins = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${mins}`
}

// ---> Function to converts milliseconds to minutes <---
function convertEpochtoDuration(milliseconds) {
    let durationInMinutes = milliseconds / (1000 * 60);
    return durationInMinutes;
}


// ---> Function to format time from total minutes <---
function formatTimeFromMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}



// -----> Converting hours to minutes and getting total minutes <----
function totalTimeInMinutes(time) {
    let [hours, mins] = time.split(":");
    let selectedTime;
    let noOfHours = Number(hours);
    let noOfMins = Number(mins)
    if (noOfHours > 0) {
        noOfHours = Number(noOfHours) * 60;
    }
    selectedTime = noOfHours + noOfMins;
    return selectedTime;
}


// ----> Function to Remove the booked Slot <-----



// ----> Function to generate a Random Number <-----

function generateRandomId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomId += characters.charAt(randomIndex);
    }

    return randomId;
}


/* 
        ----> Event Booking Form <----
*/

// --->Button to cancel booking <---

let cancelBookingBtn = document.querySelector('.cancelBooking');
cancelBookingBtn.addEventListener('click', () => {
    console.log('cancelling booking');
    document.getElementById('displaySlotDetails').style.display = 'flex';
    document.getElementById('bookSlotForm').style.display = 'none';
})

let slotBookingForm = document.getElementById('slotBookingForm');
let slotBookingBtn = document.getElementById('slotBookingBtn');


let bookingSlotPanel = (selectedSlot) => {
    let formUsername = document.getElementById('username');
    let formemail = document.getElementById('useremail');
    formUsername.value = currentUserDetails.username
    formemail.value = currentUserDetails.useremail
    displaySelectedDetails(selectedSlot)
    slotBookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let inputValid = validateInputs()
        if (inputValid) {
            console.log("Coming to call thhe store to local", inputValid)
            saveslotToLocalStorage(selectedSlot);
        }
        else {
            showToast("Enter Valid Details","error");
        }

        window.location.href = "../../html/attendee/userbookedDashboard.html"

    })

}

let displaySelectedDetails = (selectedSlot) => {
    let daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    let card = document.querySelector('.selectedSlotDetails');
    card.innerHTML = '';
    let cardTitle = document.createElement('h2');
    card.innerHTML = '<h2>Your Appointment Details</h2>';
    let eventName = document.createElement('p');
    eventName.innerHTML = `<i class="bi bi-easel-fill"></i> Event &nbsp &nbsp: ${fetchValueByKey('id', selectedSlot.eventId, 'eventName')}`;
    let slotDate = document.createElement('p');
    slotDate.innerHTML = `<i class="bi bi-calendar-check"></i> Date &nbsp &nbsp &nbsp: ${formatDate(selectedSlot.slotDate)}`;
    let slotTime = document.createElement('p');
    slotTime.innerHTML = `<i class="bi bi-clock"></i> Time &nbsp &nbsp &nbsp: ${selectedSlot.slotStartTime} - ${selectedSlot.slotEndTime}`;
    let appointmentDuration = document.createElement('p');
    let eventDuration = fetchValueByKey('id', selectedSlot.eventId, 'slotDuration')
    appointmentDuration.innerHTML = `<i class="bi bi-hourglass-split"></i> Duration : ${setSessionDuration(eventDuration)} `;
    card.appendChild(eventName);
    card.appendChild(cardTitle);
    card.appendChild(slotDate);
    card.appendChild(slotTime);
    card.appendChild(appointmentDuration);
}

function fetchValueByKey(key, value, keyValueToFetch) {
    const foundObj = eventsList.find(obj => obj[key] === value)
    if (foundObj) {
        return foundObj[keyValueToFetch];
    }
    return null;
}


let getFormData = (selectedSlot) => {
    // console.log('Comming to get form data')
    console.log(selectedSlot);
    let bookedAppointment = {
        eventId: selectedSlot.eventId
        , userId: currentUserId
        , slotDate: selectedSlot.slotDate
        , slotStartTime: selectedSlot.slotStartTime
        , slotEndTime: selectedSlot.slotEndTime
    }
    return bookedAppointment
};

let saveslotToLocalStorage = (selectedSlot) => {
    console.log('sasving')
    if (getFormData(selectedSlot)) {
        console.log("coming inside the if of save ");
        let bookedAppointments = JSON.parse(localStorage.getItem('bookedAppointments')) || [];
        if (!Array.isArray(bookedAppointments)) {
            bookedAppointments = [];
        }
        let newAppointment = getFormData(selectedSlot);
        bookedAppointments.push(newAppointment)
        localStorage.setItem('bookedAppointments', JSON.stringify(bookedAppointments));
        console.log('booked Appointment', bookedAppointments)

    }
};

let validateInputs = () => {
    let userName = document.getElementById('username').value
    console.log("UserName", userName);
    let userEmail = document.getElementById('useremail').value
    console.log("UserEmail", userEmail);
    if (userName && userEmail) {
        showToast("Appointment Booked Successfully","success");

        return true;

    }
    else {

        showToast("Something went wrong","error");
        slotBookingForm.reset = true;
        return false;
    }
}



function showToast(toastMessage,type) {
    let toastContainer = document.getElementById("toast-container");
    toastContainer.style.display = "block";
    
    if(type == "error"){
        toastContainer.style.backgroundColor = "red";
        toastContainer.innerHTML = `<i class="bi bi-x-circle"></i> ${toastMessage} `
    }
    else{
        toastContainer.style.backgroundColor = "green";
        toastContainer.innerHTML = `<i class="bi bi-check"></i> ${toastMessage} `
    }
    // To Hide the toast message after 3 seconds
    setTimeout(function () {
        toastContainer.style.display = "none";
    }, 3000);
}

logoutUser.addEventListener('click', () => {
    localStorage.removeItem("currentUser");
    window.location.href = "../../html/main/home.html";
})
// let dayDisplayCard = document.createElement('div');
// dayDisplayCard.className = 'dateCard';
// let slotMonth = document.createElement('p');
// slotMonth.innerHTML = `${new Date(selectedSlot.slotDate).toLocaleString('default', { month: 'short' })}`
// let slotYear = document.createElement('p');
// slotYear.innerHTML = `${new Date(selectedSlot.slotDate).getUTCFullYear()}`;
// let slotDate = document.createElement('p');
// slotDate.innerHTML = `${new Date(selectedSlot.slotDate).getDate()}`;
// let slotDay = document.createElement('p');
// slotDay.innerHTML = `${new Date().getDay}`;
// dayDisplayCard.appendChild(slotMonth);
// dayDisplayCard.appendChild(slotYear);
// dayDisplayCard.appendChild(slotDate);