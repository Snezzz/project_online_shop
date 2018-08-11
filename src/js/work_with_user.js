/**
 * Created by Снежа on 10.08.2018.
 */

//login (делегирование)
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
    if(check(email.val(),password.val())){
      alert("Добро пожаловать,");
      $(".login").toggle("puff",{percent:200},400);
    }
    else {
      $(elem).effect("shake");
      $("#check").animate({opacity:"show"},4000)
    }

  };
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

  $(elem).click(function (e) {

    let target = e.target;
    if (target.tagName != 'BUTTON')
      return false;
    let dataType=$(target).attr("data-type");

    //
    if(dataType){
      obj[dataType]();
    }
  return false;
  });
}

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
  })
  return login;
}

function createUser() {
  var user={};
  //перебираем все заполненные input
  var obj=$(".form-group input[data-item]");
  obj.each(function (k,v) {
    let data=$(this).attr("data-item");
    let value=$(this).val();
    user[data]=value;
  });
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
