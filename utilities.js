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

//Who let the users in? 
function Login(){
    var userlist = JSON.parse(localStorage.getItem("users"));
    console.log(userlist);
    var email = document.getElementById("email").value;
  	var password = document.getElementById("password").value;

    //Look for user data 
    for(var i=0;i<userlist[0].Clienti.length;i++){
        if (userlist[0].Clienti[i].email == email &&userlist[0].Clienti[i].password == password){
            sessionStorage.setItem("userid",i);
            sessionStorage.setItem("usertype","cli");
            console.log('Login Successful. Redirecting to homepage...');
            document.location.href="index.html";
        return false; //workaround: flush data to redirect user to index.html
        }
    }    
            
    for(var i=0;i<userlist[0].Venditori.length;i++){
        if (userlist[0].Venditori[i].email == email &&userlist[0].Venditori[i].password == password){
            sessionStorage.setItem("userid",i);
            sessionStorage.setItem("usertype","vend");
            console.log('Login Successful. Redirecting to homepage...');
            document.location.href="index.html";
        return false; //workaround: flush data to redirect user to index.html
        }
    }
    window.alert("Email o Password errata");
}

// Dynamically build user profile based on userid stored in sessionStorage
function userinfo(){
    var userid = sessionStorage.getItem('userid');
    var usertype = sessionStorage.getItem('usertype');
    var userlist = JSON.parse(localStorage.getItem("users"));
    console.log("Userdata acquired. Dynamically changing page.");
    showHide();

        // LOAD USER INFO
        if (usertype == "cli"){
           //console.log("User is client!");
            for(var i=0;i<userlist[0].Clienti.length;i++){
                if (userlist[0].Clienti[i].ID == userid){
                    var nome = userlist[0].Clienti[i].nomecognome;
                    var email = userlist[0].Clienti[i].email;
                    var telefono = userlist[0].Clienti[i].telefono;
                    var nascita = userlist[0].Clienti[i].nascita;
                    var indirizzo = userlist[0].Clienti[i].indirizzo;
                    var pagamento = userlist[0].Clienti[i].pagamento;
                    var password = userlist[0].Clienti[i].password;
                    document.getElementById("usertype").innerHTML = "Cliente";
                    document.getElementById("nomecognome").value = nome;
                    document.getElementById("email").value = email;
                    document.getElementById("telefono").value = telefono;
                    document.getElementById("nascita").value = nascita; // YYYY-MM-DD format
                    document.getElementById("indirizzo").value = indirizzo;
                    document.getElementById("password").value = password;
                    document.getElementById("pagamento").value = pagamento;
                }
            }
        } else { 
            //console.log("User is vendor!");
            for(var i=0;i<userlist[0].Venditori.length;i++){
                if (userlist[0].Venditori[i].ID == userid){
                    var nome = userlist[0].Venditori[i].nomecognome;
                    var email = userlist[0].Venditori[i].email;
                    var telefono = userlist[0].Venditori[i].telefono;
                    var nascita = userlist[0].Venditori[i].nascita;
                    var indirizzo = userlist[0].Venditori[i].indirizzo;
                    var pagamento = userlist[0].Venditori[i].pagamento;
                    var password = userlist[0].Venditori[i].password;
                    var partitaiva = userlist[0].Venditori[i].partitaiva;
                    var attività = userlist[0].Venditori[i].attività;
                    document.getElementById("usertype").innerHTML = "Venditore";
                    document.getElementById("nomecognome").value = nome;
                    document.getElementById("email").value = email;
                    document.getElementById("telefono").value = telefono;
                    document.getElementById("nascita").value = nascita; // YYYY-MM-DD format
                    document.getElementById("indirizzo").value = indirizzo;
                    document.getElementById("password").value = password;
                    document.getElementById("pagamento").value = pagamento;
                    document.getElementById("partitaiva").value = partitaiva;
                    document.getElementById("attività").value = attività;

                }
            }
        }

        // LOAD USER INFO
    document.getElementById("name").innerHTML = nome;
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
            // Build an array of reviews, sorted by date
            var reviews = reviewbuilder(productid);
            
            for (i=0;i<reviews.length;i++){ //TODO: Is a for-each better?
                var list = document.getElementById("reviews");

                //Generate divider
                var newhr = document.createElement("hr");
                list.insertBefore(newhr, list.childNodes[0]);

                // Generate reviewer
                var newid = document.createElement("small");
                newid.className += "text-muted";
                var itembuyer = newid.appendChild(document.createTextNode("Acquistato da " +reviews[i].itembuyer +" in data: " +reviews[i].itemdate));
                list.insertBefore(newid, list.childNodes[0]);

                //Generate review
                var newpara = document.createElement("p");
                var review = newpara.appendChild(document.createTextNode(reviews[i].itemreview));
                newpara.appendChild(review);
                list.insertBefore(newpara, list.childNodes[0]);

            }
        }
    }
    document.title = "Search&Buy - " +itemname;
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

