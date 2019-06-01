// Generate array of reviews for a certain item, sorted by date
// Load Product info
function productloader(){
    navbarhider();
    productinfo(urlRetriever("itemid"));
}

// Dynamically build item page based on URL
function productinfo(productid){
    var itemlist = JSON.parse(localStorage.getItem("itemlist"));
    var userlist = JSON.parse(localStorage.getItem("users"));

    document.getElementById("itemcat").href = "results.html?category=" +itemlist[productid].Categoria.toLowerCase();
    document.getElementById("itemcat").innerText = itemlist[productid].Categoria;
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

function reviewbuilder(productid){
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

//Send a review for a item; allow user to modify review, block reviews from people who have not bought the item
function sendReview(){
    var userlist = JSON.parse(localStorage.getItem("users"));
    var usertype = sessionStorage.getItem('usertype');
    var userid = sessionStorage.getItem('userid');
    var itemid = urlRetriever("itemid");
    
    //Check if user is logged in before creating a review
    if (userid == null){
        alert("Devi loggarti prima di poter scrivere una recensione!");
        document.location.href="login.html";

    }

    //Check if user has bought the item
    if (isBought(itemid) == false){
        return alert("Non hai ancora acquistato questo articolo!");
    }

    //Check that the user has written something
    if (document.getElementById("review").value == null) {
        return alert("Scrivi qualcosa prima di inviare!");
    }

    if (isReviewed(itemid) == true){
        //If user has already reviewed the item, let him know
        if (confirm("Hai già lasciato una recensione, vuoi modificarla?")){
            for(var i=0;i<user[userid].recensioni.length;i++){
                if (user[userid].recensioni[i].itemid == itemid){
                    var review = ({"itemid":(itemid),"review":(document.getElementById("review").value),"data":(dateBuilder())});
                    if (usertype == "cli"){
                        userlist[0].Clienti[userid].recensioni[i] = review;
                    } else if (usertype == "vend"){
                        userlist[0].Venditori[userid].recensioni[i] = review;
                    }
                    localStorage.setItem("users", JSON.stringify(userlist));
                }
            }
        } else
            return; // Abort review
    } else {
             var review = ({"itemid":(itemid),"review":(document.getElementById("review").value),"data":(dateBuilder())});
            user[userid].recensioni.push(review);
            if (usertype == "cli"){
                userlist[0].Clienti[userid].recensioni.push(review)
            } else if (usertype == "vend"){
                userlist[0].Venditori[userid].recensioni.push(review);
            }
            localStorage.setItem("users", JSON.stringify(userlist));
    } 
    // Reload product info to show new review
    location.reload();
}

//Check if item is inside cart; if not, inserts it
function addToCart(){
    var productid = urlRetriever("itemid");
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

