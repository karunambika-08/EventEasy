/**
 * 
 * @param {string} key 
 * @returns locally stored data of any type['array of Object','string'....]
 */
function fetchFromStorage(key) {
  let fetchedData = JSON.parse(localStorage.getItem(key));
  return fetchedData;
}


// Click Event listener for redirection to Dashboard
let dashBoardButton = document.getElementById('dashboardButton');
dashBoardButton.addEventListener('click', () => {
  window.location.href = `../../html/owner/ownerDashboard.html`
});


let userDetails = fetchFromStorage('userDetails');
console.log("User Details", userDetails);
let currentUserId = fetchFromStorage('currentUser') || undefined;
console.log(currentUserId);
let userProfileName = document.getElementById('userProfileName');
let currentUserDetails = userDetails.find(userId => userId.userId === currentUserId);
console.log("Cuurent userDetails: ", currentUserDetails);
userProfileName.innerHTML = `${currentUserDetails.username}`


// getting form values
const form = document.querySelector(".createAppointment");
console.log("Form-->", form);

const eventName = document.getElementById("eventName");
const eventMail = document.getElementById("eventMail");
const eventStartDate = document.getElementById("startDate");
const eventEndDate = document.getElementById("endDate");
const slotDuration = document.getElementById("slotDuration");
const checkedDays = document.querySelectorAll('input[type="checkbox"].weekday');
console.log("days", checkedDays);
const breaks = document.querySelectorAll('input[type="checkbox"].break');
console.log("breaks", breaks);
const breakStartTime = document.querySelectorAll(".breakStartTime");
console.log("Break Start Time", breakStartTime);
const breakEndTime = document.querySelectorAll(".breakEndTime");
// Working days
const specificDays = document.querySelector('.day').querySelector('.weekday').checked;
const timeDiv = document.querySelector('.time');
console.log(timeDiv.firstChild);
const startTime = document.querySelectorAll(".startTime");
const endTime = document.querySelectorAll(".endTime");
const submit = document.querySelector(".formBtn");
console.log("Submit", submit)
console.log("Start Time Value validate", startTime);

const breakDiv = document.querySelectorAll(".breakTimeGroup");
console.log("Break Div", breakDiv);

// disabling the past date in input calender
let disablePastDate = () => {
  let date = new Date();
  let presentDate = date.getDate();
  let presentMonth = date.getMonth() + 1;
  let presentYear = date.getUTCFullYear();
  if (presentDate < 10) {
    presentDate = "0" + presentDate;
  }
  if (presentMonth < 10) {
    presentMonth = "0" + presentMonth;
  }
  let minDate = presentYear + "-" + presentMonth + "-" + presentDate;
  eventStartDate.setAttribute("min", minDate);
  eventEndDate.setAttribute("min", minDate);
};
disablePastDate();




for (let i = 0; i < checkedDays.length; i++) {
  checkedDays[i].addEventListener("change", (e) => {
    console.log(e.target.checked);
    console.log(e.target.value);
    if (e.target.checked) {
      console.log("Checked Days",checkedDays[i]);
      startTime[i].required = true;
      endTime[i].required = true;
      startTime[i].style.display = "flex";
      endTime[i].style.display = "flex";
      breakDiv[i].style.display = 'flex';
    } else {
      startTime[i].required = false;
      endTime[i].required = false;
      startTime[i].style.display = "none";
      endTime[i].style.display = "none";
      breakDiv[i].style.display = 'none';
    }
  });
}

let breakEnabled = document.querySelectorAll(".enableBreak")
console.log("BreakEnable", breakEnabled)
for (let i = 0; i < breaks.length; i++) {
  breaks[i].addEventListener("change", (e) => {
    console.log(e.target.checked);
    if (e.target.checked) {
      console.log(breaks[i]);

      breakStartTime[i].style.display = "flex";
      breakEndTime[i].style.display = "flex";
      // breakEnabled[i].style.width = "";
      breakStartTime[i].required = true;
      breakEndTime[i].required = true;
    } else {
      breakStartTime[i].required = false;
      breakEndTime[i].required = false;
      // breakEnabled[i].style.width = "242px";
      breakStartTime[i].style.display = "none";
      breakEndTime[i].style.display = "none";
    }
  });
}

let cancelCreation = document.querySelector('.cancelCreation');
cancelCreation.addEventListener('click', function () {
  const editEventID = fetchFromStorage('editEvent')

  if (editEventID) {
    localStorage.removeItem('editEvent');
  }
})

