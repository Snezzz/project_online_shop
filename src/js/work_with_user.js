/**
 * Created by Снежа on 10.08.2018.
 */
  //генерирование id
var ID = function () {
    return '_' + Math.random().toString(36).substr(2, 9);
  };
//login (делегирование)
var current_email;
function GetAndCancel(elem) {

  function isFullish(solve) {
    $(".form-group input:not([type='checkbox'])").each(function (i,value) {
      if(!$(this).val()){
        solve=false;
        return false;
      }
    });
    return solve;
  }
  this.check=function () {
    //проверяет все инпуты на заполнение
    var solve=true;
    if(!isFullish(solve)){
      alert("Заполните все поля!");
      return false;
      //переключиться на незаполненное поле
    }
    let email= $("#user_email");
    let password=$("#user_password");
    //успешный вход в систему
    if(check(email.val(),password.val())){
      alert("Добро пожаловать!");
      current_email=email.val(); //тот, кто зашел
      hide();
      let current_time=new Date();
      alert(current_time.getDate());
      $.cookie("user",email.val());
     }

    //чето неправильно
    else {
      $(elem).effect("shake");
      $("#check").animate({opacity:"show"},4000)
    }

  };
  //регистрация
  this.send=function () {
    var solve=true;
    if(!isFullish(solve)){
      alert("Заполните все поля!");
      return false;
      //переключиться на незаполненное поле
    }

    let password=$("#user_password").val();
    let check_password=$("#user_password_repeat").val();
    if(check_password!=password){
      $("#error").animate({opacity:"show"},2000).animate({opacity:"hide"},5000)
      $("#user_password_repeat").css("border-color","red");
      return false;
    }
    else {
      $("#user_password_repeat").css("border-color","green");
    }
    createUser();
    $(".login").hide("puff",{percent:200},400);
  };
  this.cancel=function () {
    $("#success").css("display","");
    //для всех полей input
    $(".form-group input").each(function (i,value) {
      $(this).val("");
    });
  };
  var obj=this;

  $(elem).on("click",function (e) {

    let target = e.target;
    if (target.tagName != 'BUTTON')
      return false;
    let dataType=$(target).attr("data-type");
    if(dataType){
      obj[dataType]();
    }
  return false;
  });
}
//поиск зарегистрированного пользователя в бд
function check(email,password) {
  var login=false;
  $.ajax({
    url:"https://api.mongolab.com/api/1/databases/mydatabase/collections/market/" +
    "5b6d35c7e7179a59c6d785d8?apiKey=_6BDigQllIiJle4PerntiNKhm2-7vI0I",
    type:"get",
    async: false,
    success:function (data) {

          for(var key in data.users){
            if((data.users[key].email==email)&&(data.users[key].password==password)){
              login=true;
              break;
            }
          }


    },
    error:function(jqXHR,textStatus,errorThrown){
      alert("bad news!"+textStatus+errorThrown)
    }
  });
  return login;
}

function createUser() {
  var user={};
  user.id=ID();
  //перебираем все заполненные input
  var obj=$(".form-group input[data-item]");
  obj.each(function (k,v) {
    let data=$(this).attr("data-item");
    let value=$(this).val();
    user[data]=value;
  });
  user.img="";
  user.orders=[];
  $.ajax({
    url:"https://api.mongolab.com/api/1/databases/mydatabase/collections/market/" +
  "5b6d35c7e7179a59c6d785d8?apiKey=_6BDigQllIiJle4PerntiNKhm2-7vI0I",
    type:"put",
    async:false,
    data: JSON.stringify({ $push:{"users": user}}), //в массив users кладем объект {...}
    contentType:"application/json",
    success: function () {
      alert("Поздравляем с регистрацией!")

    },
    error:function(jqXHR,textStatus,errorThrown){
      alert("bad news!"+textStatus+errorThrown)

    }
  });
}

//успешный вход в систему
function hide() {
  $(".login").hide("puff",{percent:200},400); //убираем форму
  $(".variants li:nth-child(1), .variants li:nth-child(2)").css("display","none");
  $("#cabinet").css("display","block");
  let li=$("<li>");
  li.attr("id","exit");
  let a=$("<a>");
  a.attr("href","");
  a.attr("data-type","come out");
  a.text("Выйти");
  li.append(a);
  $(".variants").append(li);
  //выход
  $("#exit a").click(function (e) {
    e.preventDefault();
    $.cookie('user', null);
    $("#to_main").click();
    show();
  })
}
function show() {
  $(".variants li:nth-child(1), .variants li:nth-child(2)").css("display","");
  $("#cabinet").css("display","");
  $(".variants #exit").remove();
}
//загрузка данных на страницу
function load_data(user_email) {
  $.ajax({
  url:"https://api.mongolab.com/api/1/databases/mydatabase/collections/market/" +
  "5b6d35c7e7179a59c6d785d8?apiKey=_6BDigQllIiJle4PerntiNKhm2-7vI0I",
  type:"get",
  async: false,
  success:function (data) {
    for(var key in data.users){
      if(data.users[key].email==user_email){
        get_info({name:data.users[key].name,sirname:data.users[key].sirname,email:data.users[key].email});
       get_orders(data.users[key].orders);
        break;
      }
    }
  },
  error:function(jqXHR,textStatus,errorThrown){
    alert("bad news!"+textStatus+errorThrown)
  }
});

}
//сбор данных о пользоателе (стандарт - имя, фамилия, email)
function get_info(data) {
  //информация
  for(var key in data) {
    $(".information .user_information li a[data-type='" + key + "']").html(data[key])
  }
}
function get_orders(data) {
  //для каждого заказа
  for(let key in data) {
    let tr=$("<tr>");
    let th=$("<th>");
    for(let i in data[key]){
      let td=$("<td>");
      if(typeof data[key][i]=='object'){
        for(let k in data[key][i]){
          let a=$("<a>");
          a.text(data[key][i][k].name);
          a.attr("href",data[key][i][k].href);
          td.append(a);
        }
      }
      else {
        td.text(data[key][i]);
      }
      tr.append(td);
    }
    let td=$("<td>");
    let a=$("<a>");
    a.attr("href","#");
    a.text("Повторить заказ");
    td.append(a);
    tr.append(td);
    $(".history tbody").append(tr);
  }

}
//загрузка аватарки
/*
$("#drop-area").dmUploader({
  url: '/path/to/backend/upload.asp',
  //... More settings here...

  onInit: function(){
    console.log('Callback: Plugin initialized');
  },
  onComplete: function () {

  }

  // ... More callbacks
});

*/
