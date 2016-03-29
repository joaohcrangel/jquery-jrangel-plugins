/**
 *
 * @name picker
 * @version 0.1
 * @requires jQuery v1.7+
 * @author João Rangel
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, buy TopSundue:
 * 
 */
$.picker = (function(){
	
	if (typeof Handlebars === 'object') {
		console.error("Handlebars is required.");
		throw new Error("Handlebars is required.");
	}
	
	return function(options){

		return new (function(options){
			
			if (!options.url) {
				switch (options.type) {
					case 'pessoa':
					options = $.extend({
						url:'/me/congregacao/pessoas',
						title:'Pessoas',
						itemTPL:Handlebars.compile(
							'<li class="list-group-item" data-valu="{{idpessoa}}">' +
								'<div class="media">' +
									'<div class="media-left">' +
										'<a class="avatar" href="javascript:void(0)">' +
											'<img class="img-responsive" src="{{desfoto}}" alt="{{despessoa}}">' +
										'</a>' +
									'</div>' +
									'<div class="media-body">' +
										'<h4 class="media-heading">{{despessoa}}</h4>' +
									'</div>' +
								'</div>' +
							'</li>'
						)
					}, options);
					break;
					case 'privilegio':
					options = $.extend({
						url:'/me/congregacao/privilegios',
						title:'Privilégios'
					}, options);
					break;
				}	
			}
			
			var id = 'id-'+new Date().getTime();

			var t = this, defaults = {
				debug:false,
				cache:true,
				valueField:'',
				displayField:'',
				url:'',
				multiple:false,
				itemTPL:Handlebars.compile(
					'<li class="list-group-item active" data-value="{{valueField}}">{{displayField}}</li>'
				),
				modalTPL:Handlebars.compile(
					'<div class="modal fade modal-fade-in-scale-up" id="modal'+id+'" aria-hidden="true" role="dialog" tabindex="-1">' +
							'<div class="modal-dialog">' +
								'<div class="modal-content">' +
									'<div class="modal-header">' +
										'<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
											'<span aria-hidden="true">×</span>' +
										'</button>' +
										'<h4 class="modal-title">{{title}}</h4>' +
									'</div>' +
									'<div class="modal-body">' +
										'<ul class="list-group list-group-full"></ul>' +
									'</div>' +
									'<div class="modal-footer">' +
										'<button type="button" class="btn btn-primary btn-block">Selecionar</button>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>'
				)
			};

			var o =  $.extend(defaults, options);

			t.init = function(){
				
				var $modalPicker = o.modalTPL(o);
				
			};
			
			t.init();

		})(o);

	};

})();