var app = app || {};
// for thundr
Parse.initialize("GPBcV6zGuJ2E6OD9nsBZ5q3XnLAkrybuA8RFC4HB", "0mfkZM9QM8Vnc5fMt3JrKpGwLQbKrfYCvohsNgBG");
// for test

// Parse.initialize('d6xCj225mOTHOFOU0R3guTOf7gaSeXQLH3o2Bah5', 'R12RpPwEux94hCH3WFe2njWFFqwsjo1ZHQrfkwBm');
$(function(){
	// kick things off by creating THE APP
	app.appp = new app.AppView();	
});

// $('.right').scroll(function(e){ 
//   $el = $('.table-header'); 

//   if ($(this).scrollTop() > 5 && $el.css('position') != 'fixed'){ 
//     $('.table-header.top').css({'position': 'fixed' , 'top': 'auto'}); 
//   }
//   if ($(this).scrollTop() < 10 && $el.css('position') == 'fixed')
//   {
//     $('.table-header.top').css({'position': 'static' , 'top': '0px'}); 
//   } 
// });
// $(window).scroll(function(e){
// 	$el = $('.table-header');
// 	var scrolltop = $(window).scrollTop();
// 	$('.table-header.top').css({'position': 'fixed' , 'top': -scrolltop}); 
// });