/**
 * Created by Снежа on 12.08.2018.
 */


//мужская/женская
$("#categories h3 a").on('click', function (e) {
  e.preventDefault();
  var div=$(e.target).parent().next();
  div.addClass("active");
  $("#categories h3 a").toggleClass('active');//меняем цвет выбранной категории
  $("#categories div h4 a[data-type='summer']").toggleClass('active');
  load_items("catalog_item");

});

var default_type;
function load_items(url,which) {
  let active_item=$("#categories div h4 a[class='active']").attr("data-type");
  let key;
  $.ajax({
    url: url+".html",
    async:false,
    success:function (html) {

      $(".content").html(html);
      get_variants(active_item); //выбранная категория
      items_type(default_type); //грузим данные по разделу типа обуви
      $(".custom-select").change();
      new LoadItem(goods);
      new Filter(filter_action)
    },
    error:function(jqXHR,textStatus,errorThrown){
      alert("bad news!"+textStatus+errorThrown)
    }
  });

}
//изменено
function items_type(type_id,filter,arr,type) {
  let sex=$("#categories h3 a[class='active']").attr("id");

  let from;
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
      if(filter){

        for(let key in from){
          var color_consist=false;
          var size_consist=false;
          var cost_right=false;
          console.log(from[key].colors)
          console.log(from[key].sizes)
          //цвет
          for(let item of from[key].colors) {
            if (arr.colors.indexOf(item)!=-1)
              color_consist=true;
          }
          //размер
          for(let item of from[key].sizes) {
            if (arr.sizes.indexOf(item)!=-1)
              size_consist=true;
          }

          let cost=Number(from[key].cost);
          console.log(cost)
          if((arr.cost[0]<cost)&&(cost<arr.cost[1])){
            cost_right=true;
          }
          alert(color_consist+","+size_consist+","+cost_right)
          switch (type) {
            case 'cost':
              if (cost_right) {
                console.log("cost")
                push(from, key);
              }
            case 'color':
              if (color_consist) {
                console.log("color")
                push(from, key);
              }
              break;
            case 'size':
              if (size_consist) {
                console.log("size")
                push(from, key);
              }
              break;
            case 'color_size':
              if ((color_consist) && (size_consist)) {
                console.log("color+size")
              push(from, key);
          }
              break;
            case 'color_cost':
              if((color_consist)&&(cost_right)){
                console.log("color+cost")
                push(from,key);
              }

              break;
            case 'size_cost':
              if((size_consist)&&(cost_right)) {
                console.log("size+cost")
                push(from, key);
              }
              break;
            case 'color_size_cost':
              if((color_consist)&&(cost_right)&&(size_consist)){
                console.log("all")
                push(from,key);
              }
              break;
          }
        }
        return false;
      }
  //перебираем все товары по категории и подкатегории
      for(let key in from){
        let div=$("<div>");
        div.addClass("col-12 col-xs-2 col-sm-2 col-md-12 col-lg-4 col-xl-4");
        let child_div=$("<div>");
        child_div.addClass("card");
        child_div.attr("id",key)
        let img=$("<img>");
        img.attr("href","#content");
        img.attr("src",from[key].img);
        img.addClass("card-img-top");

        let child_div_div=$("<div>");
        child_div_div.addClass("card-body");
        let p=$("<p>");
        p.addClass("card-text");
        p.text(from[key].name);
        p.attr('data-cost',from[key].cost);
        p.attr('data-rating',from[key].rating)
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
$("#categories div h4 a").click(function (e) {
  var perv=$("#categories div h4 a[class*='active']")

  e.preventDefault();
  if (perv) {
    $(perv).toggleClass('active')
  }
  $(e.target).toggleClass('active')
  perv = $(e.target);
  let active_item=$("#categories div h4 a[class='active']").attr("data-type");
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

    e.preventDefault();
    let key;
    if(e.target.tagName=="LI"){
      key=$(e.target).attr("data-key");
    }
    else {
      key=$(e.target).parent().attr("data-key");
    }
    default_type=key;
    items_type(key);
    $(".custom-select").change();
    new LoadItem(goods);
    new Filter(filter_action)
  });
}

//открытие фильтра
$("#slider-range").slider({
  range: true,
  min: 199,
  max: 10000,
  values: [ 199, 3000 ],
  slide: function( event, ui ) {
    $( "#amount" ).val( ui.values[ 0 ] + " р - " + ui.values[ 1 ] +" р");
  }
});
$( "#amount" ).val( $( "#slider-range" ).slider( "values", 0 ) +" р - " +
  $( "#slider-range" ).slider( "values", 1 ) +" р");


//загрузка существующих цветов в фильтр
function load_filter() {
  $.ajax({
    url: "https://api.mongolab.com/api/1/databases/mydatabase/collections/market/" +
    "5b76a085e7179a69ea6076ea?apiKey=_6BDigQllIiJle4PerntiNKhm2-7vI0I",
    type: "GET",
    async:true,
    success: function (data) {
      let from=data.items.id;
      let colors={};
      let sizes={};
      for(let first_key in from){
        for(let second_key in from[first_key]){
          for(let third_key in from[first_key][second_key]){
            let colors_arr=from[first_key][second_key][third_key].colors;
           colors_arr.forEach(function(item, i, arr) {
             if(colors[item]===undefined){
                colors[item]=item;
               }
               });
            let sizes_arr=from[first_key][second_key][third_key].sizes;
            sizes_arr.forEach(function(item, i, arr) {
              if(sizes[item]===undefined){
                sizes[item]=item;
              }
            });
          }
        }
      }
      console.log(colors);
      console.log(sizes)
      input(colors,sizes);
    }
  });
}
function input(colors,sizes) {
  for(let item in colors){
      let button = $("<a>");
      button.attr("href"," ");
      button.attr("id",colors[item]);
      button.attr("class", "color");
      button.css("color",colors[item]);
      let elem=$("<i>");
      elem.attr("class","material-icons");
      elem.text("brightness_1");
      button.append(elem);
    $("#colors").append(button);
  }
  for(let item in sizes){
    let button=$("<a>");
    button.attr("href","")
    button.attr("role","button");
    button.attr("data-size",sizes[item])
    button.attr("class",'btn btn-outline-warning');
    button.text(sizes[item]);
    $("#sizes").append(button);

  }
  $("#sizes a, #colors a").click(function (e) {
    e.preventDefault();
    $(this).toggleClass("active");
  });

}


function Filter(elem){
  this.filter=function () {
  //
    let data={
      colors:[],
      sizes:[],
      cost:[]
    };
    data.cost[0]=$( "#slider-range" ).slider( "values", 0 );
    data.cost[1]=$( "#slider-range" ).slider( "values", 1 );
    $("#sizes a[class*='active']").each(function (i,v) {
      data.sizes[i]=$(v).attr("data-size");
    });

    $("#colors a[class*='active']").each(function (i,v) {
      data.colors[i]=$(v).attr("id");
    });

      let type=default_type;
    console.log(default_type);
    console.log(data);
    console.log(type);

    let with_cost=$("#cost_filter").prop('checked');
      if((data.sizes.length==0)&&(data.colors.length==0)) {
      //только стоимость
      if(with_cost) {
        items_type(type, true, data, "cost");
      }
      else{
        return false;
      }
    }
    //оба параметры
    else if((data.sizes.length>0)&&(data.colors.length>0)) {
      if (with_cost)
        items_type(type, true, data, "color_size_cost"); //грузим данные по разделу типа обуви
      else
        items_type(type, true, data, "color_size");
    }
    //один из
    else if(data.sizes.length>0){
        if (with_cost)
          items_type(type,true,data,"size_cost");
        else
          items_type(type,true,data,"size");
      }

    else if (data.colors.length>0) {
        if (with_cost)
        items_type(type, true, data, "color_cost");
        else
          items_type(type, true, data, "color");
      }
    new LoadItem(goods)
  };
  this.clear=function () {
  //
    $("#colors a,#sizes a").each(function (i,v) {
      $(v).removeClass("active");
    });
    $("#cost_filter").removeAttr("checked");
    $("#slider-range, #cost p").animate({height:"hide"})



  };
  let obj=this;
  $(elem).click(function (e) {

    if(e.target.tagName!="BUTTON")
      return false;
    console.log('clicked')
    let action=$(e.target).attr("data-type");
    if(action)
      obj[action]();
  })
}

function push(from,key){
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
  p.attr('data-cost',from[key].cost);
  p.attr('data-rating',from[key].rating)
  p.text(from[key].name)
  child_div_div.append(p);
  child_div.append(img);
  child_div.append(child_div_div);
  div.append(child_div);
  $("#goods").append(div);
}

$("#cost_filter").change(function () {

    $("#slider-range, #cost p").animate({height:"toggle"});
});

//сортировка(выбор)
$(".custom-select").change(function () {
  sort_items(this);
});
//сортировка
function sort_items(item){
    let data=[];
    $("#goods").children().each(function (i,v) {
      let cost=Number($(v).children().children().eq(1).children().attr('data-cost'));
      let rating=Number($(v).children().children().eq(1).children().attr('data-rating'));
      let item={
        id:($(v).children().attr("id")),
        cost:cost,
        rating:rating,
        html:$(v).children().html()
      };
      data.push(item);
    });
    console.log(data);
    let type=$(item).attr("id");
    switch (type){
      case 'category_sort':
        sort_category($(item).val(),$("#type_sort").val(),data);
        break;
      case 'type_sort':
        sort_category($("#category_sort").val(),$(item).val(),data);
        break;
    }
}
//по категории
function sort_category(what,how,data) {
  let result;
  switch (what) {
    case 'cost':
     result=sort_type(how,data,'cost');
      break;
    case 'rating':
      result=sort_type(how,data,'rating');
      break;
  }
  console.log(result)
  replace_item(result);
}
//возрастание/убывание
function sort_type(how,data,type) {
  let result=[];
  let copy=data.slice(0);
  switch (how)
  {
    case 'ascending':
      result=copy.sort(function (a,b) {
        let x=a[type];
        let y=b[type];
        return x < y ? -1: x > y ? 1:0;
      });
      break;
    case 'descending':
      result=copy.sort(function (a,b) {
        let x=a[type];
        let y=b[type];
        return x < y ? 1: x > y ? -1:0;
      });
      break;
  }
  return result;
}
//перестановка отсортированных элементов
function replace_item(item){
  $("#goods").children().children().each(function (i,v) {
    $(v).attr("id",item[i].id);
    $(v).html(item[i].html)
  });
}