function modifyFormHeading() {
  const formHeading = document.querySelector('.formHeading');
  formHeading.innerHTML = '<i class="bi bi-pencil-square"></i> Edit Event'
}


function populatedFormData(eventToEdit) {
  eventName.value = eventToEdit.eventName;
  eventMail.value = eventToEdit.eventMail;
  eventStartDate.value = eventToEdit.eventStartDate;
  eventEndDate.value = eventToEdit.eventEndDate;
  slotDuration.value = eventToEdit.slotDuration;
  submit.textContent = 'Update Event'
  for (let i = 0; i < checkedDays.length; i++) {
    if (eventToEdit.eventDays.find(day => day.eventDay === checkedDays[i].value)) {
      let dayWiseSlot = eventToEdit.eventDays.find(day => day.eventDay === checkedDays[i].value)
      startTime[i].value = dayWiseSlot.eventStartTime;
      endTime[i].value = dayWiseSlot.eventEndTime;
      if (dayWiseSlot['intervalEnabled']) {
        breakStartTime[i].value = dayWiseSlot.intervalStartTime;
        breakEndTime[i].value = dayWiseSlot.intervalEndTime;
      }
      else {
        breaks[i].removeAttribute('checked');
        breakStartTime[i].style.display = 'none';
        breakEndTime[i].style.display = 'none';
      }
    }
    else {
      checkedDays[i].removeAttribute('checked');
      breakDiv[i].style.display = 'none';
      startTime[i].style.display = 'none';
      endTime[i].style.display = 'none';
      breaks[i].removeAttribute('checked');
      breakStartTime[i].style.display = "none";
      breakEndTime[i].style.display = "none";
    }
  }
}


function setUpFormSubmission(eventsArray, eventToEdit) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let eventUpdatedData = getUpdatedEventData(eventToEdit);
    updateEventInArray(eventsArray, eventUpdatedData);
    if (validateInputs()) {
      saveEventsToLocalStorage(eventsArray);
      showToast("Event Details Updated Successfully!", "success");
      setTimeout(() => {
        window.location.href = '../../html/owner/ownerDashboard.html';
      }, 2000);
    }
    else {
      setInterval(() => {
        showToast("Enter Valid Details", "error");
      }, 1000);
    }
  });
}



function getUpdatedEventData(eventToEdit) {
  let updatedEvent = eventToEdit;
  console.log("Updated Event Data", eventToEdit, "Updated Event Data", updatedEvent);
  updatedEvent.eventName = eventName.value;
  updatedEvent.eventMail = eventMail.value;
  updatedEvent.eventStartDate = eventStartDate.value;
  updatedEvent.eventEndDate = eventEndDate.value;
  updatedEvent.slotDuration = slotDuration.value;
  for (let i = 0; i < checkedDays.length; i++) {
    if (checkedDays[i].checked) {
      console.log("Da0---------->y",checkedDays[i].value + ", " + updatedEvent.eventDays[i]);
      if (updatedEvent.eventDays.find(day => day.eventDay === checkedDays[i].value)) {
        let dayWiseSlot = updatedEvent.eventDays.find(day => day.eventDay === checkedDays[i].value)
        console.log("Day wise in update", dayWiseSlot);
        console.log('Breaks' + breaks[i].checked);
        dayWiseSlot.eventDay = checkedDays[i].value;
        dayWiseSlot.eventStartTime = startTime[i].value;
        dayWiseSlot.eventEndTime = endTime[i].value;
        dayWiseSlot.intervalEnabled = breaks[i].checked;
        dayWiseSlot.intervalStartTime = breaks[i].checked ? breakStartTime[i].value : "";
        dayWiseSlot.intervalEndTime = breaks[i].checked ? breakEndTime[i].value : "";
        console.log("DayWise Slot After Update ---> ", dayWiseSlot)
      }
      else {
        console.log("Coming for new Condition");
        updatedEvent.eventDays.push({
          eventDay: checkedDays[i].value
          , eventStartTime: startTime[i].value
          , eventEndTime: endTime[i].value
          , intervalEnabled: breaks[i].checked
          , intervalStartTime: breaks[i].checked ? breakStartTime[i].value : ''
          , intervalEndTime: breaks[i].checked ? breakEndTime[i].value : ''
        })
      }
    }else {
      console.log('Coming to remove unchecked days ');
      if (eventToEdit.eventDays.find(day => day.eventDay === checkedDays[i].value)) {
        eventToEdit.eventDays = eventToEdit.eventDays.filter(item => item['eventDay'] !== checkedDays[i].value)
        console.log(eventToEdit.eventDays.filter(item => item['eventDay'] !== checkedDays[i].value))
      }
    }
  }
  console.log("Updated Event", updatedEvent);
  return updatedEvent;

}


