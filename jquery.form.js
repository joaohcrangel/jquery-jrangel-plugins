/**
 *
 * @name form
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

 		formValues:function() {

 			var t = this,
 				$form = $(t);

 			t.data = {};

			$.each($form.serializeArray(), function(){

				if(this.name.indexOf("[]") === -1) t.data[this.name] = this.value;

			});

			$form.find(".select2-container").each(function(){
				t.data[$(this).next("select").attr("name")] = $(this).next("select").select2("val");
			});

			return t.data;

 		},

 		formLoad:function(data) {

 			var t = this;
			var $form = $(t);

 			for (var item in data) {

 				var $element = $form.find('[name="'+item+'"]'),
 					element = $element[0];

 				if ($element.length === 1) {

	 				switch (element.tagName.toLowerCase()) {

	 					case 'input':
	 					switch (element.type.toLowerCase()) {
	 						case 'radio':
	 						case 'checkbox':
	 						$element.prop('checked', true).val(data[item]);
	 						break;

	 						default:
	 						$element.val(data[item]);
	 						break;
	 					}
	 					break;

	 					case 'select':
	 					$element.find(':selected').removeAttr('selected').prop('selected', false);
	 					if (data[item]) {
                $element.find('[value='+data[item]+']').attr('selected', 'selected').prop('selected', true);
            } else {
              $element.find(':disabled').removeAttr('disabled').prop('selected', true).prop('disabled', true);
            }
	 					break;

	 					case 'textarea':
	 					$element.html(data[item]);
	 					break;

	 				}

	 			} else if($element.length > 1) {

	 				$element.removeAttr('checked').prop('checked', false);
	 				if (data[item]) {
            $element.filter('[value='+data[item]+']').attr('checked', 'checked').prop('checked', true);
          } else {
            $element.find(':disabled').removeAttr('disabled').prop('selected', true).prop('disabled', true);
          }

	 			}

 			}

 			if ($.components !== undefined) {
 				$.components.init('iCheck');
 			}

 			return true;

 		},

		//pass the options variable to the function
 		form: function(options) {

			//Set the default values, use comma to separate the settings, example:
			var defaults = {
				debug:true,
				params:{},
				url:"",
				method:"POST",
				dataType:"json",
				resetForm:true,
				parentCls:"form-group",
				errorCls:"has-error",
				success:function(){},
				failure:function(r){ System.showError(r); },
				startAjax:function(){},
				validadeField:function(field){ return true; },
				alertError:function(msg){



				},
				alertSuccess:function(msg){



				},
				alertInfo:function(msg){



				}
			};

			var o =  $.extend(defaults, options);

    		return this.each(function() {

    			var t = this;

				var $form = $(t),
					$btn = $form.find('[type="submit"]'),
					btnText = $btn.text() || $btn.val()
					;

				if(!o.url && $form.attr("action")) o.url = $form.attr("action");

				if(o.debug === true) console.info("options", o);

				$btn.on("click", function(e){

					if(o.debug === true) console.info("click", e);

					e.preventDefault();

					$btn.btnload("load");

					$form.find("."+o.errorCls).removeClass(o.errorCls);

					$form.find('[name]').each(function(){

						if(o.validadeField(this) === false){

							if(o.debug === true) console.info("validade field", this);
							$(this).closest("."+o.parentCls).addClass(o.errorCls);

						}

					});

					$form.find('[required]').each(function(){

						if(o.debug === true) console.info("required", this);

						var $element = $(this);

						switch(this.tagName){

							case "SELECT":
							if(!$element.find("option:selected").length){
								$element.closest("."+o.parentCls).addClass(o.errorCls);
							}
							break;

							default:
							if(!$element.val().length){
								$element.closest("."+o.parentCls).addClass(o.errorCls);
							}
							break;

						}

					});

					if($form.find("."+o.errorCls).length){

						o.alertError("Verifique os campos do formulário.");

						$btn.btnload("unload");

					}else{

						o.alertInfo("Enviando formulário...");

						t.data = {};

						$.each($form.serializeArray(), function(){

							if(this.name.indexOf("[]") === -1) t.data[this.name] = this.value;

						});

						if(o.params){

							t.data =  $.extend(t.data, o.params);

						}

						$form.find(".select2-container").each(function(){
							t.data[$(this).next("select").attr("name")] = $(this).next("select").select2("val");
						});

						if(o.debug === true) console.info("data 1", t.data);

						if(typeof o.startAjax === "function") o.startAjax(t.data);

						if (typeof o.beforeParams === 'function') t.data =  $.extend({}, o.beforeParams(t.data), t.data);

            if(o.debug === true) console.info("data 2", t.data);

						var data = $.param(t.data);

            if(o.debug === true) console.info("data 3", data);

						var datas = [];
						$form.find("[name*='[]']").each(function(){

							datas.push($(this).serialize());

						});

						if(data.length) data += "&";

						data += datas.join("&");

            if(o.debug === true) console.info("data 4", data);

            rest({
              $http: o.$http,
              url: o.url,
							method: o.method,
							data: data,
              success:function(r) {

                $btn.btnload("unload");
                if(typeof o.success === "function") o.success(r);

								if(o.resetForm === true){
									$form.find('[name]:not([data-no-reset-form])').each(function(){

										$(this).val('');

									});
								}

								o.alertSuccess("Formulário enviado com sucesso!");

								if(o.debug === true) console.info("success", r);

              },
              failure:function(e) {

  							$btn.btnload("unload");
                if(typeof o.failure === "function") o.failure(e);

              }
            });

					}

					return false;

				});

    		});
    	}
	});

})(jQuery);
