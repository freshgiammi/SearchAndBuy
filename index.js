/* Hide register if user is logged in, show profile and cart instead */
function navbarhider() {
    var userid = sessionStorage.getItem('userid');
    if (userid != null) {
        console.log("acquired userid with value: ");
        console.log(userid);
        document.getElementById("shoppingcart").style.display = "block";
        document.getElementById("profile").style.display = "block";
    } else {
        document.getElementById("login").style.display = "block";
    }
}

function userinfo(){
    var userid = sessionStorage.getItem('userid');
    var usertype = sessionStorage.getItem('usertype');
    var userlist = JSON.parse(localStorage.getItem("users"));
    console.log("Userdata acquired. Dynamically changing page.");

        if (usertype == "cli"){
            console.log("User is client!");
            for(var i=0;i<userlist[0].Clienti.length;i++){
                if (userlist[0].Clienti[i].ID == userid){
                    var name = userlist[0].Clienti[i].nomecognome;
                    document.getElementById("usertype").innerHTML = "Cliente";
                }
            }
        } else { 
            console.log("User is vendor!");
            for(var i=0;i<userlist[0].Venditori.length;i++){
                if (userlist[0].Venditori[i].ID == userid){
                    var name = userlist[0].Venditori[i].nomecognome;
                    document.getElementById("usertype").innerHTML = "Venditore";
                }
            }
        }

    document.getElementById("name").innerHTML = name;
    console.log("Profile dynamically loaded.");
}

 // Run this on profile.html to avoin onload race conditions. TODO: Find a fix
 function profilepage(){
    navbarhider();
    userinfo();
}

/* Logout, clears all data */
function logout(){
    confirm("Sei sicuro di voler uscire?");
    sessionStorage.clear(); // DO NOT CLEAR LOCALSTORAGE, or you will delete newly registered users
    document.location.href="index.html";
}
function deleteaccount(){
    confirm("Sei sicuro di voler eliminare il tuo account?");
    var userid = sessionStorage.getItem('userid');
    var usertype = sessionStorage.getItem('usertype');
    var userlist = JSON.parse(localStorage.getItem("users"));
    if (usertype == "cli"){
        userlist[0].Clienti.splice(userid,1);
    } else { 
        userlist[0].Venditori.splice(userid,1);
    }
    localStorage.setItem("users", JSON.stringify(userlist));
    console.log("User deleted. New Userlist is:")
    console.log(userlist);
    console.log("Redirecting to homepage...");
    sessionStorage.clear();
    document.location.href="index.html";   
}