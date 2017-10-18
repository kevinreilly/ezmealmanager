var colyar_rm = {
	init: function(){
		this.nav();
		this.gauges();
		this.panels();
		this.controls();
	},
	nav: function() {
		// Primary Menu Animations
		var animationsDone = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
		$('.nav__toggle--open').click(function(){
			$('.sidenav').addClass('sidenav--open animated fadeIn');
			$('.sidenav__wrapper').addClass('animated slideInLeft');
		});
		$('.nav__toggle--close').click(function(){
			$('.sidenav__wrapper').toggleClass('slideInLeft slideOutLeft').one(animationsDone, function(){
				$(this).removeClass('slideOutLeft'); 
			});
			$('.sidenav').toggleClass('fadeIn fadeOut').one(animationsDone, function(){
				$(this).removeClass('sidenav--open fadeOut');
			});
		});
	},
	gauges: function(){
		// Dashboard Gauge Animations and Initialization
		var gaugeCounts = $('.gauge__count');
		var gaugeStyles = '';
		for (var i = 0; i < gaugeCounts.length; i++) {
			var gauge = $(gaugeCounts[i]);
			var risk_level = $(gauge).data('risk');
			var issues = $(gauge).data('issues');
			var gauge_bar = $(gauge).siblings('.gauge__bar')
			$(gauge_bar).addClass('gauge__bar--'+ risk_level);
			/*
			// This sets the progress of the gauge bar. This will be implemented later.
			var gauge_percent = 0;
			if (risk_level > 0) {
				gauge_percent += (issues/5) * 50;
				if (gauge_percent > 50) {
					gauge_percent = 50;
				}
				if (risk_level > 1) {
					gauge_percent += 50;
				}
			} else {
				gauge_percent += 100;
			}
			var gauge_rotation = 180 - ((gauge_percent/100) * 180);
			gaugeStyles += '.program:nth-of-type('+ (i+1) +') .gauge__bar:before{-webkit-transform:rotate(-'+ gauge_rotation +'deg) !important;transform:rotate(-'+ gauge_rotation +'deg) !important;}';
			*/
		}
		var gauge_scale = ($('.program__gauge__wrapper').width()) / 2;
		if (gauge_scale < 140) {
			var gauge_scale_small = gauge_scale * (2/3);
			$('<style>.program__gauge__wrapper{height:'+ (gauge_scale - 2) +'px !important;}.gauge__bar, .gauge__bar:before{border-radius:'+ gauge_scale +'px !important;border-width:'+ gauge_scale +'px !important;}.gauge__bar:before{top:-'+ gauge_scale +'px !important;left:-'+ gauge_scale +'px !important;}.gauge__bar:after{border-radius:'+ gauge_scale_small +'px !important;border-width:'+ gauge_scale_small +'px !important;top:-'+ gauge_scale_small +'px !important;left:-'+ gauge_scale_small +'px !important;}'+ gaugeStyles +'</style>').appendTo('head');
		} else {
			$('<style>'+ gaugeStyles +'</style>').appendTo('head');
		}
	},
	panels: function(){
		// Panels
		var panels = {
			panels: $('.panel'),
			init: function(){
				this.buildPanels(this.panels);
			},
			buildPanels: function(panels){
				if (panels.length > 0) {
					for (var i = 0; i < panels.length; i++) {
						var panel = $(panels[i]);
						if (panel.hasClass('panel--tabbed')) {
							// tabbed panel
							this.tabbedPanel.init(panel);
						} else {
							// regular panel
						}
					}
				} else {
					// no panels
				}
			},
			tabbedPanel: {
				panel: null,
				panel_tabs: null,
				panel_contents: null,
				init: function(panel){
					this.panel = panel;
					this.panel_tabs = panel.find('.panel__tab');
					this.panel_contents = panel.find('.panel__content');
					this.buildTabs(this.panel_tabs, this.panel_contents);
				},
				buildTabs: function(panel_tabs, panel_contents){
					if (panel_contents.length > 0) {
						this.showOnlyActiveTab(panel_tabs, panel_contents);
					}
					this.changeTab(panel_tabs, panel_contents);
				},
				showOnlyActiveTab: function(panel_tabs, panel_contents){
					if((window.location.search).includes('?tab=')){
						var activeTab = window.location.search;
					} else {
						var activeTab = null;
					}
					
					for (var j = 0; j < panel_contents.length; j++) {
						var panel_tab = $(panel_tabs[j]);
						var panel_content = $(panel_contents[j]);
						
						if(activeTab && activeTab.includes(panel_tab.data('tab'))){
							$('.panel__tab').removeClass('active');
							panel_tab.addClass('active');
						}
						
						if (panel_tab.hasClass('active')) {
							panel_content.show();
						} else {
							panel_content.hide();
						}
					}
					
				},
				changeTab: function(panel_tabs, panel_contents){
					var tabbedPanel = this;
					panel_tabs.click(function(){
						var selectedTab = $(this).data('tab');
						window.history.replaceState(null, null, "?tab="+ selectedTab);
						//var tab_index = $(this).prevAll().length;
						$(this).siblings().removeClass('active');
						$(this).addClass('active');
						tabbedPanel.showOnlyActiveTab(panel_tabs, panel_contents);
					});
				}
			}
		};
		panels.init();
	},
	controls: function(){
		var controls = {
			init: function(){
				this.thresholds.init();
				this.gauges.init();
			},
			thresholds: {
				init: function(){
					var toggles = $('.toggle_switch');
					for (var i = 0; i < toggles.length; i++) {
						var toggle = $(toggles[i]);
						if (toggle.find('input').attr('checked')) {
							toggle.find('span:first-of-type').addClass('toggle_wrapper--checked');
						} else {
							toggle.find('span:first-of-type').addClass('toggle_wrapper--unchecked');
						}
						toggle.find('span:first-of-type').addClass('toggle_wrapper');
						toggle.change(function(){
							$(this).find('.toggle_wrapper').toggleClass('toggle_wrapper--checked toggle_wrapper--unchecked');
						});
					}
					var thresholds = $('.threshold__slider');
					if (thresholds.length > 0) {
						var scaler = '0.3333333333rem';
						for (var i = 0; i < thresholds.length; i++) {
							var threshold = $(thresholds[i]);
							var threshold_value = threshold.data('value');
							threshold.val(threshold_value);
							threshold.parent().siblings('.threshold__value').find('.threshold__value__num').html(threshold_value);
							if (threshold.hasClass('threshold__slider--reverse')) {
								threshold.css({'background-size': (threshold_value + 100) +'% '+ scaler +', 100% '+ scaler});
							} else {
								threshold.css({'background-size': threshold_value +'% '+ scaler +', 100% '+ scaler});
							}
						}
						thresholds.on('input', function(){
							var slider_value = $(this).val();
							$(this).parent().siblings('.threshold__value').find('.threshold__value__num').html(slider_value);
							if ($(this).hasClass('threshold__slider--reverse')) {
								$(this).css({'background-size': (parseInt(slider_value) + 100) +'% '+ scaler +', 100% '+ scaler});
							} else {
								$(this).css({'background-size': slider_value +'% '+ scaler +', 100% '+ scaler});
							}
						});
						$('.threshold__help i').on('click', function(){
							$(this).parent().parent().siblings('.threshold__help__content').slideToggle();
						});
					};
				}
			},
			gauges: {
				init: function(){
					var gauges = $('.gauge__slider');
					if (gauges.length > 0) {
						var scaler = '0.3333333333rem';
						for (var i = 0; i < gauges.length; i++) {
							var gauge = $(gauges[i]);
							var gauge_value = gauge.data('value');
							var threshold_value = gauge.data('threshold');
							gauge.val(gauge_value);
							gauge.parent().siblings('.gauge__value').find('.gauge__value__num').html(gauge_value);
							if (gauge.hasClass('gauge__slider--reverse')) {
								gauge.css({'background-size': (gauge_value + 100) +'% '+ scaler +', '+ (threshold_value + 101) +'% '+ scaler +', 100% '+ scaler});
								gauge.siblings('span').css({'left':(threshold_value + 100) + '%'});
							} else {
								gauge.css({'background-size': (threshold_value - 1) +'% '+ scaler +', '+ gauge_value +'% '+ scaler +', 100% '+ scaler});
								gauge.siblings('span').css({'right':(100 - threshold_value) + '%'});
							}
						}
						gauges.on('input', function(){
							var threshold_value = $(this).data('threshold');
							if ($(this).hasClass('gauge__slider--reverse')) {
								var slider_value = Math.min($(this).val(), threshold_value);
								$(this).parent().siblings('.gauge__value').find('.gauge__value__num').html(slider_value);
								$(this).css({'background-size': (parseInt(slider_value) + 100) +'% '+ scaler +', '+ (parseInt(threshold_value) + 101) +'% '+ scaler +', 100% '+ scaler});
							} else {
								var slider_value = Math.max($(this).val(), threshold_value);
								$(this).parent().siblings('.gauge__value').find('.gauge__value__num').html(slider_value);
								$(this).css({'background-size': (threshold_value - 1) +'% '+ scaler +', '+ slider_value +'% '+ scaler +', 100% '+ scaler});
							}
							$(this).val(slider_value);
						});
						$('.gauge__help i').on('click', function(){
							$(this).parent().parent().siblings('.gauge__help__content').slideToggle();
						});
					};
				}
			}
		};
		controls.init();
	}
};