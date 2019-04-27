//Initialize JSON into localstorage.
//Check if localstorage already exists, otherwise we may write deleted users on top of it.
if(localStorage.getItem("users")==null){
    localStorage.setItem("users", JSON.stringify(users));
} 

/*Hide and show forms for each user type*/
function showHide() { 
    var usertype = document.getElementById("usertype").value;
    console.log(usertype);
    if (usertype == "vend"){
        document.getElementById("vendor").style.display = "block";
        document.getElementById("client").style.display = "none";
    } else if (usertype == "cli"){
        document.getElementById("client").style.display = "block";
        document.getElementById("vendor").style.display = "none";
    }
}

function Register(){
    var usertype = document.getElementById("usertype").value;
    if (formValidation(usertype) == true){
        var userlist = JSON.parse(localStorage.getItem("users"));
        if (isRegistered(userlist) == false){
            return console.log("Mail already registered. Try again...");
        }

        if (usertype=="cli"){
            var newuser = ({"ID":(userlist[0].Clienti.length),"nomecognome":document.getElementById("nomecognome").value, "email": document.getElementById("email").value,"password":document.getElementById("password").value,"nascita":document.getElementById("nascita").value,"indirizzo":document.getElementById("indirizzo").value,"tipo":"cli","pagamento":document.getElementById("pagamento"),"useragreement":document.getElementById("useragreement"),"acquisti":new Array()});
            userlist[0].Clienti.splice(userlist[0].Clienti.length,0, newuser);
            localStorage.setItem("users", JSON.stringify(userlist));
            } else { 
            var newuser = ({"ID":(userlist[0].Venditori.length),"nomecognome":document.getElementById("nomecognome").value, "email": document.getElementById("email").value,"password":document.getElementById("password").value,"nascita":document.getElementById("nascita").value,"indirizzo":document.getElementById("indirizzo").value,"tipo":"vend","pagamento":document.getElementById("pagamento"),"useragreement":document.getElementById("useragreement"),"attività":document.getElementById("attivita").value,"partitaiva":document.getElementById("partitaiva")}); 
            userlist[0].Venditori.splice(users[0].Venditori.length,0, newuser);
            localStorage.setItem("users", JSON.stringify(userlist));
        }
        console.log("User added. New Userlist is:");
        console.log(userlist);
        window.alert("Utente registrato! Stai per essere reindirizzato alla pagina di login.");
        document.location.href="login.html";
    } else {
        alert("Devi completare tutti i campi per registrarti!");
        return console.log("Missing fields in form. Try again...");
    }
}
function isRegistered(userlist){
    for(var i=0;i<userlist[0].Clienti.length;i++){
        if (userlist[0].Clienti[i].email == document.getElementById("email").value){
            alert("Questa mail è già registrata! Utilizza un'altra mail.");
            return false;
         }
      }
      for(var i=0;i<userlist[0].Venditori.length;i++){
        if (userlist[0].Venditori[i].email == document.getElementById("email").value){
            alert("Questa mail è già registrata! Utilizza un'altra mail.");
            return false;
        }
    }

}

function formValidation(usertype){
    if(usertype == "cli"){
        if (document.getElementById("nomecognome").value != '' && document.getElementById("email").value != '' && document.getElementById("password").value != '' && document.getElementById("telefono").value != '' && document.getElementById("nascita").value != '' && document.getElementById("indirizzo").value != '' && document.getElementById("useragreement").value != ''){
            //HACK: For some reason, pagamento is recognized as 'false' but evaluated as 'true'. Create another if to check.
            if(document.getElementById("pagamento").value != ''){
                console.log(document.getElementById("pagamento").value);
                return true;
            }
        } 
    } else if (usertype == "vend") {
        if (document.getElementById("nomecognome").value != '' && document.getElementById("email").value != '' && document.getElementById("password").value != '' && document.getElementById("telefono").value != '' && document.getElementById("nascita").value != '' && document.getElementById("indirizzo").value != '' && document.getElementById("partitaiva") != '' && document.getElementById("attività") != '' && document.getElementById("useragreement").value != ''){
            //HACK: For some reason, pagamento is recognized as 'false' but evaluated as 'true'. Create another if to check.
            if(document.getElementById("pagamento").value != ''){
                console.log(document.getElementById("pagamento").value);
                return true;
            }
        } 
    } 
    console.log("Form is not valid!");
    return false;
}