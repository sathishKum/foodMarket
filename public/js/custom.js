jQuery.noConflict();
jQuery(document).ready(function($) {
  
	"use strict";
  
	//Main Menu...
	$('#main-menu ul').superfish({
		delay:     200,	  
		cssArrows: false,
		animation: {opacity:'show',height:'show'},
		speed:	   'fast'
	});
  
	//Responsive Menu...
	$('#main-menu > ul').slicknav({
		label:        '',
	  	duration:     500,
	  	easingOpen:   'easeOutCubic',
	  	easingClose:  'easeInOutSine',
		closedSymbol: '+',
		openedSymbol: '-'
	});

	//Products CarouFred...
	if($('.caroufred_items').length > 0) {
		$('.caroufred_items').carouFredSel({
			responsive: true,
			auto: false,
			width: '100%',
			height: 'auto',
			scroll: 1,
			items: {
				width: 300,
				height: 'auto',
				visible: {
					min: 1,
					max: 3
				}
			},
			pagination: {
				container: ".products_pager"				
			}
		});
	}

	//Menus CarouFred...
	if($('.caroufred_menus').length > 0) {
		$('.caroufred_menus').carouFredSel({
			responsive: true,
			auto: false,
			width: '100%',
			scroll: 2,
			items: {
				width: 460,
				height: 'auto',
				visible: {
					min: 1,
					max: 2
				}
			},
			pagination: {
				container: ".menus_pager"				
			}
		});
	}
	
	//Reviews CarouFred...
	if($('.caroufred_reviews').length > 0) {
		$('.caroufred_reviews').carouFredSel({
			responsive: true,
			width: '100%',
			scroll: {
				fx: "crossfade"
			},
			auto: true,
			items: {
				height: 'auto',
				visible: {
					min: 1,
					max: 1
				}
			}
		});
	}
	
	//Contact Map...
	var $map = $('#footer_map, #contact_map');
	if( $map.length ) {
		$map.gMap({
			address: 'Iamdesigning, 1/52,3/53, Lal Bahadhur Colony,Shringar Nagar Road, Near Gopal Naidu School, Peelamedu, Coimbatore, TN 641004',
			zoom: 16,
			markers: [
				{ 'address' : 'Iamdesigning, 1/52,3/53, Lal Bahadhur Colony,Shringar Nagar Road, Near Gopal Naidu School, Peelamedu, Coimbatore, TN 641004' }
			]
		});
	}
	
	//Twitter Tweets...
	if($('.tweets_container').length > 0) {	
		$(".tweets_container").tweet({
			modpath: 'js/twitter/',
			username: "envato",
			count: 2,
			loading_text: "loading tweets...",
			template: "{time}{text}"
		});
	}
	
	//Tweets CarouFred...
	if($('.footer_tweets').length > 0) {
		$('.footer_tweets .tweet_list').carouFredSel({
			width: 'auto',
			height: 'auto',
			scroll: 1,
			direction: 'up',
			items: {
				height: 'auto',
				visible: {
					min: 1,
					max: 1
				}
			}
		});
	}
		
	//Donut Chart...
	$(".donutchart").each(function(){
		$(this).one('inview', function (event, visible) {
			if(visible === true) {
			   var $this = $(this);
			   var $bgColor =  ( $this.data("bgcolor") !== undefined ) ? $this.data("bgcolor") : "#5D18D6";
			   var $fgColor =  ( $this.data("fgcolor") !== undefined ) ? $this.data("fgcolor") : "#000000";
			   var $size = ( $this.data("size") !== undefined ) ? $this.data("size") : "140";
			   
			   $this.donutchart({'size': $size, 'fgColor': $fgColor, 'donutwidth': 10, 'bgColor': $bgColor });
			   $this.donutchart('animate');
			}
		});   
   });
	
	//Tabs...
	if($('ul.dt-sc-tabs').length > 0) {
		$('ul.dt-sc-tabs').tabs('> .dt-sc-tabs-content');
	}
  
	if($('ul.dt-sc-tabs-frame').length > 0){
		$('ul.dt-sc-tabs-frame').tabs('> .dt-sc-tabs-frame-content');
	}
  
	if($('.dt-sc-tabs-vertical-frame').length > 0){
		$('.dt-sc-tabs-vertical-frame').tabs('> .dt-sc-tabs-vertical-frame-content');
    
		$('.dt-sc-tabs-vertical-frame').each(function(){
			$(this).find("li:first").addClass('first').addClass('current');
			$(this).find("li:last").addClass('last');
	    });
    
		$('.dt-sc-tabs-vertical-frame li').click(function(){
			$(this).parent().children().removeClass('current');
			$(this).addClass('current');
		});
	}
  
	//Toggles...
	$('.dt-sc-toggle').toggle(function(){ $(this).addClass('active'); },function(){ $(this).removeClass('active'); });
	$('.dt-sc-toggle').click(function(){ $(this).next('.dt-sc-toggle-content').slideToggle(); });
	$('.dt-sc-toggle-frame-set').each(function(){
	  var $this = $(this),
		  $toggle = $this.find('.dt-sc-toggle-accordion');
	  
	  $toggle.click(function(){
		if( $(this).next().is(':hidden') ) {
		  $this.find('.dt-sc-toggle-accordion').removeClass('active').next().slideUp();
		  $(this).toggleClass('active').next().slideDown();
		}
		return false;
	  });
	  
	  //Activate First Item always
	  $this.find('.dt-sc-toggle-accordion:first').addClass("active");
	  $this.find('.dt-sc-toggle-accordion:first').next().slideDown();
	});
  
	//Tooltips...
	if($(".dt-sc-tooltip-bottom").length){
		$(".dt-sc-tooltip-bottom").each(function(){	$(this).tipTip({maxWidth: "auto"}); });
	}
  
	if($(".dt-sc-tooltip-top").length){
		$(".dt-sc-tooltip-top").each(function(){ $(this).tipTip({maxWidth: "auto",defaultPosition: "top"}); });
	}
  
	if($(".dt-sc-tooltip-left").length){
    	$(".dt-sc-tooltip-left").each(function(){ $(this).tipTip({maxWidth: "auto",defaultPosition: "left"}); });
	}
  
	if($(".dt-sc-tooltip-right").length){
    	$(".dt-sc-tooltip-right").each(function(){ $(this).tipTip({maxWidth: "auto",defaultPosition: "right"}); });
	}
  
	//Scroll toTop...
	$("a.scrollTop").each(function(){
		$(this).click(function(e){
			$("html, body").animate({ scrollTop: 0 }, 600);
			e.preventDefault();
		});
	});
	
	//SIDEBAR MENU ITEM...
	if($("#page-menu-sticky .menu-categories").length){
	
		$('#page-menu-sticky .menu-categories').onePageNav({
		  currentClass: 'current_page_item',
		  filter: ':not(.external)',
		  scrollOffset:150
		});
		
		$("#page-menu-sticky").sticky({ topSpacing: 0 });
	}	
});

//Progress Bars...
(function($){
	$(".dt-sc-progress").one('inview', function (event, visible) {
		var $this = $(this),
		pvalue = $this.find('.dt-sc-bar').attr('data-value');
		
		if (visible == true) {
			$this.find('.dt-sc-bar').animate({width: pvalue + "%"},600,function(){ $this.find('.dt-sc-bar-text').fadeIn(400); });
		}
	});
})(jQuery);