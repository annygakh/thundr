var app = app || {};
// for thundr
Parse.initialize("GPBcV6zGuJ2E6OD9nsBZ5q3XnLAkrybuA8RFC4HB", "0mfkZM9QM8Vnc5fMt3JrKpGwLQbKrfYCvohsNgBG");
// for test

// Parse.initialize('d6xCj225mOTHOFOU0R3guTOf7gaSeXQLH3o2Bah5', 'R12RpPwEux94hCH3WFe2njWFFqwsjo1ZHQrfkwBm');
$(function(){
	/*------initialize jquery widgets ---------*/

	$('ul#tabs li').click(function(e){
		if (!$(this).hasClass("active")) {
            var tabNum = $(this).index();
            var nthChild = tabNum+1;
            $("ul#tabs li.active").removeClass("active");
            $(this).addClass("active");
            $(".search-tabs div.active").addClass("hide-totally");
            $(".search-tabs div.active").removeClass("active");

            $(".search-tabs div:nth-child("+nthChild+")").addClass("active");
            $(".search-tabs div:nth-child("+nthChild+")").removeClass("hide-totally");
        }
	});

    

	
	/*----- kick things off by creating THE AP -------*/
	 new app.AppView();	


});