function updateEventInArray(eventsArray, updatedEvent) {
  const index = eventsArray.findIndex(event => event.id === updatedEvent.id);
  if (index !== -1) {
    eventsArray[index] = updatedEvent;
  }
}

function saveEventsToLocalStorage(value) {
  console.log("Value--->", value);
  localStorage.setItem('eventsDetails', JSON.stringify(value));
}

function handleInvalidEvent() {
  localStorage.removeItem('editEvent');
  window.location.href = '../../html/owner/ownerDashboard.html';
}

function setUpCreateFormSubmission() {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateInputs()) {

      let eventsArray = fetchFromStorage('eventsDetails') || [];
      if (!Array.isArray(eventsArray)) {
        eventsArray = [];
      }

      const newEvent = createEventObjectFromForm();
      eventsArray.push(newEvent);
      saveEventsToLocalStorage(eventsArray);
      showToast("Appointment Created Successfully", "success");
      setTimeout(() => {
        window.location.href = '../../html/owner/ownerDashboard.html';
      }, 2000);
    } else {
      showToast("Please Enter Valid Details", "error");
    }
  });
}

window.onload = () => {
  const editEventID = localStorage.getItem('editEvent')
  console.log("E---->", editEventID);


  if (editEventID) {
    modifyFormHeading();
    let eventsArray = fetchFromStorage('eventsDetails');
    let eventToEdit = eventsArray.find(events => events.eventId === editEventID);
    console.log("Event To Edit", eventToEdit);
    // Assinging the Stored Values to the Input Function
    if (eventToEdit) {
      populatedFormData(eventToEdit);
      setUpFormSubmission(eventsArray, eventToEdit);
    }
    else {
      handleInvalidEvent();
    }
  }
  else {
    setUpCreateFormSubmission()
    // form.addEventListener("submit", (e) => {
    //   e.preventDefault();
    //   // -----> Validate Input : Boolean<------
    //   validateInputs();
    //   // ----->Local Storage <------
    //   if (validateInputs()) {
    //     if (getFormData()) {
    //       let appointmentsArray = JSON.parse(localStorage.getItem('eventsDetails')) || [];
    //       if (!Array.isArray(appointmentsArray)) {
    //         appointmentsArray = [];
    //       }
    //       let newArray = getFormData();
    //       appointmentsArray.push(newArray);
    //       console.log("Final appointmentsArray :", appointmentsArray)
    //       localStorage.setItem("eventsDetails", JSON.stringify(appointmentsArray));
    //       showToast("Appointment Created Successfully","success")
    //       setTimeout(function () {
    //         window.location.href = '../../html/owner/ownerDashboard.html';
    //       }, 1000)
    //     }
    //   }
    //   else {
    //     showToast("Please Enter Valid Details","error");
    //     console.log("Try again");
    //   }
    // });
  }
  // if(eventToEdit){
  //     // Updating the Values in the field
  //     const updateEventName = eventName.value;
  //     const updateEventMail = eventMail.value;
  //     const updateEventStartDate = eventStartDate.value;
  //     const updateEventEndDate = eventEndDate.value;
  //     const updateSlotDuration = slotDuration.value;
  //     // Updating the Storage
  //       eventToEdit.eventName = updateEventName;
  //       eventToEdit.eventMail = updateEventMail;
  //       eventToEdit.eventStartDate = updateEventStartDate;
  //       eventToEdit.eventEndDate = updateEventEndDate;
  //       eventToEdit.slotDuration = updateSlotDuration;
  //     for(let i = 0; i < checkedDays.length; i++) {
  //       if(checkedDays[i].checked){
  //       if(eventToEdit.eventDays.find(day=>day.day === checkedDays[i].value)){
  //       let dayWiseSlot = eventToEdit.eventDays.find(day=>day.day === checkedDays[i].value)
  //       console.log("Day wise in update",dayWiseSlot);
  //         if(breaks[i].checked){
  //           console.log('Breaks' + breaks[i].checked);
  //           const updateDay = checkedDays[i].value;
  //           dayWiseSlot.day = updateDay;
  //           const updateStartTime=startTime[i].value;
  //           dayWiseSlot.startTime = updateStartTime;
  //           const updateEndTime= endTime[i].value;
  //           dayWiseSlot.endTime = updateEndTime;
  //           const updateBreakEnabled = breaks[i].checked;
  //           dayWiseSlot.breakEnabled = updateBreakEnabled;
  //           const updateBreakStartTime = breakStartTime[i].value;
  //           dayWiseSlot.intervalStartTime = updateBreakStartTime
  //           const updateBreakEndTime = breakEndTime[i].value;
  //           dayWiseSlot.intervalEndTime = updateBreakEndTime;
  //           console.log("DayWise Slot After Update ---> " ,dayWiseSlot)
  //         }
  //         else {
  //           const updateDay = checkedDays[i].value;
  //           dayWiseSlot.day = updateDay;
  //           const updateStartTime=startTime[i].value;
  //           dayWiseSlot.startTime = updateStartTime;
  //           const updateEndTime= endTime[i].value;
  //           dayWiseSlot.endTime = updateEndTime;
  //           const updateBreakEnabled = breaks[i].checked;
  //           dayWiseSlot.intervalEnable = updateBreakEnabled;

  //           console.log("Else DayWise Slot After Update ---> " ,dayWiseSlot)

  //         }
  //       }
  //       else{
  //         if (breaks[i].checked) {
  //           console.log("Coming for new Condition");
  //           eventToEdit.eventDays.push({
  //             day: checkedDays[i].value
  //             , startTime: startTime[i].value
  //             , endTime: endTime[i].value
  //             , intervalenable: true
  //             , intervalStartTime: breakStartTime[i].value
  //             , intervalEndTime: breakEndTime[i].value
  //           })
  //         }
  //         else {
  //           eventToEdit.eventDays.push({
  //             day: checkedDays[i].value
  //             , startTime: startTime[i].value
  //             , endTime: endTime[i].value
  //             ,intervalenable: false
  //           })
  //         }
  //       }
  //       }
  //       else {
  //         console.log('Coming to remove unchecked days ');
  //         if(eventToEdit.eventDays.find(day=>day.day === checkedDays[i].value)){
  //           eventToEdit.eventDays = eventToEdit.eventDays.filter(item => item['day'] !== checkedDays[i].value)
  //           console.log(eventToEdit.eventDays.filter(item => item['day'] !== checkedDays[i].value))
  //         }
  //       }
  //     }
  //     if(validateInputs()){
  //       localStorage.setItem('eventsDetails', JSON.stringify(eventsArray));
  //       localStorage.removeItem('editEvent');
  //        window.location.href = '../../html/owner/ownerDashboard.html';
  //        setInterval(() => {
  //         showToast("Event Details Updated Successfully!", "success");
  //        }, 8000);

  //     }
  //     else{
  //       setInterval(() => {
  //         showToast("Enter Valid Details","error");
  //       }, 1000);
  //     }
  //   }
  //   else {
  //     console.log("Not Found");
  //     localStorage.removeItem('editEvent');
  //     window.location.href = `../../html/owner/ownerDashboard.html`;
  //   }
  // }


}

