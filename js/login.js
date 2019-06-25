//Who let the users in?
function login(){
    var userlist = JSON.parse(localStorage.getItem("users"));
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
