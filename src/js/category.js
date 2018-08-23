/**
 * Created by Снежа on 12.08.2018.
 */


//мужская/женская
$("#categories h3 a").on('click', function (e) {
  e.preventDefault()
  var div=$(e.target).parent().next();
  div.addClass("active");
 $("h3 a").toggleClass('active')
  $("div[class*='active'] a[data-type='summer']").addClass('active');
  //$("#categories div[class*='ui-accordion-content-active'] a[data-type='summer']").addClass('active');
  load_items("catalog_item");
})

var default_type;
function load_items(url,which) {
  let active_item=$("#categories div a[class='list-group-item list-group-item-action active']").attr("data-type");
  let key;

  $.ajax({
    url: url+".html",
    async:false,
    success:function (html) {

      $(".content").html(html);
      get_variants(active_item); //выбранная категория
      items_type(default_type); //грузим данные по разделу типа обуви
      new LoadItem(goods)
    },
    error:function(jqXHR,textStatus,errorThrown){
      alert("bad news!"+textStatus+errorThrown)
    }
  });

}
//изменено
function items_type(type_id) {
  let sex=$("#categories h3 a[class*='active']").attr("id");
  let from;
  //alert("type="+type_id)
  $.ajax({
    url: "https://api.mongolab.com/api/1/databases/mydatabase/collections/market/" +
    "5b76a085e7179a69ea6076ea?apiKey=_6BDigQllIiJle4PerntiNKhm2-7vI0I",
    type:"GET",
    async:false,
    success:function (data) {

      $("#goods").html("");
      if(sex=="male"){
        from=data.items.id[type_id].male;
      }
      else{
        from=data.items.id[type_id].female;
      }

  //перебираем все товары по категории и подкатегории
      for(let key in from){
        let div=$("<div>");
        div.addClass("col-12 col-xs-2 col-sm-2 col-md-12 col-lg-4 col-xl-4");
        let child_div=$("<div>");
        child_div.addClass("card");
        let img=$("<img>");
        img.attr("href","#content");
        img.attr("src",from[key].img);
        img.addClass("card-img-top");
        img.attr("id",key);
        let child_div_div=$("<div>");
        child_div_div.addClass("card-body");
        let p=$("<p>");
        p.addClass("card-text");
        p.text(from[key].name)
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

//подкатегории
$("#categories div a").click(function (e) {
  var perv=$("#categories div a[class*='active']")

  e.preventDefault();
  if (perv) {
    $(perv).toggleClass('active')
  }
  $(e.target).toggleClass('active')
  perv = $(e.target);
  let active_item=$("#categories div a[class='list-group-item list-group-item-action active']").attr("data-type");

  get_variants(active_item);

  let type=$("#items li:first-child").attr("data-key");
  default_type=type;
  items_type(type); //грузим данные по разделу типа обуви
  new LoadItem(goods)


});


//подкатегории сезонной категории
function get_variants(type) {

  $.ajax({
    url: "https://api.mongolab.com/api/1/databases/mydatabase/collections/market/" +
    "5b6da785e7179a59c6d7cb9e?apiKey=_6BDigQllIiJle4PerntiNKhm2-7vI0I",
    type: "GET",
    async:false,
    success: function (data) {
      $("#items").html("");
      for (let key in data.types[type]) {
        let li = $("<li>");
        li.addClass("nav-item");
        li.attr("data-key", data.types[type][key].id)
        let a = $("<a>");
        a.addClass("nav-link")
        a.attr("href", "#");
        a.html(data.types[type][key].name)
        li.append(a);
        $("#items").append(li);
      }
      default_type=$("#items").children().eq(0).attr("data-key");
      //$("#category").classList.removeClass("show");
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("bad news!" + textStatus + errorThrown)
    }
  });
  $("#items li").on("click",function (e) {
    alert("click")
    e.preventDefault();
    let key;
    if(e.target.tagName=="LI"){
      key=$(e.target).attr("data-key");
    }
    else {
      key=$(e.target).parent().attr("data-key");
    }
    //alert("key="+key)
    items_type(key);

  });

}
//открытие фильтра
$("input[value='Фильтр']").click(function () {

});
