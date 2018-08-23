
function LoadItem(elem){
  alert("start")
  this.load=function (what) {
      load_info(what);
  };
  let obj=this;
  $(elem).click(function (e) {
    let target=$(e.target);

    if(e.target.tagName!='IMG')
      return false;

    let id=target.attr("id");
    alert(id);
    if(id){
      obj.load(id);
    }
  });
}
function load_info(what) {
 let active_sex=$("#categories h3[aria-selected='true']").children().eq(1).attr("id");
  $.ajax({
    url: "https://api.mongolab.com/api/1/databases/mydatabase/collections/market/" +
    "5b76a085e7179a69ea6076ea?apiKey=_6BDigQllIiJle4PerntiNKhm2-7vI0I",
    type: "GET",
    async:false,
    success: function (data) {
      let item_data=data.items.id[default_type][active_sex][what];
        if(data){
          $("#left_panel").html("");
          $("#carousel").css("display","none")
         load_page("product_info",".content");
          $("#product_img").attr("src",item_data.img);//загрузка картинки
          //загрузка рейтинга
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
          })
        }
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
        load_description(item_data.main_information,".product_information");
        load_comments(item_data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("bad news!" + textStatus + errorThrown)
    }
  });
}
var prev;
/*$("li[data-type='colors'] button").click(function (e) {
  e.preventDefault();
  alert("click")
  if(prev)
    $(prev).css( {"height":"",
      "width": ""});
  $(e.target).css( {"height":"35px",
  "width": "35px !important"})
  prev=e.target;
})
*/
function load_comments(data) {

  for(let key in data.comments){
    let div=$("<div>");
    div.attr("class","comment");
     let item=data.comments[key];
    console.log(data.comments[key]);
    load_user(item.user_id,div);//загружаем картинку и имя с фамилией
    let text=data.comments[key].comment;
    let text_div=$("<div>");
    text_div.html(text);
    //let rating;
    div.append(text_div);
    $(".comments .panel-body .list").append(div);
  }
}
function load_user(what,where) {
  $.ajax({
    url:"https://api.mongolab.com/api/1/databases/mydatabase/collections/market/" +
    "5b766cdde7179a69ea606557?apiKey=_6BDigQllIiJle4PerntiNKhm2-7vI0I",
    async:false,
    success:function (data) {
        let img=$("<img>");
        img.src=data.users[what].img;
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
  let answer=confirm("Перейти в корзину?")
  if(!change){
   let id=product_ID();
    items[id]=item;
  }
  //items.push(item);

  console.log(items);

  if(!answer){
    return false;
  }
  else{
    load_page("basket",".content");
    get();
    new Action(basket_action)
    //new ChangeAmount(basket)
  }
});

function addToBasket(item) {
  items.push(item);
}
var product_ID = function () {
  return 'product_' + Math.random().toString(36).substr(2, 9);
};
