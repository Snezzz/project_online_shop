/**
 * Created by Снежа on 19.08.2018.
 */

function get() {
  let sum=0;
  let i=0;
  check_fullness();

  for(let el in items){

    let tr=$("<tr>");
    tr.attr("id",el);
    for(let key in items[el]){
      let td=$("<td>");
      if(key=='color'){
        let elem=$("<i>");
        elem.attr("class","material-icons");
        elem.text("brightness_1");
        elem.css("color",items[el][key]);
        td.append(elem);
      }
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
    console.log(items)
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
  })

  return sum;
}
function Action(button) {
  this.send=function () {
    if(!$.cookie("user")) {
      $("#contacts").effect("puff", {percent: 200, mode: "show"}, 400);
    }
    let user_id=$.cookie("user");
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
        delete items;
        $("#to_main").click();
      },
      error:function(jqXHR,textStatus,errorThrown){
        alert("bad news!"+textStatus+errorThrown)

      }
    });
  };
  this.cancel=function () {
    let action=confirm("Вы уверены, что хотите отменить заказ? Все данные потеряются");
    if(!action)
      return false;
    delete items;
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
  if(Object.keys(items).length==0){
    $(".alert-warning").css("display","block")
    $(".basket_content").css("display","none")
  }
  else {
    $(".alert-warning").css("display","")
    $("#basket_content").css("display","")
  }
}
var prev_cost;
$("#home_delivery").click(function () {
  $(".delivery_address").css("display","block");
  $("#place").css("display","");
  prev_cost= Number($("#basket_action h2").text());
  let new_cost= prev_cost+(prev_cost*25/100);
  $("#basket_action h2").text(new_cost)
});

$("#pickup").click(function () {
  $(".delivery_address").css("display","");
  $("#place").css("display","block");
  $("#basket_action h2").text(prev_cost)
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