// -------> Works day  and slot condition <------------------

// // Disabling the uncheaked Date time
// function disabelUncheakedtime(checkbox){

// }

// --------->  Submit Event listeners<---------



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


// ------> Function to get the Available meeting <-----

const validateInputs = () => {

  let errors = [];
  let eventNameValue = eventName?.value;
  let eventMailValue = eventMail?.value;
  let eventStartDateValue = eventStartDate?.value;
  console.log(typeof eventStartDateValue)
  let eventEndDateValue = eventEndDate?.value;
  let format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
  // Event Name Validation
  if (eventNameValue) {
    setSuccess(eventName);

    if (format.test(eventNameValue)) {
      setError(eventName, "Please remove special Characters");
      errors.push(true);
    }
    else {
      setSuccess(eventName);
    }
  } else {
    setError(eventName, "Event Name is required");
    errors.push(true);

  }
  // Event email validation
  if (!eventMailValue) {
    setError(eventMail, "Event Mail Value is required");
    errors.push(true)
  }
  else {
    setSuccess(eventMail);
  }


  // Start Date Validation
  if (eventStartDateValue) {
    setSuccess(eventStartDate);
    if (new Date(eventStartDateValue) <= new Date(eventEndDateValue)) {
      setSuccess(eventStartDate)
    } else {
      setError(eventStartDate, "Please Set Start date prior to End Date");
      errors.push(true);
    }
  }
  else {
    setError(eventStartDate, "Start Date is required");
    errors.push(true);
  }


  // EndDate Validation
  if (eventEndDateValue) {
    setSuccess(eventEndDate)
    if (new Date(eventEndDateValue) >= new Date(eventStartDateValue)) {
      setSuccess(eventEndDate);
    } else {
      setError(eventEndDate, "Please set the end date on or after the start date");
      errors.push(true);
    }
  }
  else {
    setError(eventEndDate, "End Date is required");
    errors.push("End Date Value is required");
  }

  let checked = false;
  let eventDays = document.getElementById("eventAvailableDays");
  checkedDays.forEach(checkbox => {
    if (checkbox.checked) {
      checked = true;
    }
  });
  if (!checked) {
    setError(eventDays, "Please Select atleast one day");
    errors.push(true);
  } else {
    setSuccess(eventDays);
  }

  // for(let i = 0; i < checkedDays.length; i++){
  // checkedDays.forEach(checkbox =>{
  //   if(checkbox.checked){
  //     startTime[i].setAttribute("required", "required");
  //     endTime[i].setAttribute("required", "required");
  //     let inputstartTime = mergeDateAndTimeInput(CURRENTDATE, startTime[i].value);
  //     console.log(startTime);
  //     let inputendTime = mergeDateAndTimeInput(CURRENTDATE, endTime[i].value);
  //     console.log(endTime);
  //     if(inputstartTime >= inputendTime){
  //       setError(startTime[i])
  //       errors.push(true);

  //       if(breaks[i].checked){
  //         breakStartTime[i].setAttribute("required", "required");
  //         breakEndTime[i].setAttribute("required", "required");
  //       }
  //     }
  //   }
  // })
  // }
  if (errors.length > 0) {
    return false;
  }
  else {
    return true;
  }




};


