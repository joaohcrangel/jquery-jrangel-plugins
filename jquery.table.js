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
				success:function(){},
				failure:function(){},
				startAjax:function(){},
				validadeField:function(field){ return true; },
				alertError:function(msg){

					if(typeof toastr === "object") toastr.error(msg);

				},
				alertSuccess:function(msg){

					if(typeof toastr === "object") toastr.success(msg);

				},
				alertInfo:function(msg){

					if(typeof toastr === "object") toastr.info(msg);

				}
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

						$tbody.append($tr);

					});

					$table.unblock();

				}

				rest({
					url:o.url,
					success:function(r){

						render(r.data);

					}
				});
				
				if (o.btnreload) {

					$(o.btnreload).btnrest({
						url:o.url,
						success:function(r){
							render(r.data);
						}
					});

				}
			
    		});

    	}

	});
	
})(jQuery);