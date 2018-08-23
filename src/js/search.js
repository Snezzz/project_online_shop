
/**
 * Created by Снежа on 11.08.2018.
 */

//проверка почты
$("#user_email").blur(function () {
  var existence=false;
  var input=$(this);
  var email=$(this).val();
  //проверка на идентификацию почтового ящика
  $.ajax({
    url:"https://api.mongolab.com/api/1/databases/mydatabase/collections/market/" +
    "5b766cdde7179a69ea606557?apiKey=_6BDigQllIiJle4PerntiNKhm2-7vI0I",
    async:false,
    success: function (data) {
      //поиск, заругистрирован ли уже этот пользователь

      for(var key in data.users) {
        if(data.users[key].email==email){
          existence=true;
          break;
        }
      }
      if(existence){
        input.css("color","red");
        $("#warning").animate({opacity:"show"},1000).animate({opacity:"hide"},3000);
        input.focus();
        $(".form-group button[data-type='send']").attr("disabled","");
      }
      else{
        input.css("color","green");
        $(".form-group button[data-type='send']").removeAttr("disabled");
      }
    },
    error:function(jqXHR,textStatus,errorThrown){
      alert("bad news!"+textStatus+errorThrown)

    }
  });

});

//проверка пароля
$("#user_password").blur(function () {
  if($(this).val().length<8){
    $("#success").hide(1000);
      $("#min_length").animate({opacity:"show"},1000).animate({opacity:"hide"},4000);
    $(".form-group button[data-type='send']").attr("disabled","");
  }
  else{
    $("#success").show(1000);
    $(".form-group button[data-type='send']").removeAttr("disabled");
  }
})


