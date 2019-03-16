/*Hide register if user is logged in, show profile and cart instead */
window.onload = function() {
    var userid = sessionStorage.getItem('userid');
    console.log("acquired userid with value: ");
    console.log(userid);
    if (userid != null) {
        document.getElementById("shoppingcart").style.display = "block";
        document.getElementById("profile").style.display = "block";
    } else {
        document.getElementById("register").style.display = "block";
    }
};