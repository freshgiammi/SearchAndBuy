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