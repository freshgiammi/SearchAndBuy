/*Hide and show forms for each user type*/
function showHide() { 
    var selectedValue = document.getElementById("usertype").value;
    console.log(selectedValue);
    if (selectedValue == "vend"){
        document.getElementById("vendor").style.display = "block";
        document.getElementById("client").style.display = "none";
    } else if (selectedValue == "cli"){
        document.getElementById("client").style.display = "block";
        document.getElementById("vendor").style.display = "none";
    }
}

function Register(){
    if (formValidation() == true){
        var userlist = JSON.parse(localStorage.getItem("users"));
        var selectedValue = document.getElementById("usertype").value;
        if (isRegistered(userlist,selectedValue) == false){
            return console.log("Mail already registered. Try again...");
        }

        if (selectedValue=="cli"){
            var newuser = ({"ID":(userlist[0].Clienti.length),"nomecognome":document.getElementById("nomecognome").value, "email": document.getElementById("email").value,"password":document.getElementById("password").value,"nascita":document.getElementById("nascita").value,"indirizzo":document.getElementById("indirizzo").value,"tipo":"cli","pagamento":document.getElementById("indirizzo"),"useragreement":document.getElementById("useragreement"),"acquisti":new Array()});
            userlist[0].Clienti.splice(userlist[0].Clienti.length,0, newuser);
            localStorage.setItem("users", JSON.stringify(userlist));
            } else { 
            var newuser = ({"ID":(userlist[0].Venditori.length),"nomecognome":document.getElementById("nomecognome").value, "email": document.getElementById("email").value,"password":document.getElementById("password").value,"nascita":document.getElementById("nascita").value,"indirizzo":document.getElementById("indirizzo").value,"tipo":"vend","pagamento":document.getElementById("useragreement"),"attività":document.getElementById("attivita").value,"partitaiva":document.getElementById("partitaiva")}); 
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
function isRegistered(userlist, selectedValue){
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

function formValidation(){
    if (document.getElementById("nomecognome").value == null || document.getElementById("email").value == null || document.getElementById("password").value == null || document.getElementById("nascita").value == null || document.getElementById("indirizzo").value == null || document.getElementById("indirizzo") == null || document.getElementById("useragreement") == null)
        return false;
}