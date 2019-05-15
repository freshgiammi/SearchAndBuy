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
            var cart = [];
            sessionStorage.setItem("cart", JSON.stringify(cart));
            console.log('Login Successful. Redirecting to homepage...');
            document.location.href="index.html";
        return false; //workaround: flush data to redirect user to index.html
        }
    }    
            
    for(var i=0;i<userlist[0].Venditori.length;i++){
        if (userlist[0].Venditori[i].email == email &&userlist[0].Venditori[i].password == password){
            sessionStorage.setItem("userid",i);
            sessionStorage.setItem("usertype","vend");
            var cart = [];
            sessionStorage.setItem("cart", JSON.stringify(cart));
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
    var itemlist = JSON.parse(localStorage.getItem('itemlist'));
    console.log("Userdata acquired. Dynamically changing page.");
    showHide();

        // LOAD USER INFO
        if (usertype == "cli"){
        //console.log("User is client!");
            document.getElementById("name").innerHTML =  userlist[0].Clienti[userid].nomecognome;
            document.getElementById("usertype").innerHTML = "Cliente";
            document.getElementById("nomecognome").value = userlist[0].Clienti[userid].nomecognome;
            document.getElementById("email").value  = userlist[0].Clienti[userid].email;
            document.getElementById("telefono").value= userlist[0].Clienti[userid].telefono;
            document.getElementById("nascita").value = userlist[0].Clienti[userid].nascita;
            document.getElementById("indirizzo").value = userlist[0].Clienti[userid].indirizzo;
            document.getElementById("pagamento").value = userlist[0].Clienti[userid].pagamento;
            document.getElementById("password").value = userlist[0].Clienti[userid].password;
            // LOAD USER ORDERS
            for (i=0;i<userlist[0].Clienti[userid].acquisti.length;i++){ //TODO: Is a for-each better?
                var itemid = userlist[0].Clienti[userid].acquisti[i].itemid;
                var list = document.getElementById("orderlist");
        
                //Generate review
                var newpara = document.createElement("p");
                var review = newpara.appendChild(document.createTextNode(itemlist[itemid].Nome));
                newpara.appendChild(review);
                list.appendChild(newpara);

                // Generate reviewer
                var newid = document.createElement("p");
                newid.className += "text-muted";
                newid.style.fontSize += "12px";
                newid.appendChild(document.createTextNode("Ordine effettuato in data: " +userlist[0].Clienti[userid].acquisti[i].data));
                list.appendChild(newid);

                //Generate cancel order button
                if (userlist[0].Clienti[userid].acquisti[i].data == dateBuilder()){
                    var button = document.createElement("button");
                    button.className += "btn btn-danger btn-sm";
                    button.appendChild(document.createTextNode("Annulla ordine"));

                    /**  
                    *    Javascript doesn't use block scope. For this reason, the variable i is visible to the function
                    *    at execution time. This means that every time, the function will be called with the last iterated value of i. 
                    *    Work around this by using closure, creating a private variable preserved by each callback value.
                    *    https://stackoverflow.com/questions/6048561/setting-onclick-to-use-current-value-of-variable-in-loop 
                    */
                    var index = i;
                    button.onclick = (function(itemid, index) { //TODO: FIX THIS
                        return function(){
                            cancelOrder(itemid, index);
                        }
                    })(itemid, index);

                    list.appendChild(button);

                }

                //Generate divider
                var newhr = document.createElement("hr");
                list.appendChild(newhr);
                
            }
            // LOAD USER REVIEWS
            for(var i=0;i<userlist[0].Clienti[userid].recensioni.length;i++){
                var itemid = userlist[0].Clienti[userid].recensioni[i].itemid;
                var list = document.getElementById("reviewlist");
        
                //Generate review
                var newpara = document.createElement("p");
                var review = newpara.appendChild(document.createTextNode(userlist[0].Clienti[userid].recensioni[i].review));
                newpara.appendChild(review);
                list.appendChild(newpara);

                // Generate reviewer
                var newid = document.createElement("small");
                newid.className += "text-muted";
                newid.appendChild(document.createTextNode("Hai recensito: "+itemlist[itemid].Nome +" in data " +userlist[0].Clienti[userid].recensioni[i].data));
                list.appendChild(newid);

                //Generate divider
                var newhr = document.createElement("hr");
                list.appendChild(newhr);

            }
        
        } else { 
            //console.log("User is vendor!");
            document.getElementById("name").innerHTML =  userlist[0].Venditori[userid].nomecognome;
            document.getElementById("usertype").innerHTML = "Venditore";
            document.getElementById("nomecognome").value = userlist[0].Venditori[userid].nomecognome;
            document.getElementById("email").value  = userlist[0].Venditori[userid].email;
            document.getElementById("telefono").value= userlist[0].Venditori[userid].telefono;
            document.getElementById("nascita").value = userlist[0].Venditori[userid].nascita;
            document.getElementById("indirizzo").value = userlist[0].Venditori[userid].indirizzo;
            document.getElementById("pagamento").value = userlist[0].Venditori[userid].pagamento;
            document.getElementById("password").value = userlist[0].Venditori[userid].password;
            document.getElementById("partitaiva").value = userlist[0].Venditori[userid].partitaiva;
            document.getElementById("attività").value = userlist[0].Venditori[userid].attività;
            // LOAD USER ORDERS
            for (i=0;i<userlist[0].Venditori[userid].acquisti.length;i++){ //TODO: Is a for-each better?
                var itemid = userlist[0].Venditori[userid].acquisti[i].itemid;
                var list = document.getElementById("orderlist");
        
                //Generate review
                var newpara = document.createElement("p");
                var review = newpara.appendChild(document.createTextNode(itemlist[itemid].Nome));
                newpara.appendChild(review);
                list.appendChild(newpara);

                // Generate reviewer
                var newid = document.createElement("p");
                newid.className += "text-muted";
                newid.style.fontSize += "12px";
                newid.appendChild(document.createTextNode("Ordine effettuato in data: " +userlist[0].Clienti[userid].acquisti[i].data));
                list.appendChild(newid);

                //Generate cancel order button
                if (userlist[0].Venditori[userid].acquisti[i].data == dateBuilder()){
                    var button = document.createElement("button");
                    button.className += "btn btn-danger btn-sm";
                    button.appendChild(document.createTextNode("Annulla ordine"));
                    
                    /**  
                    *    Javascript doesn't use block scope. For this reason, the variable i is visible to the function
                    *    at execution time. This means that every time, the function will be called with the last iterated value of i. 
                    *    Work around this by using closure, creating a private variable preserved by each callback value.
                    *    https://stackoverflow.com/questions/6048561/setting-onclick-to-use-current-value-of-variable-in-loop 
                    */
                    var index = i;
                    button.onclick = (function(itemid, index) { //TODO: FIX THIS
                        return function(){
                            cancelOrder(itemid, index);
                        }
                    })(itemid, index);
                    
                    list.appendChild(button);
                }

                //Generate divider
                var newhr = document.createElement("hr");
                list.appendChild(newhr);
            }
            // LOAD USER REVIEWS
            for(var i=0;i<userlist[0].Venditori[userid].recensioni.length;i++){
                var itemid = userlist[0].Venditori[userid].recensioni[i].itemid;
                var list = document.getElementById("reviewlist");
            
                //Generate review
                var newpara = document.createElement("p");
                var review = newpara.appendChild(document.createTextNode(userlist[0].Venditori[userid].recensioni[i].review));
                newpara.appendChild(review);
                list.appendChild(newpara);

                // Generate reviewer
                var newid = document.createElement("small");
                newid.className += "text-muted";
                newid.appendChild(document.createTextNode("Hai recensito: "+itemlist[itemid].Nome +" in data " +userlist[0].Venditori[userid].recensioni[i].data));
                list.appendChild(newid);

                //Generate divider
                var newhr = document.createElement("hr");
                list.appendChild(newhr);
            }
        }

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
    document.getElementById("itemname").innerHTML = itemlist[productid].Nome;
    document.getElementById("itemdesc").innerHTML = itemlist[productid].Descrizione;
    document.getElementById("itemprice").innerHTML = "€ " +itemlist[productid].Prezzo;
    document.getElementById("itemimg").src = itemlist[productid].Immagine;
    document.getElementById("itemleft").innerHTML = "Rimasti in magazzino: " +itemlist[productid].Quantita;
    document.getElementById("itemshipment").innerHTML = "Metodo di spedizione: " +itemlist[productid].Spedizione;
    var itemseller = itemlist[productid].VendorID;
    for(var i=0;i<userlist[0].Venditori.length;i++){
        if (userlist[0].Venditori[i].ID == itemseller){
            var itemseller = userlist[0].Venditori[i].attività;
            document.getElementById("itemseller").innerHTML= "Venduto da: " +itemseller;
            }
    }

    if (itemlist[productid].Quantita == 0)
    document.getElementById("cartbutton").style.display = "none";
    
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
        newid.appendChild(document.createTextNode("Acquistato da " +reviews[i].itembuyer +" in data: " +reviews[i].itemdate));
        list.insertBefore(newid, list.childNodes[0]);

        //Generate review
        var newpara = document.createElement("p");
        var review = newpara.appendChild(document.createTextNode(reviews[i].itemreview));
        newpara.appendChild(review);
        list.insertBefore(newpara, list.childNodes[0]);

    }
    document.title = "Search&Buy - " +itemlist[productid].Nome;

    console.log("Product info dynamically loaded.");
}