// -----> Funtion to merge the date and time and return the epoch time
function mergeDateAndTimeInput(dateInput, timeInput) {
  const date = new Date(dateInput)
  const [hours, mins] = timeInput.split(':');
  const dateTime = date.setHours(parseInt(hours, 10), parseInt(mins, 10), 0, 0);
  return dateTime;
}


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


// ----> Error Message Reflection Function
function setError(element, message) {
  let inputGroup = element.parentElement;
  let errorElement = inputGroup.querySelector(".error");
  errorElement.innerText = message;
  inputGroup.classList.add("error");
  inputGroup.classList.remove("success");
}


// ---->  Success Reflection function <------
function setSuccess(element) {
  const inputGroup = element.parentElement;
  const errorElement = inputGroup.querySelector(".error");
  errorElement.innerText = " ";
  inputGroup.classList.add("success");
  inputGroup.classList.remove("error");
}

// -----> Function to store available appointments <------

let createEventObjectFromForm = () => {


  let eventAvailableDays = [];
  for (let i = 0; i < checkedDays.length; i++) {
    if (checkedDays[i].checked) {
      let eventDay = checkedDays[i].value;
      let eventStartTime = startTime[i].value;
      let eventEndTime = endTime[i].value;
      let intervalEnabled = breaks[i].checked;
      let intervalStartTime = intervalEnabled ? breakStartTime[i].value : '';
      let intervalEndTime = intervalEnabled ? breakEndTime[i].value : '';

      eventAvailableDays.push({
        eventDay
        , eventStartTime
        , eventEndTime
        , intervalEnabled
        , intervalStartTime
        , intervalEndTime
      })
    }

  }
  //  Object Structure to store the objects properties
  let events = {
    eventId: generateRandomId(8)
    , ownerId: currentUserId
    , eventName: eventName.value
    , eventMail: eventMail.value
    , eventStartDate: eventStartDate.value
    , eventEndDate: eventEndDate.value
    , slotDuration: slotDuration.value
    , eventDays: eventAvailableDays
  }
  return events;

}

// -----> Function  to Generate Random ID <------
function generateRandomId(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomId = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters.charAt(randomIndex);
  }
  return randomId;
}



