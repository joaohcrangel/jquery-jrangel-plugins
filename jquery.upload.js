/**
 *
 * @name upload
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
 		upload: function(options) {

			//Set the default values, use comma to separate the settings, example:
			var defaults = {
				debug:false,
				url:"",
				onchange:true,
				autoOpen:false,
				success:function(){},
				failure:function(){},
				startAjax:function(){}
			};
				
			var o =  $.extend(defaults, options);

    		return this.each(function() {

    			if (o.debug === true) console.info("jquery upload init", this);
    			if (!o.url) {
    				console.error('Informe a URL que receberá o UPLOAD');
    			}

    			var t = this;
				var $input = $(t);
				var iframeName = "iframe-upload-"+new Date().getTime();
				var $iframe = $('<iframe name="'+iframeName+'" class="hide" width="1" height="1"></iframe>');

				$iframe.appendTo('body');
				$input.wrap('<form action="'+o.url+'" method="POST" enctype="multipart/form-data" target="'+iframeName+'"></form>');
				var $form = $input.parents('form');

				if (o.debug === true) {
					console.info('iframeName', iframeName);
					console.info('input', $input);
					console.info('iframe', $iframe);
					console.info('form', $form);
				}

				$iframe.on('load', function(){

					if (o.debug === true) console.warn("iframe load", $iframe);

					var r = $.parseJSON($iframe[0].contentDocument.body.innerText);

					if (r.success){

						if (o.debug === true) console.info("success", r);

						if (typeof o.success === 'function') o.success(r);

					} else {

						if (o.debug === true) console.info("failure", r);

						if (typeof o.failure === 'function') o.failure(r);

					}

				});

				if (o.onchange === true) {

					$input.on('change', function(){

						if (o.debug === true) console.warn("input change", $input);

						if (this.files.length) {

							if (typeof o.selectfiles === 'function') o.selectfiles(this.files);
							t.submit();

						}

					});

				}

				t.submit = function(){

					if (typeof o.startAjax === 'function') o.startAjax($input[0].files);

					console.log($form);

					$form.submit();

				};

				t.open = function(){

					$input.click();

				};

				if (o.autoOpen === true) t.open();

				$(t).data('api', t);
			
    		});

    	}

	});
	
})(jQuery);
$.upload = (function(){
	
	return function(options){

		return new (function(options){

			var tryRest = 0;
			var t = this, defaults = {
				debug:false,
				url:'',
				autoOpen:true,
				multiple:false,
				accept:"image/*",
				inputName:"arquivo",
				success:function(){},
				failure:function(r){System.showError(r);}
			};

			var o =  $.extend(defaults, options);

			var $inputFile = $('<input type="file" name="'+o.inputName+'" accept="'+o.accept+'">');

			if (o.multiple === true) {
				$inputFile.attr("multiple", "multiple");
			}

			$inputFile.upload(o);

			var api = $inputFile.data('api');

			return api;

		})(options);

	};

})();