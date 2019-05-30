//Load cart to avoid race condition
function cartLoader(){
    cartItems();
    navbarhider();
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
