// Run this on profile.html to avoin onload race conditions. TODO: Find a fix
function profilepage(){
    navbarhider();
    userinfo();
}

// Dynamically build user profile based on userid stored in sessionStorage
function userinfo(){
    var usertype = sessionStorage.getItem('usertype');
    var itemlist = JSON.parse(localStorage.getItem('itemlist'));
    console.log("Userdata acquired. Dynamically changing page.");
    showHide();

        // LOAD USER INFO
            document.getElementById("name").innerHTML =  user.nomecognome;
            document.getElementById("usertype").innerHTML = "Cliente";
            document.getElementById("nomecognome").value = user.nomecognome;
            document.getElementById("email").value  = user.email;
            document.getElementById("telefono").value= user.telefono;
            document.getElementById("nascita").value = user.nascita;
            document.getElementById("indirizzo").value = user.indirizzo;
            document.getElementById("pagamento").value = user.pagamento;
            document.getElementById("password").value = user.password;
            if (usertype == "vend"){
                document.getElementById("partitaiva").value = user.partitaiva;
                document.getElementById("attività").value = user.attività;
            }
            // LOAD USER ORDERS
            for (i=0;i<user.acquisti.length;i++){ //TODO: Is a for-each better?
                var itemid = user.acquisti[i].itemid;
                var list = document.getElementById("orderlist");

                //Generate item name
                var itemname = document.createElement("p");
                var anchor = document.createElement("a");
                anchor.href = "itempage.html?itemid=" +itemid;
                anchor.appendChild(document.createTextNode(itemlist[itemid].Nome));
                itemname.appendChild(anchor);
                list.appendChild(itemname);

                // Generate item date 
                var itemdate = document.createElement("p");
                itemdate.className += "text-muted";
                itemdate.style.fontSize += "12px";
                itemdate.appendChild(document.createTextNode("Ordine effettuato in data: " +user.acquisti[i].data));
                list.appendChild(itemdate);

                //Generate cancel order button
                if (dateCheck(user.acquisti[i].data) == true){
                    var button = document.createElement("button");
                    button.className += "btn btn-danger btn-sm";
                    button.appendChild(document.createTextNode("Annulla ordine"));

                    /**
                    *    Javascript doesn't use block scope. For this reason, the variable i is visible to the function
                    *    at execution time. This means that every time, the function will be called with the last iterated value of i. 
                    *    Work around this by using closure, creating a private variable preserved by each callback value.
                    *    https://stackoverflow.com/questions/6048561/setting-onclick-to-use-current-value-of-variable-in-loop 
                    *    ES6 obtains closure by using let instead of var in the for-loop, but ES6 is also not supported by all browsers.
                   */
                    var index = i;
                    button.onclick = (function(itemid, index) { //TODO: Find a better solution for this mess
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
            for(var i=0;i<user.recensioni.length;i++){
                var itemid = user.recensioni[i].itemid;
                var list = document.getElementById("reviewlist");
        
                //Generate review
                var review = document.createElement("p");
                review.appendChild(document.createTextNode(user.recensioni[i].review));
                list.appendChild(review);

                // Generate reviewinfo
                var reviewinfo = document.createElement("small");
                reviewinfo.className += "text-muted";
                var anchorreview = document.createElement("a");
                anchorreview.href = "itempage.html?itemid=" +itemid;
                anchorreview.appendChild(document.createTextNode("Hai recensito: "+itemlist[itemid].Nome +" in data " +user.recensioni[i].data));
                reviewinfo.appendChild(anchorreview)
                list.appendChild(reviewinfo);

                //Generate divider
                var newhr = document.createElement("hr");
                list.appendChild(newhr);
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
        var userlist = JSON.parse(localStorage.getItem("users"));
        
        if (usertype == "cli"){
            for (i = 0; userlist[0].Clienti.length; i++){
                console.log(userlist[0].Clienti[i].ID == userid)
                if (userlist[0].Clienti[i].ID == userid){
                    userlist[0].Clienti.splice(i,1);
                    break;
                }
            }
       } else {
            for (i = 0; userlist[0].Venditori.length; i++){
                if (userlist[0].Venditori[i].ID == userid){
                    userlist[0].Venditori.splice(i,1);
                    break;
                }
            }
        }

        localStorage.setItem("users", JSON.stringify(userlist));
        console.log("User deleted. New Userlist is:")
        console.log("Redirecting to homepage...");
        sessionStorage.clear();
        document.location.href="index.html";   
    }
}

//Change user info based on form provided in profile.html
function changeuserinfo(){
    var userid = sessionStorage.getItem('userid');
    var usertype = sessionStorage.getItem('usertype');
    var userlist = JSON.parse(localStorage.getItem("users"));

    if (formValidation(usertype) == true){
        if (isRegistered(userlist) == true){
            return console.log("Mail already registered. Try again...");
        }
        user.ID == userid
        user.nomecognome = document.getElementById("nomecognome").value;
        user.email = document.getElementById("email").value;
        user.telefono = document.getElementById("telefono").value;
        user.nascita = document.getElementById("nascita").value;
        user.indirizzo = document.getElementById("indirizzo").value;
        user.pagamento = document.getElementById("pagamento").value;
        user.password = document.getElementById("password").value;
        if (usertype == "vend"){
            user.attività = document.getElementById("attività").value;
            user.partitaiva = document.getElementById("partitaiva").value;
            userlist[0].Venditori.splice(userid,1,user);
        } else {
            userlist[0].Clienti.splice(userid,1,user);
        }
    } else {
        return; //Form is invalid, abort function
    }
    localStorage.setItem("users", JSON.stringify(userlist));
    console.log("User data modified.")
    alert("Dati utente modificati con successo!")
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

//Cancel order if it's not older than 1 day
function cancelOrder(itemid, index){
    var itemlist = JSON.parse(localStorage.getItem("itemlist"));
    var userlist = JSON.parse(localStorage.getItem("users"));

    if (confirm("Sei sicuro di voler annullare questo ordine?")){
        itemlist[itemid].Quantita = Number(itemlist[itemid].Quantita)+1;
        if (usertype == "cli"){
            userlist[0].Clienti[userid].acquisti.splice(index,1);
            if (isReviewed(itemid) == true){
                for (i=0;i<userlist[0].Clienti[userid].recensioni.length;i++){
                    if (userlist[0].Clienti[userid].recensioni[i].itemid == itemid && userlist[0].Clienti[userid].recensioni[i].data == dateBuilder())
                    userlist[0].Clienti[userid].recensioni.splice(i,1);
                }
            }
        } else if (usertype == "vend"){
            userlist[0].Venditori[userid].acquisti.splice(index,1);
            if (isReviewed(itemid) == true){
                for (i=0;i<userlist[0].Clienti[userid].recensioni.length;i++){
                    if (userlist[0].Clienti[userid].recensioni[i].itemid == itemid && userlist[0].Clienti[userid].recensioni[i].data == dateBuilder())
                    userlist[0].Venditori[userid].recensioni.splice(i,1);
                }
            }
        }
        localStorage.setItem("users", JSON.stringify(userlist));
        localStorage.setItem("itemlist", JSON.stringify(itemlist));
        location.reload();
    }
}
