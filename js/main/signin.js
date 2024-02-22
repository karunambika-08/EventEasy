const currentUserId = JSON.parse(localStorage.getItem('currentUser') );
console.log("current user id",currentUserId);
if(!currentUserId){
    let signinBtn = document.getElementById('signinBtn');
console.log("sign in",signinBtn);

let signupBtn = document.getElementById('signupBtn');
console.log("singup btn",signupBtn);

signinBtn.addEventListener('click',() =>{
    window.location.href = '../../html/main/signup.html';
})

let signinForm = document.getElementById('signinForm');
console.log("Sign in form",signinForm)

signinForm.addEventListener('submit',(e)=>{
        e.preventDefault();
        
        if(validateInputs()){
            loginUser();
        }
}  )
}
else{
    redirectUserIfSignedIn()
}

// Function to login a user
async function loginUser() {
    console.log('Login successful');
    let signInHeader = document.getElementById('signinHeader');
    let email = document.getElementById("useremail").value;
    let password = document.getElementById("userpassword").value;
    // Retrieve user details from local storage
    let userDetails = JSON.parse(localStorage.getItem("userDetails")) || [];
    console.log("User Details",userDetails);
    // Find the user with the matching email and password
    const hashedPassword = await hashPassword(password);
    
    let user = userDetails.find(user => user.useremail === email && user.password === hashedPassword);
    console.log(user,"user");
    if (user) {
        console.log("Comming",user.userId);
        // Storing the current user ID of the session
        localStorage.setItem("currentUser", JSON.stringify(user.userId));
        // Show dashboard based on user type
        if (user.userType === "eventsOwner") {
            showToast("Signed in Successfully","success");
            window.location.href = "../../html/owner/ownerDashboard.html";
        } else {
            showToast("Signed in Successfully","success");
            window.location.href = "../../html/attendee/userbookedDashboard.html";
        }
    } else {
        setError(signInHeader,"Invalid Email or Password")
    }
}


async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashedPassword;
}

let validateInputs=() =>{

    console.log("Comming");
    let errors = [];
    let email = document.getElementById("useremail");
    let password = document.getElementById("userpassword");
        if(email.value == '' || !email.value ){
            setError(email, "Please enter your email")
            errors.push(true)
            if(!email.value.includes('@')){
                setError(email, "Please enter a valid email");
            }
            errors.push(true)
        }
        else{
            setSuccess(email)
        }

        if(password.value =='' || !password.value){
            setError(password, "Please enter your password")
        }
        else{
            setSuccess(password);
        }

        return ! errors.length>0;
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
    setInterval(function () {
        toastContainer.style.display = "none";
    }, 8000);
}




    function setError(element, message) {
        let inputGroup = element.parentElement;
        console.log(inputGroup);
        let errorElement = inputGroup.querySelector(".error");
        errorElement.style.display = 'inline-block';
        console.log(errorElement);
        errorElement.innerText = message;
      }

      function setSuccess(element) {
        let inputGroup = element.parentElement;
        let errorElement = inputGroup.querySelector(".error");
        errorElement.innerText = " ";
        errorElement.style.display = 'none';
        element.style.border = '1px solid green'
        
      }
      
function redirectUserIfSignedIn(){
    
    let userDetails = JSON.parse(localStorage.getItem('userDetails')) || [];
    console.log("User Details---->", userDetails[0].userId);
console.log("current user id",currentUserId);

    let currentUserDetails = userDetails.find(userId => userId.userId === currentUserId);
    console.log("Current userDetails ---> ", currentUserDetails);
    if(currentUserDetails.userType === "eventsOwner") {
        window.location.href = "../../html/owner/ownerDashboard.html";
    } else {
        window.location.href = "../../html/attendee/userbookedDashboard.html";
    }
}


// Functio to Hash the password 

function sha256(input) {
    // Simple hashing algorithm for demonstration purposes only
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = (hash << 5) - hash + input.charCodeAt(i);
        hash |= 0; // Convert to 32-bit integer
    }
    return hash.toString(16); // Convert to hexadecimal string
}


