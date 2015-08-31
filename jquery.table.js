/**
 *
 * @name table
 * @version 0.1
 * @requires jQuery v1.7+
 * @author João Rangel
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, buy TopSundue:
 * 
 */
(function($){

 	$.fn.extend({ 
 		
		//pass the options variable to the function
 		table: function(options) {

			//Set the default values, use comma to separate the settings, example:
			var defaults = {
				debug:false,
				params:{},
				url:"",
				listeners:{},
				success:function(){},
				failure:function(){},
				startAjax:function(){}
			};
				
			var o =  $.extend(defaults, options);

    		return this.each(function() {

    			var t = this;
				var $table = $(t), $tbody = $table.find('tbody'), tplRow = Handlebars.compile($(o.tpl).html());

				$table.block();

				function render(data){

					$tbody.html('');

					$.each(data, function(index, row){

						var $tr = $(tplRow(row));

						if (typeof o.listeners === 'object') {

							for (var name in o.listeners) {

								switch (name) {
									case 'rowclick':
									$tr.on('click', function(event){

										if(
											!$(event.target).hasClass('dropdown-toggle')
											&&
											!$(event.target).parents('.dropdown-toggle').length
											&&
											!$(event.target).parents('.dropdown-menu').length
										) {

											event.preventDefault();
											event.stopPropagation();
											o.listeners[name]($tr);

										}

									});
									break;
								}

							}

						}

						$tbody.append($tr);

					});

					$table.unblock();

				}

				if (typeof o.startAjax === 'function') o.startAjax();

				rest({
					url:o.url,
					params:o.params,
					success:function(r){

						render(r.data);

					}
				});
				
				if ($(o.btnreload).length) {

					$(o.btnreload).btnrest({
						url:o.url,
						params:o.params,
						startAjax:o.startAjax,
						success:function(r){
							render(r.data);
						}
					});

				}
			
    		});

    	}

	});
	
})(jQuery);