/**
 * Created by Снежа on 19.08.2018.
 */

//заполнение таблицы по корзине
function get() {
  let sum=0;
  let i=0;
  check_fullness();
  //не добавляем, а обновляем список
  $("#basket tbody").html("");
  for(let el in items){
    let tr=$("<tr>");
    tr.attr("id",el);
    //по каждому товару
    for(let key in items[el]){
      let td=$("<td>");
      //цвет
      if(key=='color'){
        let elem=$("<i>");
        elem.attr("class","material-icons");
        elem.text("brightness_1");
        elem.css("color",items[el][key]);
        td.append(elem);
      }
      //стоимость
      if(key=='cost'){
        let cost=Number(items[el][key]);
        sum=sum+cost*items[el].amount;
        td.text(items[el][key]);
      }
      if(key=='amount'){
        continue;
      }
      else {
        td.text(items[el][key]);
      }
      tr.append(td);
    }
    let td=$("<td>");
    td.attr("class","change");
    let button=$("<button>");
    button.text("-");
    button.attr("type","button");
    button.attr("class","btn btn-dark");
    button.attr("data-action","reduce");
    td.append(button);
    let input=$("<input>");

    input.attr("value",items[el].amount);//.
    td.append(input);

    button=$("<button>");
    button.attr("type","button");
    button.attr("class","btn btn-dark");
    button.text("+");
    button.attr("data-action","increase");
    td.append(button);

    tr.append(td);
    $("#basket tbody").append(tr);
     td=$("<td>");
    let a=$("<a>");
    a.attr("class","delete");
    a.text("Убрать из списка");
    a.attr("href","")
    td.append(a);

    tr.append(td);
    $("#basket tbody").append(tr);

    i++;
  }
  //-
  $("button[data-action='reduce']").click(function () {
    let tr=$(this).parent().parent().attr("id");
    let val=$("#"+tr+" td:nth-child(6) input")
    let new_val=Number(val.val());
    if(new_val==1)
      return false
    new_val--;
    val.val(new_val);
    let cost=Number($("#"+tr+" td:nth-child(5)").text());
    let prev_sum=Number($("#basket_action h2").text());
    let new_sum=prev_sum-cost;
    $("#basket_action h2").text(get_sum());

    items[tr][amount]=new_val;


  });
  //+
  $("button[data-action='increase']").click(function () {
    let tr=$(this).parent().parent().attr("id");
    let val=$("#"+tr+" td:nth-child(6) input");
    let new_val=Number(val.val());
    new_val++;
    val.val(new_val);
    let cost=Number($("#"+tr+" td:nth-child(5)").text());
    let prev_sum=Number($("#basket_action h2").text());
    let new_sum=prev_sum+cost;
    $("#basket_action h2").text(get_sum());
    items[tr][amount]=new_val;


  })

  //убрать из списка
  $(".delete").click(function (e) {
    e.preventDefault();

    let tr= $(this).parent().parent();
    console.log(tr);
    let id=tr.attr("id");
/*
    let to_remember={};
    $(this).parent().parent().children().each(function (e,v) {
      if(e==5) {
        let a=$("<a>");
        a.attr("href","");
        a.attr("id","replace")
        a.text("Восстановить");
        $(this).append(a);
        return false;
      }
      to_remember[e]=v;
      $(this).text("");

    });
    console.log(to_remember);
    */
      $(this).parent().parent().remove();
    $.cookie("items",null);
    //alert($.cookie("items"));
    let descriprion={};
    let data=$("#basket tbody tr");

    data.each(function (e,v) {
      let id=$(v).children().eq(0).text();
      let name=$(v).children().eq(1).text();
      let size=$(v).children().eq(2).text();
      let color=$(v).children().eq(3).text();
      let cost=$(v).children().eq(4).text();
      let count=$($(v).children().eq(5)).children().eq(1).val();
      let item={
        id:id,
        name:name,
        size:size,
        color:color,
        cost:cost,
        amount:count
      };
   /*   let item={
        product_id:name,
        size:size,
        color:color,
        cost:cost,
        count:count
      };
*/
      descriprion[name]=item;
    });
    $.cookie("items",JSON.stringify(descriprion));

    /*$("#replace").click(function(e){
      e.preventDefault();
      $(this).parent().parent().children().each(function (e,v) {
        $(this).text(to_remember[e].textContent);
      });
    });
*/
    //items.splice(id, 1);
    delete items[id];

    if(Object.keys(items).length==0)
      check_fullness();

    $("#basket_action h2").text(get_sum());// пересчитываем
  })
  let h2=$("<h2>");
 $("#basket_action h2").text(sum);
  console.log(get_sum());

}

//общая стоимость
function get_sum() {
  let sum=0;
  let data=$("#basket tbody tr");
  data.each(function (e,v) {
    sum=sum+Number($(v).children().eq(4).text())*Number($(v).children().eq(5).children().eq(1).val());
  });

  return sum;
}
function Action(button) {
  this.send=function () {
    alert(delivery)
    if (!delivery) {
      alert("выберите способ доставки!");
      return false;
    }
    if (!$.cookie("user")) {
      $("#contacts").effect("puff", {percent: 200, mode: "show"}, 400);
    }
    else {
      let user_id = $.cookie("user");
      send_order(user_id);
    }
  };

  this.cancel=function () {
    let action=confirm("Вы уверены, что хотите отменить заказ? Все данные потеряются");
    if(!action)
      return false;
    delete items;
    $.cookie("items",null)
    console.log(items)
    $("#to_main").click();
  };
  let obj=this;
  $(button).click(function (e) {
    if(e.target.tagName!='BUTTON')
      return false;
    let action=$(e.target).attr('data-type');
    if(action)
      obj[action]();
  })
}


