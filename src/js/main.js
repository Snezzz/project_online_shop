//загружаем контент
 get_content();

//позиционирование панели помощи
var left=false;
$(window).on("scroll",function(){
  //pageYOffset = насколько прокручена страница(верх) и прибавляем длину окна для определения нижней части видимой области
  var position=window.pageYOffset+window.innerHeight;
  if($("footer").offset().top<=position){

    $(".for_chat").css({"bottom":"200px"})
    $("#chat").css({"bottom":"", "top":"-370px","left":"-38%","transform":"rotate(-90deg)"}).html("Связь с оператором &#9660")
    $(".chat_body").css({"top":"20px","left":"27%"});
    left=true;
  }
  else{
    $(".for_chat").css({"bottom":""})
    $("#chat").css({"bottom":"", "top":"","left":"","transform":""}).html("Связь с оператором &#9650")
    $(".chat_body").css({"top":"","left":""});
    left=false;
  }

});

$("#chat").click(function () {
  var chat_body= $(".chat_body");
  chat_body.css({"backgroundColor":"red"});
  if(!left)
    chat_body.animate({height:'toggle'});
  else
    chat_body.animate({width:'toggle'});
});

function get_content(){
  $.ajax({
    url: "https://api.mongolab.com/api/1/databases/mydatabase/collections/market/" +
    "5b6be50bfb6fc00289f2c0b8?apiKey=_6BDigQllIiJle4PerntiNKhm2-7vI0I",
    success:function (data) {
      from(data,data.ads[0].discounts);
      from(data,data.ads[1].shares);
      from(data,data.ads[2].news);
    },
    error:function(jqXHR,textStatus,errorThrown){
      alert("bad news!"+textStatus+errorThrown)
    }
  });
}
var number=0;
//загрузка контента по категориям
function from(data,obj) {
  for(key in obj){
    let image=$("<img>");
    let src=obj[key].img;
    let text=obj[key].description;
    image.attr("src",src);
    let div=$("<div>");
    div.addClass("description");
    div.text(text);
    let item=$("<div>");
    item.addClass("item");
    //слева
    if(number%2==0){
      item.append(image);
      item.append(div);
    }
    //справа
    else{
      item.append(div);
      item.append(image);
    }
    $(".content").append(item);
    number++;
  }
}


new CreateForm(action)
var previous_variant="";
function CreateForm(elem) {

  //вход в систему
  this.login=function(){
    load('login');
    new GetAndCancel(login);
    $(".login").effect("puff",{percent:200,mode:"show"},400);
  };
  //регистрация
  this.registration=function(){
    load('registration');
    new GetAndCancel(registration);
    $(".login").effect("puff",{percent:200,mode:"show"},400);
  };
  //корзина
  this.basket=function(){
    load('backet');
  };
  this.cabinet=function () {
    $("#left_panel").html("")
    $("#carousel").css("display","none");
    alert("cabinet")
    let nav=$("<nav>");
    nav.addClass("nav flex-column profile_menu");
    let a=$("<a>");
    a.addClass("nav-link");
    a.attr("href","#");
    a.text("Информация");
    a.attr("data-for","information")
    nav.append(a);
    a=$("<a>");
    a.addClass("nav-link");
    a.attr("href","#");
    a.text("История заказов");
    a.attr("data-for","history")
    nav.append(a);
    $("#left_panel").append(nav);

    load_page('cabinet','.content');
    load_data(current_email);
    new Edit(user_info);

    $(".profile_menu a").click(function (e) {
      e.preventDefault();
      let href=$(e.target).attr("data-for");
      switch (href){
        case 'information':$(".information").css("display","flex"); $(".history").css("display",""); break;
        case 'history': $(".history").css("display","flex"); $(".information").css("display",""); break;
      }
    })
    $(".profile_menu a:first-child").click(); //default

  }
  var obj=this;
//login
  $(elem).on("click",function (e) {

    var target=e.target;
    if((target.tagName!='LI')&&(target.tagName!='A'))
      return false;
    var variant=$(target).attr("data-type");
    //???? ПРОБЛЕМА ТУТ
    if((previous_variant!="")&&(variant==previous_variant)){
     // $(".login").toggle("puff",{percent:200},400);
      //return false;
    }
    if(variant){
      obj[variant]();
    }
    previous_variant=variant;
//    return false;

  });
}
//загрузка
function load(url) {
  $(".login").attr("id",url);

  $.ajax({
    url: url+".html",
    success:function (html) {
      $(".login").html(html);

      $(".login a").on("click",function () {
        //  $(".form-group span").animate({opacity:"toggle"},300);
        $(".login").toggle("puff",{percent:200},400);
        return false;
      }).mouseover(function () {
        $(this).css("color","red");
      }).mouseout(function () {
        $(this).css("color","")});

    },
    error:function(jqXHR,textStatus,errorThrown){
      alert("bad news!"+textStatus+errorThrown)
    }
  });
}

function load_page(url,where) {
  $.ajax({
    url: url+".html",
    async:false,
    success:function (html) {
      $(where).html(html);
    },
    error:function(jqXHR,textStatus,errorThrown){
      alert("bad news!"+textStatus+errorThrown)
    }
  });
}
//страница каталога
function load_category(url,where,id) {
 // alert(id)
  let index;
  switch (id){
    case "female": index=0; break;
    case "male": index=1;break;
  }
  $.ajax({
    url: url+".html",
    async:false,
    success:function (html) {
      //грузим меню
      $(where).html(html);

      //указываем активным главный раздел
      $("#"+id).toggleClass("active"); //женская/мужская
      $(".content").html("");
      //раскрываем подраздел
      $("#categories").accordion({active:index});
      //делаем по умолчанию "летний сезон" выбранным
      $("#categories div[class*='ui-accordion-content-active'] a[data-type='summer']").addClass('active');
      //загружаем данные
        load_items("catalog_item");

    },
    error:function(jqXHR,textStatus,errorThrown){
      alert("bad news!"+textStatus+errorThrown)
    }
  });
}
//выбор категории в главном меню
function ChooseCathegory(elem){

  this.female_category=function () {
      load_category('catalog_menu','#left_panel','female')
  };
  this.male_category=function () {
    load_category('catalog_menu','#left_panel','male')
  };
  let obj=this;

  $(elem).click(function (e) {
    if(e.target.tagName!='A')
      return false;
    let to=$(e.target).attr("id");
    if(to){
      obj[to]();
    }
  })
}
new ChooseCathegory(category)

$("#to_main").click(function (e) {
  e.preventDefault();
  $("#carousel").css("display","")
  $(".content").html("")
  $("#left_panel").html("")
  get_content();

})

$(document).ready(function () {
  $(".login").css("display","none");
  if($.cookie('user')){
    current_email=$.cookie('user');
    hide();
  } // сохраняем значение в ключ hide

});
//noinspection JSUnresolvedFunction
$( window ).unload(function() {
  return "Handler for .unload() called.";
});
