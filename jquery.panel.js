/**
 *
 * @name btnload
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
 		load: function(options) {

 			//Set the default values, use comma to separate the settings, example:
			var defaults = {
				debug:false
			};

			var o = $.extend({}, defaults, options);

    		return this.each(function() {
				
    			var panel = $(this).data('panel-api');
					
					panel.load();
			
    		});
    	},
			unload: function(options) {

 			//Set the default values, use comma to separate the settings, example:
			var defaults = {
				debug:false
			};

			var o = $.extend({}, defaults, options);

    		return this.each(function() {
				
    			var panel = $(this).data('panel-api');
					
					panel.done();
			
    		});
    	}
	});
	
})(jQuery);