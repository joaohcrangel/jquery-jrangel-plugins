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

	function strip_tags(input, allowed) {

	  allowed = (((allowed || '') + '')
	    .toLowerCase()
	    .match(/<[a-z][a-z0-9]*>/g) || [])
	    .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
	  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
	    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
	  return input.replace(commentsAndPhpTags, '')
	    .replace(tags, function($0, $1) {
	      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
	    });
	}

 	$.fn.extend({ 
 		
		//pass the options variable to the function
 		btnload: function(action, options) {

 			//Set the default values, use comma to separate the settings, example:
			var defaults = {
				debug:false,
				wait:'<i class="fa fa-refresh fa-spin"></i> Aguarde...'
			};

			var o = $.extend({}, defaults, options);

    		return this.each(function() {
				
    			var $btn = $(this);

    			switch(action){

    				case "load":

    				var innerHTML = strip_tags($btn[0].innerHTML.trim());

    				if(innerHTML.length === 0){
	    				o.wait = '<i class="fa fa-refresh fa-spin"></i>';
	    			}

    				var html = $btn.html() || $btn.val();

    				$btn.data("html", html);

    				if($btn[0].tagName === "INPUT"){
						$btn.attr("disabled", "disabled").val(o.wait);
					}else{
						$btn.attr("disabled", "disabled").html(o.wait);
					}
    				break;

    				case "unload":
    				if($btn[0].tagName === "INPUT"){
						$btn.removeAttr("disabled").val($btn.data("html"));
					}else{
						$btn.removeAttr("disabled").html($btn.data("html"));
					}
    				break;

    			}
			
    		});
    	}
	});
	
})(jQuery);