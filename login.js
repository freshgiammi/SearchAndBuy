//Initialize JSON into localstorage
if(localStorage.getItem("users")==null){
      localStorage.setItem("users", JSON.stringify(users));
    } 
//Create a userlist with all users
var userlist = JSON.parse(localStorage.getItem("users"));
console.log(userlist);

function Login(){
  			var email = document.getElementById("email").value;
  			var password = document.getElementById("password").value;
        
        //Look for user data 
        for(var i=0;i<userlist[0].Clienti.length;i++){
            if (userlist[0].Clienti[i].email == email &&userlist[0].Clienti[i].password == password){
                sessionStorage.setItem("userid",i);
                sessionStorage.setItem("usertype","cli");
                document.location.href="index.html";
            return false; //workaround: flush data to redirect user to index.html
            }
        }    
              
        for(var i=0;i<userlist[0].Venditori.length;i++){
            if (userlist[0].Venditori[i].email == email &&userlist[0].Venditori[i].password == password){
                sessionStorage.setItem("userid",i);
                sessionStorage.setItem("usertype","vend");
                document.location.href="index.html";
            return false; //workaround: flush data to redirect user to index.html
  		    }
        }
    window.alert("Email o Password errata");
}