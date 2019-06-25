//Register user into localStorage
function register(){
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
