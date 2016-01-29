/**
 *
 * @name store
 * @version 0.1
 * @requires jQuery v1.7+
 * @author João Rangel
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, buy TopSundue:
 * 
 */
$.store = (function(){
	
	return function(options){

		return new (function(options){

			var t = this, defaults = {
				keyStorage:'sessionStore',
				cache:true,
				url:'',
				data:{},
				success:function(){},
				failure:function(){}
			};

			var o =  $.extend(defaults, options);

			if (!typeof sessionStorage === 'object') console.warn('O navegador nÃ£o suporte sessionStorage.');

			t.setItem = function(key, data) {

				var store = t.getStorage();

				store[key] = data;

				return t.setStorage(store);

			};

			t.setStorage = function(data) {

				return sessionStorage.setItem(o.keyStorage, JSON.stringify(data));

			};

			t.getStorage = function() {

				var storage = sessionStorage.getItem(o.keyStorage);
				var data = {};

				if (!storage) storage = '{}';

				try {

					data = $.parseJSON(storage);

				} catch(e) {

					t.setStorage({});

				}

				return data;

			};

			t.getItem = function(key) {

				var data = t.getStorage();

				//console.log('getItem', data);

				if (o.cache === true && data[key]) {

					if (typeof o.success === 'function') o.success(data[key]);

				} else {

					rest($.extend({}, o, {
						success:function(r){

							o.chace = true;
							t.setItem(key, r.data);
							t.getItem(key);

						},
						failure:function(r){
							if (typeof o.failure === 'function') o.failure(r.error || "A chave "+key+" nÃ£o existe.");
						}
					}));

				}

			};

			t.getItem(o.url);

		})(options);

	};

})();