var order_ID = function () {
  return Math.random().toString(36).substr(2, 9);
};
//есть ли что-либо в корзине
function check_fullness() {
  //if((Object.keys(items).length==0)||(items==null)){
  if(!items){
    $(".alert-warning").css("display","block");
    $(".basket_content").css("display","none")
    $(".content a[data-type='back']").css("display","none");
  }
  else {
    $(".alert-warning").css("display","");
    $("#basket_content").css("display","")
  }
}
var prev_cost;
var delivery=false;
$("#home_delivery").click(function () {

  $(".delivery_address").css("display","block");
  $("#place").css("display","");
  prev_cost= Number($("#basket_action h2").text());
  let new_cost= prev_cost+(prev_cost*25/100);
  $("#basket_action h2").text(new_cost)
  delivery=true;
});

$("#pickup").click(function () {
  $(".delivery_address").css("display","");
  $("#place").css("display","block");
  $("#basket_action h2").text(prev_cost)
  delivery=true;
  alert(delivery)
});
//заполнение данных адреса доставки
var address;
$(".delivery_address button").click(function () {

  let city=$(".delivery_address input:first-child").val();
  let street=$(".delivery_address input:nth-child(2)").val();
  let home_number=$(".delivery_address input:nth-child(3)").val();
  let flat=$(".delivery_address input:nth-child(4)").val();
  address={city:city,street:street,home_number:home_number,flat:flat};
  let a=$("<a>");
  a.attr("href","");
  a.attr("class","change_data");
  a.text("г."+city+" ул."+street+" "+home_number+","+flat);
  let prev= $(".delivery_address").html(); //для изменения
  $(".delivery_address input,.delivery_address button").css("display","none");
  $(".delivery_address").append(a);

  $(".change_data").click(function (e) {
    e.preventDefault();
    $(".delivery_address input,.delivery_address button").css("display","");
    a.remove();

  });
});

$("#contacts a").click(function (e) {
  e.preventDefault();
  $("#contacts").effect("puff", {percent: 200, mode: "hide"}, 400);
});

function send_order(user_id){
  let order_id=order_ID();
  let date=new Date();
  let descriprion={};
  let data=$("#basket tbody tr");

  data.each(function (e,v) {
    let name=$(v).children().eq(1).text();
    let size=$(v).children().eq(2).text();
    let color=$(v).children().eq(3).text();
    let count=$(v).children().eq(5).text();
    let item={
      product_id:name,
      size:size,
      color:color,
      count:count
    };
    descriprion[name]=item;
  });
  let order={
    id: order_id,
    date: date.getDay(),
    description:descriprion,
    cost: $("#basket_action h2").text(),
    status: "В ожидании подтверждения"
  };
  console.log($(".delivery_address").css("display"))
  //если доставка на дом
  if($(".delivery_address").css("display")=="block"){
    order.type='Доставка на дом';
    order.address=address;
  }
  else{
    order.type="Самовывоз";
    order.address=$("#place option[selected]").text();
  }
  let where="users."+user_id+".orders."+order_id;
  let to_send={};
  to_send[where]=order;
  $.ajax({
    url:"https://api.mongolab.com/api/1/databases/mydatabase/collections/market/" +
    "5b766cdde7179a69ea606557?apiKey=_6BDigQllIiJle4PerntiNKhm2-7vI0I",
    type:"put",
    async:false,
    data: JSON.stringify({ $set:to_send}), //в массив users кладем объект {...}
    contentType:"application/json",
    success: function () {
      alert("Ваш заказ оформлен!Ожидайте связи с оператором")
      items={};


      //$("#to_main").click();
    },
    error:function(jqXHR,textStatus,errorThrown){
      alert("bad news!"+textStatus+errorThrown)

    }
  });
}
$("#contacts .form-group button[data-type='send']").click(function () {
  let action=true;
  $("#contacts div input").each(function (e,v) {
    if(!$(v).val()){
      alert("Все поля обязательны");
      action=false;
      return false;
    }
  });
    if(!action)
      return false;
  let id=ID();
  let data=$("#user_name").val().split(" ");
  let user={
    name:  data[0],
    sirname: data[1],
    phone_number: $("#phone_number").val(),
    email: $("#user_email").val(),
    orders:{}
  };
  let to_send={};
  to_send["users."+id]=user;
  $.ajax({
    url:"https://api.mongolab.com/api/1/databases/mydatabase/collections/market/" +
    "5b766cdde7179a69ea606557?apiKey=_6BDigQllIiJle4PerntiNKhm2-7vI0I",
    type:"put",
    async:false,
    data: JSON.stringify({ $set:to_send}), //в массив users кладем объект {...}
    contentType:"application/json",
    success: function () {
      send_order(id);
    },
    error:function(jqXHR,textStatus,errorThrown){
      alert("bad news!"+textStatus+errorThrown)

    }
  });
});
$("#phone_number").focus(function () {
  if(!$(this).val())
  $(this).val("+7");
  $("#phone_number").blur(function () {
    if($(this).val().length<12) {
      alert("недостаточно цифр в номере")
      $("#phone_number").focus();
    }
    if($(this).val().length>12) {
      alert("много цифр");
      $("#phone_number").focus();
    }
  });
});
$("a[data-type='back']").click(function (e) {
  e.preventDefault();
  //window.location.hash=prev_loc;
  //window.location.reload();
});

