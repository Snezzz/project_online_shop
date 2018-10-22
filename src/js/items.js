var remember={};
var item_id;
function LoadItem(elem,data,load){
  this.load=function (what) {

    if(load)
     remember=load_info(what,null,load);
    else
      remember=load_info(what,data,false);
  };
  let obj=this;
  $(elem).click(function (e) {
    let target=$(e.target);

    if(e.target.tagName!='IMG')
      return false;
    let id=target.parent().attr("id");

    if(id){
      obj.load(id);
    }
  });
}
var item_data;
var item_rating;
function load_info(what,ready_data,load) {

// let active_sex=$("#categories h3[aria-selected='true']").children().eq(1).attr("id");
  let active_sex=sex;
  let remember={};
  remember['type']=default_type;
  remember['sex']=active_sex;
  remember['id']=what;
  if(load) {
    no_search=true;
    $.ajax({
      url: "https://api.mongolab.com/api/1/databases/mydatabase/collections/market/" +
      "5b76a085e7179a69ea6076ea?apiKey=_6BDigQllIiJle4PerntiNKhm2-7vI0I",
      type: "GET",
      async: false,
      success: function (data) {
        item_id = what;
        item_data = data.items.id[default_type][active_sex][what];
        if (data) {
          $("#content").html("");
          $("#left_panel").html("");
          $("#carousel").css("display", "none");
          load_page("product_info", ".content");
          load_data(item_data, what);
        }

      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert("bad news!" + textStatus + errorThrown)
      }
    });
  }
  else{
    no_search=false;
    let remember={};
    item_data=ready_data[what];
    remember=item_data;
    $("#carousel").css("display", "none");
    load_page("product_info", ".content");
    load_data(ready_data[what], what);
  }
  console.log(item_data)
  load_description(item_data['main_information'],".product_information");
  load_comments(item_data);

  return remember;
}
var prev;
function load_data(item_data,what){

  $("#product_img").attr("src",item_data.img);//загрузка картинки
  //загрузка рейтинга
  item_rating=Number(item_data.rating);
  get_stars($(".item_rating"),Number(item_data.rating));
  //
  $("#product_choose ul li").each(function (i,v) {
    let span=$("<span>");
    let type=$(this).attr("data-type");
    if(type=='name'){
      $(this).attr('data-product',what)
    }
    if(type=='sizes'){
      for(let i in item_data[type]){
        let button=$("<a>");
        button.attr("href","")
        button.attr("role","button");
        button.attr("data-size",item_data[type][i])
        button.attr("class",'btn btn-outline-warning');
        button.html(item_data[type][i]);
        span.append(button);
      }
    }
    else if(type=='colors'){
      for(let i in item_data[type]) {
        let button = $("<a>");
        button.attr("href"," ");
        button.attr("id",item_data[type][i]);
        button.attr("class", "color");
        button.css("color",item_data[type][i]);
        let elem=$("<i>");
        elem.attr("class","material-icons");
        elem.text("brightness_1");
        button.append(elem);
        span.append(button);
      }


    }
    else {
      span.html(item_data[type]);
    }
    $(this).append(span);
  });
  var prev_size;
  $("a[data-size]").click(function (e) {
    e.preventDefault();
    if(prev_size){
      $(prev_size).toggleClass("active");
    }

    $(this).toggleClass("active");
    prev_size=e.target;
  });
  $(".color").click(function (e) {
    e.preventDefault();
    if(prev) {
      $(prev).parent().removeAttr("active");
      $(prev).css("font-size", "");
    }
    $(e.target).css( "font-size","32px")
    $(this).attr("active","");
    prev=e.target;
  });
}
function load_comments(data) {

  for(let key in data.comments){
    let div=$("<div>");
    div.attr("class","comment");
    div.css({"margin-bottom":"12px","margin-top":"8px"})
     let item=data.comments[key];
    //console.log(data.comments[key]);
    load_user(item.user_id,div);//загружаем картинку и имя с фамилией
    let text=data.comments[key].comment;
    let text_div=$("<div>");
    text_div.html(text);
    //let rating;
    div.append(text_div);
    $(".comments .panel-body .list").prepend(div);
  }
}
function load_user(what,where) {
  $.ajax({
    url:"https://api.mongolab.com/api/1/databases/mydatabase/collections/market/" +
    "5b766cdde7179a69ea606557?apiKey=_6BDigQllIiJle4PerntiNKhm2-7vI0I",
    async:false,
    success:function (data) {
        let img=$("<img>");
        img.attr("src",data.users[what].img);
        img.css({"width":"20%","float":"left","clear":"both"})
        let name=$("<h3>");
        name.html(data.users[what].name+" "+data.users[what].sirname);
        where.append(img);
        where.append(name);
    },
    error:function(jqXHR,textStatus,errorThrown){
      alert("bad news!"+textStatus+errorThrown)
    }
  });


}
function load_description(what,where) {
  console.log(what);
    for(let key in what){
      let td=$("<td>");
      let tr=$("<tr>");
      td.html(key);
      tr.append(td);
      td=$("<td>");
      td.html(what[key]);
      tr.append(td);
      $(where+" .table tbody").append(tr);
    }
}

