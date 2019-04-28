// Hide navbar items if user is not logged in
function navbarhider() {
    var userid = sessionStorage.getItem('userid');
    if (userid != null) {
        console.log("Acquired userid with value: " +userid);
        document.getElementById("shoppingcart").style.display = "block";
        document.getElementById("profile").style.display = "block";
    } else {
        document.getElementById("login").style.display = "block";
    }
}

// Dynamically build user profile based on userid stored in sessionStorage
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

// Logout, clears all data
function logout(){
    if (confirm("Sei sicuro di voler uscire?")){
        sessionStorage.clear(); // DO NOT CLEAR LOCALSTORAGE, or you will delete newly registered users
        document.location.href="index.html";
    } else {
        return false;
    }
}

// Delete account from localstorage
function deleteaccount(){
    if (confirm("Sei sicuro di voler eliminare il tuo account?")){
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
}

// Dynamically build item page based on URL
function productinfo(productid){
    var itemlist = JSON.parse(localStorage.getItem("itemlist"));
    var userlist = JSON.parse(localStorage.getItem("users"));
    for(var i=0;i<itemlist.length;i++){
        if (itemlist[i].ID == productid){
            var itemname = itemlist[i].Nome;
            var itemdesc = itemlist[i].Descrizione;
            var itemprice =itemlist[i].Prezzo;
            var itemimg = itemlist[i].Immagine;
            var itemleft = itemlist[i].Quantita;
            var itemshipment = itemlist[i].Spedizione;
            var itemseller = itemlist[i].VendorID;
            document.getElementById("itemname").innerHTML = itemname;
            document.getElementById("itemdesc").innerHTML = itemdesc;
            document.getElementById("itemprice").innerHTML = itemprice;
            document.getElementById("itemimg").src = itemimg;
            document.getElementById("itemleft").innerHTML = "Rimasti in magazzino: " +itemleft;
            document.getElementById("itemshipment").innerHTML = "Metodo di spedizione: " +itemshipment;
            for(var i=0;i<userlist[0].Venditori.length;i++){
                if (userlist[0].Venditori[i].ID == itemseller){
                    var itemseller = userlist[0].Venditori[i].attività;
                    document.getElementById("itemseller").innerHTML= "Venduto da: " +itemseller;
                  }
            }
        }
    }
    console.log("Product info dynamically loaded.");
}

// Load Product info
function productloader(){
    navbarhider();
    // Use URLSearchParams to retrieve the queryID
    const urlParams = new URLSearchParams(window.location.search);
    const itemid = urlParams.get('itemid');
    console.log("Acquired itemid with value: " +itemid)
    productinfo(itemid);
}

// Build userlist and itemlist when index is loaded
function indexloader(){
    navbarhider();
    if(localStorage.getItem("itemlist")==null){
        //If itemlist is already present, don't override it
        localStorage.setItem("itemlist", JSON.stringify(prodotti));
        console.log("itemlist succesfully loaded.");
    }
    if(localStorage.getItem("users")==null){
        //Initialize JSON into localstorage.
        //Check if localstorage already exists, otherwise we may write deleted users on top of it.
        localStorage.setItem("users", JSON.stringify(users));
        console.log("userlist succesfully loaded.");
  } 

}

// Run this on profile.html to avoin onload race conditions. TODO: Find a fix
function profilepage(){
    navbarhider();
    userinfo();
}