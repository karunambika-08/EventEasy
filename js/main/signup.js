
const currentUserId = JSON.parse(localStorage.getItem('currentUser'));
console.log("current user id", currentUserId);


if (!currentUserId) {
    let signinBtn = document.getElementById('signinBtn');
    console.log("sign in", signinBtn);
    signinBtn.addEventListener('click', () => {
        window.location.href = '../../html/main/signIn.html';
    });
    let signupForm = document.getElementById('signupForm');
    console.log(signupForm);
    const signupHeader = document.getElementById("signupHeader");
    console.log("sign up ", signupHeader);
    let signupButton = document.getElementById("businessAccount");
    signupButton.addEventListener("click", () => {
        window.location.href = `../../html/main/signup.html?type=eventsOwner`;
    });
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let userDetails = JSON.parse(localStorage.getItem("userDetails")) || [];
        console.log("userDetils", userDetails);
        console.log("Validate userDetails", validateInputs(userDetails));
        if (validateInputs(userDetails)) {
            // Add new user details to the array
            saveToLocalStorage(userDetails);
            window.location.href = "../../html/main/signIn.html";
        }
    })
}
else {
    redirectUserIfSignedIn()
}

function redirectUserIfSignedIn() {

    let userDetails = JSON.parse(localStorage.getItem('userDetails')) || [];
    console.log("User Details---->", userDetails[0].userId);
    console.log("current user id", currentUserId);

    let currentUserDetails = userDetails.find(userId => userId.userId === currentUserId);
    console.log("Current userDetails ---> ", currentUserDetails);
    if (currentUserDetails.userType === "eventsOwner") {
        window.location.href = "../../html/owner/ownerDashboard.html";
    } else {
        window.location.href = "../../html/attendee/userbookedDashboard.html";
    }
}

/**
 * @param {object} userDetails 
 * @returns {boolean} ture if the validation are passed
 */
let validateInputs = (userDetails) => {

    let username = document.getElementById("username");
    let useremail = document.getElementById("useremail");
    let password = document.getElementById("userpassword");
    console.log("User MAil value ------------>", useremail.value);

    let errors = [];
    if (!username.value || username == '') {
        setError(username, "Please enter your username");
        errors.push("error");
    }
    else {
        setSuccess(username);
    }
    if (!useremail.value || useremail == '') {
        setError(useremail, "Please enter your email");
        errors.push("error");
    }
    else {
        setSuccess(useremail);
    }
    if (!password.value || password == '') {
        setError(password, "Please enter your password");
        errors.push("error");

    }
    else {
        setSuccess(password);
        if (password.length < 8 || password.length > 30) {
            setError(password, "Password must be between 8 and 30 characters");
            errors.push("error");
        }
        else {
            setSuccess(password);
        }
    }
    console.log("userDetils", userDetails.find(user => user.useremail === useremail.value));
    console.log("User Exits check", userDetails.some(user => user.useremail === useremail));
    let userExist = userDetails.some(user => user.useremail === useremail.value);
    console.log('userExist', userExist);
    if (userExist) {
        setError(signupHeader, "User already Exists, Try again with different email or login")
        errors.push("error");
    }
    console.log("Errors", errors);
    return errors.length <= 0;
}


// ----> Error Message Reflection Function
function setError(element, message) {
    let inputGroup = element.parentElement;
    console.log(inputGroup);
    let errorElement = inputGroup.querySelector(".error");
    errorElement.style.display = 'inline-block';
    console.log(errorElement);
    errorElement.innerText = message;
}

// ---->  Success Reflection function <------
function setSuccess(element) {
    let inputGroup = element.parentElement;
    let errorElement = inputGroup.querySelector(".error");
    errorElement.innerText = " ";
    errorElement.style.display = 'none';
    element.style.border = '1px solid green'
}


// Function to read URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}


function getUserType() {

    // Read the 'type' parameter from the URL
    let userType = getUrlParameter('type');
    if (userType === 'eventsOwner') {
        // User signed up using the business account link
        userType = 'eventsOwner';
    } else {
        // User signed up using the regular sign up link
        userType = 'attendee';
    }
    console.log("userType", userType);
    return userType;
}


/**
 * Function to save the new user to the local storage 
 * @param {object} userDetails 
 */
async function saveToLocalStorage(userDetails) {
    let username = document.getElementById("username").value;
    let useremail = document.getElementById("useremail").value;
    let password = document.getElementById("userpassword").value;
    let userType = getUserType();
    let userDetailsArray = userDetails;
    let hashedPassword = await hashPassword(password)
    let newUserDetails = {
        userId: generateRandomId(8)
        , username: username
        , useremail: useremail
        , password: hashedPassword
        , userType: userType
    }
    userDetailsArray.push(newUserDetails);
    console.log("After Push", userDetailsArray);
    // Store updated user details array in local storage
    localStorage.setItem("userDetails", JSON.stringify(userDetailsArray));
    //  To the current user id to maintain the session of singed in user
    localStorage.setItem("currentUser", JSON.stringify(newUserDetails.userId));


}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashedPassword;
}

/**
 * Random ID generator function 
 * @param {number} length 
 * @returns {number} the randomly generated number to set as newly created user's userId 
 */

function generateRandomId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomId += characters.charAt(randomIndex);
    }

    return randomId;
}