//добавление товара в избранное
$("#btnAddToFavourites").click(function (e) {
  e.preventDefault();
  switch($(this).children().text()){
    case'favorite_border':$(this).children().text('favorite');
      break;
    case 'favorite':$(this).children().text('favorite_border');
      break
  }
});
var amount=1;
//добавление товара в корзину
var answer;
$("#btnAddToBasket").click(function () {
  let change=false;
  let id = $("#product_choose ul li[data-type='name']").attr("data-product");
  console.log("id=" + id);
  let color = $("#product_choose ul li[data-type='colors'] a[active]").attr("id");
  console.log('color=' + color);
  let size = $("#product_choose ul li[data-type='sizes'] a[class*='active']").attr("data-size");
  console.log(size)
  let cost = $("#product_choose ul li[data-type='cost']").text();
  if ((!color) || (!size)) {
    alert("Выберите все параметры товара")
    return false;
  }
  let name = $("#product_choose ul li[data-type='name']").text();
  let item = {id: id, name: name, size: size, color: color, cost: cost,amount:1};

  //проверка на совпадение
  for (let key in items){
    if((items[key].id==item.id)&&(items[key].name==item.name)&&(items[key].size==item.size)&&(items[key].color==item.color)){
    let val=Number(items[key].amount);
    val++;
    items[key].amount=val;
    change=true;
  }
    }
  $('#dialog').dialog("open");
  if(!change){
   let id=product_ID();
    items[id]=item;
  }
  console.log("JSON:"+JSON.stringify(items));
  $.cookie("items",JSON.stringify(items));

});

//
$("#dialog").dialog({
  autoOpen: false,
  width:'500px',
  buttons: [
    {
      text: "Продолжить покупку",
      click: function() {
        answer=false;
        $( this ).dialog( "close" );
      }
    },
    {
      text: "Перейти в корзину",
      click: function() {
        answer=true;
        $( this ).dialog( "close" );
        load_page("basket",".content");
        //get();
        //new Action(basket_action)
      }
    }
  ]
});
function addToBasket(item) {
  items.push(item);
}
var product_ID = function () {
  return 'product_' + Math.random().toString(36).substr(2, 9);
};

//добавление комментария
$("#btnAddComment").click(function () {
  if($.cookie("user")) {
    $(".new_comment").animate({height: "show"})
  }
  else{
    $("p[data-type='alert']").animate({opacity:"show"},2000).animate({opacity:"hide"},4000);
  }
});
//отправить комментарий
$(".new_comment button").click(function () {
  let user_id=$.cookie("user");
  let date=new Date();
  let comment={
    user_id:user_id,
    comment:$(".new_comment textarea").val(),
    rating:5,
    date: date.getDate()
  };
  console.log(user_id);
  let to_send="items.id."+remember.type+"."+remember.sex+"."+remember.id+".comments."+order_ID();
  let data={};
  data[to_send]=comment;
  $.ajax({
    url:"https://api.mongolab.com/api/1/databases/mydatabase/collections/market/" +
    "5b76a085e7179a69ea6076ea?apiKey=_6BDigQllIiJle4PerntiNKhm2-7vI0I",
    type:"put",
    async:false,
    data: JSON.stringify({ $set:data}), //в массив users кладем объект {...}
    contentType:"application/json",
    success: function () {
      let div=$("<div>");
      div.attr("class","comment");
      load_user($.cookie("user"),div);//загружаем картинку и имя с фамилией
      let text=comment.comment;
      let text_div=$("<div>");
      text_div.html(text);
      //let rating;
      div.append(text_div);
      $(".comments .panel-body .list").prepend(div);
      $(".new_comment textarea").val("");
      $(".new_comment").css("display","")
    },
    error:function(jqXHR,textStatus,errorThrown){
      alert("bad news!"+textStatus+errorThrown)

    }
  });
});
/*$("a[data-type='back']").click(function (e) {
  e.preventDefault();

})
*/
$("#product_face button[data-type='put_rating']").click(function () {

  $(this).css("display","none");
  $(".item_rating").html("");
  get_stars( $(".item_rating"))
  let prev;
  let next=true;
  let data=[];
  $(".item_rating i").mouseover(function (e) {

    if(prev) {
      //заходим снаружи
      if (e.relatedTarget.tagName != 'I') {
        let num = Number($(e.target).attr("data-cost"));
        console.log(num)
        $(".item_rating i").each(function (e, v) {
          if (Number($(v).attr("data-cost")) == num + 1)
            return false;
          else
            $(v).text("star");
        });
        prev = $(e.target);
        data.push(Number($(e.target).attr("data-cost")));
        return false;
      }
        if ($(e.target).text() == prev.text()) {
          prev.text("star_border")
        }
        else
          $(e.target).text("star")
      }
    else $(e.target).text("star")
    prev = $(e.target);
    data.push(Number($(e.target).attr("data-cost")));

  }).click(function (e) {
    $(".item_rating").html("");
    let rating=Number($(e.target).attr("data-cost"));
    console.log(rating+","+item_rating)
    get_stars($(".item_rating"),(item_rating+rating)/2);
  });
});
//возврат назад
$("a[data-type='back']").click(function (e) {
  e.preventDefault();
  if(no_search) {
    history.go(-2);
// window.location.hash=prev_loc;
    window.location.reload();
  }
  else
  load_result();
});