// Load Product info
function productloader(){
    navbarhider();
    productinfo(urlRetriever());
}

// Build userlist and itemlist when index is loaded
function indexloader(){
    navbarhider();
    if(localStorage.getItem("itemlist")==null){
        //If itemlist is already present don't override it, otherwise we may not have the real amount of items left
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

//Change user info based on form provided in profile.html
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
        if (sessionStorage.getItem('userid') == null) // Detect register form via userid
            document.getElementById("register").style.display = "block";
    } else if (usertype == "cli"){
        console.log("User is client. Hiding fields");
        document.getElementsByClassName("vendorinfo")[1].style.display = "none";
        document.getElementsByClassName("vendorinfo")[0].style.display = "none";
        if (sessionStorage.getItem('userid') == null)
            document.getElementById("register").style.display = "block";
    }
}

//Register user into localStorage
function Register(){
    var usertype = document.getElementById("usertype").value;
    if (formValidation(usertype) == true){
        var userlist = JSON.parse(localStorage.getItem("users"));
        if (isRegistered(userlist) == true){
            return console.log("Mail already registered. Try again...");
        }

        if (usertype=="cli"){
            var newuser = ({"ID":(userlist[0].Clienti.length),"nomecognome":document.getElementById("nomecognome").value, "email": document.getElementById("email").value,"password":document.getElementById("password").value,"nascita":document.getElementById("nascita").value,"indirizzo":document.getElementById("indirizzo").value,"tipo":"cli","pagamento":document.getElementById("pagamento").value,"useragreement":document.getElementById("useragreement").value,"acquisti":new Array(),"recensioni":new Array()});
            userlist[0].Clienti.splice(userlist[0].Clienti.length,0, newuser);
            localStorage.setItem("users", JSON.stringify(userlist));
            } else if (usertype == "vend") { 
            var newuser = ({"ID":(userlist[0].Venditori.length),"nomecognome":document.getElementById("nomecognome").value, "email": document.getElementById("email").value,"password":document.getElementById("password").value,"nascita":document.getElementById("nascita").value,"indirizzo":document.getElementById("indirizzo").value,"tipo":"vend","pagamento":document.getElementById("pagamento").value,"useragreement":document.getElementById("useragreement").value,"attività":document.getElementById("attività").value,"partitaiva":document.getElementById("partitaiva").value,"acquisti":new Array(),"recensioni":new Array()}); 
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
        } else if (usertype =="vend") { 
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

//Send a review for a item; allow user to modify review, block reviews from people who have not bought the item
function sendReview(){
    var userlist = JSON.parse(localStorage.getItem("users"));
    var usertype = sessionStorage.getItem('usertype');
    var userid = sessionStorage.getItem('userid');
    var itemid = urlRetriever();
    
    //Check if user is logged in before creating a review
    if (userid == null){
        alert("Devi loggarti prima di poter scrivere una recensione!");
        document.location.href="login.html";

    }

    //Check if user has bought the item
    if (isBought(usertype,itemid) == false){
        return alert("Non hai ancora acquistato questo articolo!");
    }

    //Check that the user has written something
    if (document.getElementById("review").value == null) {
        return alert("Scrivi qualcosa prima di inviare!");
    }

    if (usertype == "cli"){
        if (isReviewed(usertype,itemid) == true){
            //If user has already reviewed the item, let him know
            if (confirm("Hai già lasciato una recensione, vuoi modificarla?")){
                for(var i=0;i<userlist[0].Clienti[userid].recensioni.length;i++){
                    if (userlist[0].Clienti[userid].recensioni[i].itemid == itemid){
                        userlist[0].Clienti[userid].recensioni[i].review = document.getElementById("review").value;
                        userlist[0].Clienti[userid].recensioni[i].data = dateBuilder();
                        localStorage.setItem("users", JSON.stringify(userlist));
                    }
                }
            } else
                return; // Abort review
        } else {
            for(var i=0;i<userlist[0].Clienti[userid].recensioni.length;i++){
                if (userlist[0].Clienti[userid].recensioni[i].itemid == itemid){
                    userlist[0].Clienti[userid].recensioni[i].review = document.getElementById("review").value;
                    userlist[0].Clienti[userid].recensioni[i].data = dateBuilder();
                    localStorage.setItem("users", JSON.stringify(userlist));
                }
            }
        } 
    } else if (usertype == "vend") {
        if (isReviewed(usertype,itemid) == true){
            //If user has already reviewed the item, let him know
            if (confirm("Hai già lasciato una recensione, vuoi modificarla?")){
                for(var i=0;i<userlist[0].Venditori[userid].recensioni.length;i++){
                    if (userlist[0].Venditori[userid].recensioni[i].itemid == itemid){
                        userlist[0].Venditori[userid].recensioni[i].review = document.getElementById("review").value;
                        userlist[0].Venditori[userid].recensioni[i].data = dateBuilder();
                        localStorage.setItem("users", JSON.stringify(userlist));
                    }
                }
            } else
                return; // Abort review
        } else {
            for(var i=0;i<userlist[0].Venditori[userid].recensioni.length;i++){
                if (userlist[0].Venditori[userid].recensioni[i].itemid == itemid){
                    userlist[0].Venditori[userid].recensioni[i].review = document.getElementById("review").value;
                    userlist[0].Venditori[userid].recensioni[i].data = dateBuilder();
                    localStorage.setItem("users", JSON.stringify(userlist));
                }
            }
        }
    }
    // Reload product info to show new review
    location.reload();
}

// Use URLSearchParams to retrieve the queryID
function urlRetriever(){
    const urlParams = new URLSearchParams(window.location.search);
    const itemid = urlParams.get('itemid');
    console.log("Acquired itemid with value: " +itemid)
    return itemid;
}

//Check if user has bought a certain item
function isBought(usertype, itemid){
    var userlist = JSON.parse(localStorage.getItem("users"));
    var userid = sessionStorage.getItem('userid');
    
    if (usertype == "cli"){
        for(var i=0;i<userlist[0].Clienti[userid].acquisti.length;i++){
            if (userlist[0].Clienti[userid].acquisti[i].itemid == itemid){
                return true;
            }
        }
    } else {
        for(var i=0;i<userlist[0].Venditori[userid].acquisti.length;i++){
            if (userlist[0].Venditori[userid].acquisti[i].itemid == itemid){
                return true;
            }
        }
    }
    return false;
}

//Check if user has reviewed a certain item
function isReviewed(usertype, itemid){
    var userlist = JSON.parse(localStorage.getItem("users"));
    var userid = sessionStorage.getItem('userid');

    if (usertype == "cli"){
        for(var i=0;i<userlist[0].Clienti[userid].recensioni.length;i++){
            if (userlist[0].Clienti[userid].recensioni[i].itemid == itemid){
                return true;
            }
        }
    } else {
        for(var i=0;i<userlist[0].Venditori[userid].recensioni.length;i++){
            if (userlist[0].Venditori[userid].recensioni[i].itemid == itemid){
                return true;
            }
        }
    }
    return false;
}

//Check if item is inside cart; if not, inserts it
function addToCart(){
    var productid = urlRetriever();
    var cart = JSON.parse(sessionStorage.getItem("cart"));

    if(sessionStorage.getItem("userid") == null){
        return alert("Devi essere loggato per aggiungere l'articolo al carrello!");
    }

    for (i=0;i<cart.length;i++){
        if (cart[i] == productid){
            console.log("Item already present in cart");
            return alert("Il prodotto è già nel carrello!")
        }
    }

    cart.push(productid);
    sessionStorage.setItem("cart", JSON.stringify(cart));
    alert("Oggetto aggiunto al carrello!");

}

//Create table with cart elements
function cartItems(){
    var itemlist = JSON.parse(localStorage.getItem("itemlist"));
    var cart = JSON.parse(sessionStorage.getItem("cart"));
    if (cart[0] == null){
        document.getElementById("cart").style.display = "none";
        document.getElementById("emptycart").style.display = "block";
        //Display something and tell the user the cart is empty
        return;
    }

    var subtotal = Number(0);

    for (i=0;i<cart.length;i++){
        var itemid = cart[i];
        var list = document.getElementById("items"); //tbody
        var row = document.createElement("tr");

        // Generate itemimg
        var itemimg = document.createElement("td");
        var img = document.createElement("img");
        img.src = itemlist[itemid].Immagine;
        img.style.objectFit = "scale-down";
        img.style.height = "30px";
        img.style.width = "30px";
        itemimg.appendChild(img);
        row.appendChild(itemimg);

        // Generate itemname
        var itemname = document.createElement("td");
        itemname.appendChild(document.createTextNode(itemlist[itemid].Nome));
        row.appendChild(itemname);

        // Generate itemshipment
        var itemshipment = document.createElement("td");
        itemshipment.appendChild(document.createTextNode(itemlist[itemid].Spedizione));
        row.appendChild(itemshipment);

        // Generate itemprice
        var itemprice = document.createElement("td");
        itemprice.className += "text-right";
        itemprice.appendChild(document.createTextNode(itemlist[itemid].Prezzo +" €"));
        row.appendChild(itemprice);

        // Generate itemremove
        var itemremove = document.createElement("td");
        var button = document.createElement("button");
        var trash = document.createElement("i");
        button.className += "btn btn-sm btn-danger";
        itemremove.className += "text-right";
        trash.className += "fa fa-trash";
        button.appendChild(trash);
        itemremove.appendChild(button);
        itemremove.onclick = function() { cartRemover(itemid); };
        row.appendChild(itemremove);

        list.insertBefore(row, list.childNodes[0]);

        subtotal += Number(itemlist[itemid].Prezzo);
    }
    document.getElementById("subtotal").appendChild(document.createTextNode(subtotal +" €"));
    var total = (subtotal + Number(6.90)).toFixed(2);
    document.getElementById("total").appendChild(document.createTextNode(total +" €"));
}

//Load cart to avoid race condition
function cartLoader(){
    cartItems();
    navbarhider();
}

//Remove item from cart
function cartRemover(productid){
    var cart = JSON.parse(sessionStorage.getItem("cart"));

    for (i=0;i<cart.length;i++){
        if (cart[i] == productid){
            cart.splice(i,1);
        }
    }

    console.log(cart);

    sessionStorage.setItem("cart", JSON.stringify(cart));
    alert("Oggetto rimosso dal carrello!")
    location.reload();
}

//Checkout, add items to acquisti and decrement stock by 1
function checkout(){
    var userlist = JSON.parse(localStorage.getItem("users"));
    var usertype = sessionStorage.getItem("usertype"); //IDE: Actually used
    var itemlist = JSON.parse(localStorage.getItem("itemlist"));
    var userid = sessionStorage.getItem("userid");
    var cart = JSON.parse(sessionStorage.getItem("cart"));
    
    for (i=0;i<cart.length;i++){
        var item = ({"itemid":cart[i],"data":dateBuilder()});
        if (usertype = "cli"){
            userlist[0].Clienti[userid].acquisti.splice(0,0,item);
        } else if (usertype = "vend"){
            userlist[0].Venditori[userid].acquisti.splice(0,0,item);
        }
        itemlist[cart[i]].Quantita = Number(itemlist[cart[i]].Quantita)-1; 
    }
    localStorage.setItem("users", JSON.stringify(userlist));
    localStorage.setItem("itemlist", JSON.stringify(itemlist));

    console.log("Checkout done, recreating empty cart");
    sessionStorage.removeItem("cart");
    cart = [];
    sessionStorage.setItem("cart", JSON.stringify(cart));
    
    alert("Checkout completato! Sarai reindirizzato alla home page...");
    document.location.href="index.html";

}

//Generate a date in YYYY-MM-DD format
function dateBuilder(){
    var x = new Date();
    var y = x.getFullYear().toString();
    var m = (x.getMonth() + 1).toString();
    var d = x.getDate().toString();
    (d.length == 1) && (d = '0' + d);
    (m.length == 1) && (m = '0' + m);
    var date = y +"-" +m +"-" +d;
    return date;
}

function cancelOrder(itemid, index){
    var itemlist = JSON.parse(localStorage.getItem("itemlist"));
    var userlist = JSON.parse(localStorage.getItem("users"));

    if (confirm("Sei sicuro di voler annullare questo ordine?")){
        itemlist[itemid].Quantita = Number(itemlist[itemid].Quantita)+1;
        userlist[0].Clienti[userid].acquisti.splice(index,1);
        localStorage.setItem("users", JSON.stringify(userlist));
        localStorage.setItem("itemlist", JSON.stringify(itemlist));
        location.reload();
    }
}

//TODO: Delete before final build
function debug(){
    console.log("here");
}