const currentUserId = JSON.parse(localStorage.getItem('currentUser') )|| undefined;
console.log("current user id",currentUserId);
if(!currentUserId){
    let signinBtn = document.getElementById('signinBtn');
console.log("sign in",signinBtn);
let signupBtn = document.getElementById('signupBtn');
console.log("singup btn",signupBtn);
signinBtn.onclick = () =>{
    window.location.href = "../../html/main/signIn.html";
}

signupBtn.onclick = () =>{
    window.location.href = "../../html/main/signup.html";
}

}
else{
    redirectUserIfSignedIn();
}

function redirectUserIfSignedIn(){
    
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    console.log("User Details---->", userDetails[0].userId);
console.log("current user id",currentUserId);

    let currentUserDetails = userDetails.find(userId => userId.userId === currentUserId);
    console.log("Current userDetails ---> ", currentUserDetails);
    if(currentUserDetails.userType === "eventsOwner") {
        window.location.href = "../../html/owner/ownerDashboard.html";
    } else {
        window.location.href = "../../html/user/userbookedDashboard.html";
    }
}



