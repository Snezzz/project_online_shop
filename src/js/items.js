/**
 * Created by Снежа on 12.08.2018.
 */

//load_items("","cf83cfe9-340d-4821-b51b-12453cd28c47")
/*function load_items(category,id){
  $.ajax({
    url: "https://api.mongolab.com/api/1/databases/mydatabase/collections/market/" +
    "5b7146e6fb6fc00430196bd1?apiKey=_6BDigQllIiJle4PerntiNKhm2-7vI0I",
    type:"GET",
    success:function (data) {
      $("#goods").html("");
      for(let key in data.items.id[id]){
        let div=$("<div>");
        div.addClass("col-12 col-xs-2 col-sm-2 col-md-12 col-lg-4 col-xl-4");
        let child_div=$("<div>");
        child_div.addClass("card");
        let img=$("<img>");
        img.attr("src",data.items.id[id][key].img);
        img.addClass("card-img-top");
        let child_div_div=$("<div>");
        child_div_div.addClass("card-body");
        let p=$("<p>");
        p.addClass("card-text");
        p.text(data.items.id[id][key].name)
        child_div_div.append(p);
        child_div.append(img);
        child_div.append(child_div_div);
        div.append(child_div);
        $("#goods").append(div);
      }
    },
    error:function(jqXHR,textStatus,errorThrown){
      alert("bad news!"+textStatus+errorThrown)
    }
  });
}
*/
/*
$(window).scroll(function () {
  $("#categories").css({"position":"fixed","top":"40%"})
})
*/