function changeuserinfo(){
    var userid = sessionStorage.getItem('userid');
    var usertype = sessionStorage.getItem('usertype');
    var userlist = JSON.parse(localStorage.getItem("users"));
    // Create backup array since we're removing it to check for email consistency
    if (usertype == "cli"){
        var userinfo = userlist[0].Clienti[userid];
     } else {
        var userinfo = userlist[0].Venditori[userid];
     } 

    if (formValidation(usertype) == true){
        if (isRegistered(userlist) == true){
            return console.log("Mail already registered. Try again...");
        }
        if (usertype == "cli"){
            userinfo.ID == userid
            userinfo.nomecognome = document.getElementById("nomecognome").value;
            userinfo.email = document.getElementById("email").value;
            userinfo.telefono = document.getElementById("telefono").value;
            userinfo.nascita = document.getElementById("nascita").value;
            userinfo.indirizzo = document.getElementById("indirizzo").value;
            userinfo.pagamento = document.getElementById("pagamento").value;
            userinfo.password = document.getElementById("password").value;
            userlist[0].Clienti.splice(userid,1,userinfo);
        } else {
            userinfo.ID == userid
            userinfo.nome = document.getElementById("nomecognome").value;
            userinfo.email = document.getElementById("email").value;
            userinfo.telefono = document.getElementById("telefono").value;
            userinfo.nascita = document.getElementById("nascita").value;
            userinfo.indirizzo = document.getElementById("indirizzo").value;
            userinfo.pagamento = document.getElementById("pagamento").value;
            userinfo.password = document.getElementById("password").value;
            userinfo.attività = document.getElementById("attività").value;
            userinfo.partitaiva = document.getElementById("partitaiva").value;
            userlist[0].Venditori.splice(userid,1,userinfo);
        }
    } else {
        return; //Form is invalid, abort function
    }

    localStorage.setItem("users", JSON.stringify(userlist));
    console.log("User data modified.")
    alert("Dati utente modificati con successo!")
}

// Generate array of reviews for a certain item, sorted by date
function reviewbuilder(productid){
    var itemlist = JSON.parse(localStorage.getItem("itemlist"));
    var userlist = JSON.parse(localStorage.getItem("users"));
    var reviews = new Array();

    for(var i=0;i<userlist[0].Clienti.length;i++){
        for(var j=0;j<userlist[0].Clienti[i].recensioni.length;j++){
            if (userlist[0].Clienti[i].recensioni[j].itemid == productid){
                var itemreview = userlist[0].Clienti[i].recensioni[j].review;
                var itembuyer = userlist[0].Clienti[i].nomecognome;
                var itemdate = userlist[0].Clienti[i].recensioni[j].data;
                var review = ({"itemreview":itemreview, "itembuyer":itembuyer, "itemdate":itemdate});
                reviews.push(review);
            }
        }
    }

    for(var i=0;i<userlist[0].Venditori.length;i++){
        for(var j=0;j<userlist[0].Venditori[i].recensioni.length;j++){
            if (userlist[0].Venditori[i].recensioni[j].itemid == productid){
                var itemreview = userlist[0].Venditori[i].recensioni[j].review;
                var itembuyer = userlist[0].Venditori[i].nomecognome;
                var itemdate = userlist[0].Venditori[i].recensioni[j].data;
                var review = ({"itemreview":itemreview, "itembuyer":itembuyer, "itemdate":itemdate});
                reviews.push(review);
            }
        }
    }

    //Sort array from earlier to older
    reviews.sort(function compare(a, b) {
        var dateA = new Date(a.itemdate);
        var dateB = new Date(b.itemdate);
        return dateA - dateB;
      });

      return reviews;
}

/*Hide and show forms for each user type*/
function showHide() { 
    //Detection phase: allow forms to be hidden during register phase
    if (sessionStorage.getItem('usertype') == null){
        var usertype = document.getElementById("usertype").value;
    } else {
        var usertype = sessionStorage.getItem('usertype');
    }

    if (usertype == "vend"){
        console.log("User is vendor. Showing fields");
        document.getElementsByClassName("vendorinfo")[1].style.display = "inline-flex";
        document.getElementsByClassName("vendorinfo")[0].style.display = "inline-flex";
    } else if (usertype == "cli"){
        console.log("User is client. Hiding fields");
        document.getElementsByClassName("vendorinfo")[1].style.display = "none";
        document.getElementsByClassName("vendorinfo")[0].style.display = "none";
    }
}

