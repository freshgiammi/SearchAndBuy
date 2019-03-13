 var users = JSON.parse(localStorage.getItem("users"));
    console.log(users);

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
window.alert("registrato");
var selectedValue = document.getElementById("usertype").value;
var utenti = [];
  if (selectedValue=="cli"){
    users[0]["Clienti"].push({"ID":(users[0].Clienti.length+1),"nomecognome":document.getElementById("nomecognome").value, "email": document.getElementById("email").value,"password":document.getElementById("password").value,"nascita":document.getElementById("nascita").value,"indirizzo":document.getElementById("indirizzo").value,"tipo":"cli","pagamento":document.getElementById("indirizzo"),"useragreement":document.getElementById("useragreement"),"acquisti":new Array()});  
   
 }else{
     users[0]["Venditori"].push({"ID":(users[0].Venditori.length+1),"nomecognome":document.getElementById("nomecognome").value, "email": document.getElementById("email").value,"password":document.getElementById("password").value,"nascita":document.getElementById("nascita").value,"indirizzp":document.getElementById("indirizzo").value,"tipo":"vend","pagamento":document.getElementById("useragreement"),"attività":document.getElementById("attivita").value,"partitaiva":document.getElementById("partitaiva")}); 
 }
localStorage["users"]=JSON.stringify(users); //Add user in localstorage
console.log(users); 
document.location.href="login.html";

}
