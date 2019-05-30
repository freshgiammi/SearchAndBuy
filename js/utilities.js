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
  
   //TODO: Rewrite in JavaScript
    /* Enable transparent navbar on scroll */
    $(window).scroll(function() {
        if ($(window).scrollTop() >= 1) {
            $(".navbar").css('background', '#f8f9fa'); //bg-light
            $(".navbar").addClass("navbar-light");
            $(".navbar").removeClass("navbar-dark");
            $("#searchbutton").addClass("btn-outline-dark");
            $("#searchbutton").removeClass("btn-outline-light");
        } else {
            $(".navbar").css('background', 'transparent');
            $(".navbar").removeClass("navbar-light");
            $(".navbar").addClass("navbar-dark");
            $("#searchbutton").addClass("btn-outline-light");
            $("#searchbutton").removeClass("btn-outline-dark");
        }
    });

    /* Avoid transparency issues on mobile */
    // Array looks like [navbar fixed-top navbar-expand-lg navbar-dark]
    $('button.navbar-toggler').on('click', function() {
        if ($($(".navbar").attr("class").split(' ')[3] == "navbar-dark")){
            $(".navbar").css('background', '#f8f9fa'); //bg-light
            $(".navbar").addClass("navbar-light");
            $(".navbar").removeClass("navbar-dark");
            $("#searchbutton").addClass("btn-outline-dark");
            $("#searchbutton").removeClass("btn-outline-light");
        }
    });

    //Pick 6 random items from the itemlist and show them on the homepage
    var itemlist = JSON.parse(localStorage.getItem("itemlist"));
    var itemarray = [];
    for (var i = 0; i < itemlist.length; i++) {
        itemarray.push(i);
    }
    for(i=0;i<6;i++){
        var itemid=itemarray[Math.floor(Math.random()*itemarray.length)];
        generateItemCard(itemid);
        itemarray.splice((itemarray.indexOf(itemid)),1);
        
    }
}


//Opens up the itempage to a random product
function randomProduct(){
    var itemlist = JSON.parse(localStorage.getItem("itemlist"));
    var itemid =  Math.floor(Math.random() * (itemlist.length-1));
    document.location.href="itempage.html?itemid="+itemid;
}

//Generate a card for a given itemid. Hooks to a (#row) element inside the html.
function generateItemCard(itemid){
    var itemlist = JSON.parse(localStorage.getItem("itemlist"));
    var list = document.getElementById("row");
    
    var col = document.createElement("div")
    col.className += "col-lg-4 col-md-6 mb-4";
    list.appendChild(col);

    var card = document.createElement("div")
    card.className += "card h-100";
    col.appendChild(card);

    var a = document.createElement("a")
    a.href = "itempage.html?itemid=" +itemid;
    var img = document.createElement("img");
    img.className += "card-img-top";
    img.src += itemlist[itemid].Immagine;
    a.appendChild(img);
    card.appendChild(a);

    var cardbody = document.createElement("div");
    cardbody.className += "card-body";
    card.appendChild(cardbody);

    var cardtitle = document.createElement("h4");
    cardtitle.className += "card-title";
    cardbody.appendChild(cardtitle);

    var atitle = document.createElement("a");
    atitle.appendChild(document.createTextNode(itemlist[itemid].Nome));
    atitle.href = "itempage.html?itemid=" +itemid;
    cardtitle.appendChild(atitle);

    var price = document.createElement("h5");
    price.appendChild(document.createTextNode("€ " +itemlist[itemid].Prezzo));
    cardbody.appendChild(price);

    var desc = document.createElement("p");
    var text = itemlist[itemid].Descrizione;
    desc.appendChild(document.createTextNode(text.substring(0,100)));
    desc.appendChild(document.createTextNode("..."));
    cardbody.appendChild(desc);
}

//Searches item with a name similar to a given string. Opens results.html which parses the variable and loads the page.
function search(){
    var str = document.getElementById("searchinput").value.toLowerCase();
    if (str == ""){
        console.log("Empty search string. Doing absolutely nothing!");
        return false;
    }
    
    document.location.href= "results.html?search=" +str;
    return false; //Return false, otherwise the submit form will just reload the page
}

// Use URLSearchParams to retrieve the queryID
function urlRetriever(str){
    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get(str);
    console.log("Acquired variable with value: " +value);
    return value;
}

//Hide and show forms for each user type
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

//TODO: Delete before final build
function debug(){
    console.log("here");
}

//Uncomment this line to remove all logging functionalities
//console.log = function() {}