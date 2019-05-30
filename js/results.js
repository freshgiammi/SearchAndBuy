//Loads results inside results.html
function resultloader(){
    navbarhider();
    generateResult();
}

//Displays results for a given category/search
function generateResult(){
    var itemlist = JSON.parse(localStorage.getItem("itemlist"));

    if (urlRetriever("category") != null){
        var value = urlRetriever("category");
        document.getElementById("result").innerText = "Stai guardando la categoria: " +value.charAt(0).toUpperCase() + value.slice(1);
        for (i=0;i<itemlist.length;i++){
            if (itemlist[i].Categoria.toLowerCase() == value){
                generateItemCard(i);
            }
        }
    } else {
        var value = urlRetriever("search");
        document.getElementById("result").innerText = "Risultati della ricerca per: " +value;
        for (i=0;i<itemlist.length;i++){
            var itemname = itemlist[i].Nome.toLowerCase();
            if (itemname.search(value) != -1){
                generateItemCard(i);
            }
        }
    }

}