//Register user into localStorage
function Register(){
    var usertype = document.getElementById("usertype").value;
    if (formValidation(usertype) == true){
        var userlist = JSON.parse(localStorage.getItem("users"));
        if (isRegistered(userlist) == false){
            return console.log("Mail already registered. Try again...");
        }

        if (usertype=="cli"){
            var newuser = ({"ID":(userlist[0].Clienti.length),"nomecognome":document.getElementById("nomecognome").value, "email": document.getElementById("email").value,"password":document.getElementById("password").value,"nascita":document.getElementById("nascita").value,"indirizzo":document.getElementById("indirizzo").value,"tipo":"cli","pagamento":document.getElementById("pagamento"),"useragreement":document.getElementById("useragreement"),"acquisti":new Array(),"recensioni":new Array()});
            userlist[0].Clienti.splice(userlist[0].Clienti.length,0, newuser);
            localStorage.setItem("users", JSON.stringify(userlist));
            } else { 
            var newuser = ({"ID":(userlist[0].Venditori.length),"nomecognome":document.getElementById("nomecognome").value, "email": document.getElementById("email").value,"password":document.getElementById("password").value,"nascita":document.getElementById("nascita").value,"indirizzo":document.getElementById("indirizzo").value,"tipo":"vend","pagamento":document.getElementById("pagamento"),"useragreement":document.getElementById("useragreement"),"attività":document.getElementById("attività").value,"partitaiva":document.getElementById("partitaiva"),"acquisti":new Array(),"recensioni":new Array()}); 
            userlist[0].Venditori.splice(users[0].Venditori.length,0, newuser);
            localStorage.setItem("users", JSON.stringify(userlist));
        }
        console.log("User added. New Userlist is:");
        console.log(userlist);
        window.alert("Utente registrato! Stai per essere reindirizzato alla pagina di login.");
        document.location.href="login.html";
    } else {
        return; //Form is invalid, abort function
    }
}

//Check if a Email is already registered
function isRegistered(userlist){

    //Load userid, used only to modify data. Undefined during register.
    // If we're modifying, remove user from list.
    // We add it back in in changeuserinfo(), since userid is only available when the user is logged on.
    var userid = sessionStorage.getItem('userid');
    var usertype = sessionStorage.getItem('usertype');
    if (userid != null){
        if (usertype == "cli"){
            userlist[0].Clienti.splice(userid,1);
        } else { 
            userlist[0].Venditori.splice(userid,1);
        }
        console.log(userlist);
    }
    
    for(var i=0;i<userlist[0].Clienti.length;i++){
        if (userlist[0].Clienti[i].email == document.getElementById("email").value){
            alert("Questa mail è già registrata! Utilizza un'altra mail.");
            return true;
        }
      }
      for(var i=0;i<userlist[0].Venditori.length;i++){
        if (userlist[0].Venditori[i].email == document.getElementById("email").value){
            alert("Questa mail è già registrata! Utilizza un'altra mail.");
            return true;
        }
    }
    return false;
}

//Check that the form is valid before submitting
function formValidation(usertype){
    if(usertype == "cli"){
        if (document.getElementById("nomecognome").value != '' && document.getElementById("email").value != '' && document.getElementById("password").value != '' && document.getElementById("telefono").value != '' && document.getElementById("nascita").value != '' && document.getElementById("indirizzo").value != ''){
            //HACK: For some reason, pagamento is recognized as 'false' but evaluated as 'true'. Create another if to check.
            if(document.getElementById("pagamento").value != ''){
                if(userid == null){
                    if (document.getElementById("useragreement").value != "accept"){
                        alert("Devi accettare i termini di contratto!");
                        return false;
                    }
                }
                return true;
            }
        } 
    } else if (usertype == "vend") {
        if (document.getElementById("nomecognome").value != '' && document.getElementById("email").value != '' && document.getElementById("password").value != '' && document.getElementById("telefono").value != '' && document.getElementById("nascita").value != '' && document.getElementById("indirizzo").value != '' && document.getElementById("partitaiva") != '' && document.getElementById("attività") != ''){
            //HACK: For some reason, pagamento is recognized as 'false' but evaluated as 'true'. Create another if to check.
            if(document.getElementById("pagamento").value != ''){
                if(userid == null){
                    if (document.getElementById("useragreement").value != "accept"){
                        alert("Devi accettare i termini di contratto!");
                        return false;
                    }
                }
                return true;
            }
        } 
    } 
    console.log("Form is not valid!");
    alert("Devi completare tutti i campi!");
    return false;
}

//Show selected item from profilepage navbar
function view(type) {
    if (type == "info"){
        console.log("Show info section..");
        document.getElementById("profile-info").style.display = "block";
        document.getElementById("profile-orders").style.display = "none";
        document.getElementById("profile-reviews").style.display = "none";
        document.getElementById("info").classList.add("active");
        document.getElementById("orders").classList.remove("active");
        document.getElementById("reviews").classList.remove("active");
    } else if (type == "orders"){
        console.log("Show orders section..");
        document.getElementById("profile-info").style.display = "none";
        document.getElementById("profile-orders").style.display = "block";
        document.getElementById("profile-reviews").style.display = "none";
        document.getElementById("info").classList.remove("active");
        document.getElementById("orders").classList.add("active");
        document.getElementById("reviews").classList.remove("active");
    } else if (type == "reviews"){
        console.log("Show reviews section..");
        document.getElementById("profile-info").style.display = "none";
        document.getElementById("profile-orders").style.display = "none";
        document.getElementById("profile-reviews").style.display = "block";
        document.getElementById("info").classList.remove("active");
        document.getElementById("orders").classList.remove("active");
        document.getElementById("reviews").classList.add("active");
    }
}