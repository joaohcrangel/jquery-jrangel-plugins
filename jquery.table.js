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
				tpl:'',
				success:function(){},
				failure:function(){},
				startAjax:function(){}
			};
			
			var o =  $.extend({}, defaults, options);

    		return this.each(function() {

    			var t = this;
				var 
					$table = $(t), 
					$tbody = $table.find('tbody'), 
					tplRow = Handlebars.compile($(o.tpl).html());

				if (typeof $table.data().opts === 'objects') {
					console.log('opts', $table.data().opts);
					o = table.data().opts;
				}

				t.load = function(){

					rest({
						url:o.url,
						params:o.params,
						success:function(r){

							t.render(r.data);

						}
					});

				};

				t.render = function(data){

					$tbody.html('');

					$.each(data, function(index, row){

						if (typeof o.listeners === 'object' && typeof o.listeners.beforerender === 'function') {

							var result = o.listeners.beforerender(t, row, index);
							if (typeof result === 'object') {
								row = result;
							}

						}	

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

											if(o.debug === true) console.log('rowclick', $tr);

											event.preventDefault();
											event.stopPropagation();
											o.listeners.rowclick($tr, event);
											return false;

										}

									});
									break;
									case 'rowdblclick':
									$tr.on('dblclick', function(event){

										if(o.debug === true) console.log('rowdblclick', $tr);

										event.preventDefault();
										event.stopPropagation();
										o.listeners.rowdblclick($tr, event);
										return false;
									});
									break;
									case 'btnclick':
									$tr.find('.btn, [role="menuitem"]').on('click', function(event){

										if(!$(this).hasClass('dropdown-toggle')){

											if(o.debug === true) console.log('btnclick', $tr);

											event.preventDefault();
											event.stopPropagation();
											o.listeners.btnclick($tr, $(event.delegateTarget).data(), event);
											return false;

										}

									});
									break;
									case 'checkclick':

										if ( typeof $.fn.iCheck == "function") {

											$tr.find(':checkbox').on('ifChecked', function(){
												o.listeners.checkclick($tr, row);
											});

										} else {

											$tr.find('[type=checkbox]').on('change', function(){
												if ( this.checked === true ) {
													o.listeners.checkclick($tr, row);
												}
											});

										}

									break;
									case 'uncheckclick':

										if ( typeof $.fn.iCheck === "function") {

											$tr.find(':checkbox').on('ifUnchecked', function(){
												o.listeners.uncheckclick($tr, row);
											});

										} else {

											$tr.find('[type=checkbox]').on('change', function(){
												if ( this.checked === false ) {
													o.listeners.uncheckclick($tr, row);
												}
											});

										}

									break;
								}

							}

						}

						if ( typeof $.fn.iCheck == "function" ) {

							$tr.find('[type=checkbox]').iCheck({
								checkboxClass: 'icheckbox_square',
								radioClass: 'iradio_square',
								increaseArea: '10%' // optional
							});

						}


						$tbody.append($tr);

					});

					if (typeof o.listeners === 'object' && typeof o.listeners.afterrender === 'function') {

						o.listeners.afterrender(t, $tbody);

					}

					$table.unblock();

				}

				$table.data('opts', o);

				$table.block();

				if (typeof o.startAjax === 'function') o.startAjax();

				t.load();
				
				if ($(o.btnreload).length) {

					$(o.btnreload).btnrest({
						url:o.url,
						params:o.params,
						startAjax:function(){
							$table.block();
							if (typeof o.startAjax === 'function') o.startAjax();
						},
						success:function(r){
							$table.unblock();
							t.render(r.data);
						},
						failure:function(r){
							$table.unblock();
							if (typeof o.failure === 'function') o.failure();
						}
					});

				}				

				$(t).data('api', t);
			
    		});

    	}

	});
	
})(jQuery);