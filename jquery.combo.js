/**
 *
 * @name combo
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
 		combo: function(options) {

 			//Set the default values, use comma to separate the settings, example:
			var defaults = {
				debug:false,
				url:'',
				multiple:false,
                tplHTML:'<option value="{{valueField}}">{{displayField}}</option>',
				size:1,
				valueField:null,
				displayField:null,
				checked:false,
				data:[],
                listeners:{
                    beforerenderitem:function(object){return object;},
                    afterrenderitem:function(object){return object;},
                    check:function(){},
                    uncheck:function(){},
                    ready:function(){}
                }
			};

			var o =  $.extend(defaults, options);

			return this.each(function() {

				if (this.tagName !== 'SELECT') {
					throw new Error("O plugin deve ser aplicado em uma tag select.");
				}
				
                var $select = $(this);
                var $selectFilter = $('<input class="input-hidden-focus" type="text" style="position:absolute; top:0; left:0; width:0; height:0; background: none; border: none; color: transparent; -webkit-appearance: none; -moz-appearance: none; appearance: none;">');
                var filterKey = [];

                function initSelect(){

                    $select.hide();

                    if (o.debug === true) console.log('$select', $select);

                    if (o.data.length > 0) {

                        if (o.debug === true) console.log('data', o.data);

                        $.each(o.data, function(index, object){

                            var $option = $('<option/>');

                            if (object.selected === true || object.checked === true) {
                                $option.attr('selected', 'selected');
                            }

                            if (!o.valueField) o.valueField = 'value';
                            if (!o.displayField) o.displayField = 'text';

                            $option.attr('value', object[o.valueField]);
                            $option.attr('data-'+o.displayField, object[o.displayField]);
                            $option.attr('data-'+o.valueField, object[o.valueField]);
                            $option.attr('data-vltotal', object.vltotal);
                            $option.attr('data-ch', object.QtCargaHoraria);
                            $option.data(object);
                            $option.text(object[o.displayField]);

                            $select.append($option);

                        });

                    }

                    o.data = [];

                    $select.find('option').each(function(index, element){

                        o.data.push($.extend($(element).data(), {
                            value:$(element).text(),
                            selected:($(element).attr('selected'))?true:false
                        }));

                    });

                   

                    $select.wrap('<div class="jrangel-combo"></div>');

                    var $container = $select.parents('.jrangel-combo');
                    var $containerParent = $container.parents(':first');

                    $containerParent.addClass('overflow-auto');
                    $container.append('<ul class="list-group"></ul>');

                    $.each(o.data, function(index, object){

                        if (o.debug === true) console.log('object', object);

                        if (typeof o.listeners.beforerenderitem === 'function') {
                            object = o.listeners.beforerenderitem(object, index);
                        }

                        if (o.displayField && typeof object[o.displayField] !== 'undefined') object.displayField = object[o.displayField];
                        if (o.valueField && typeof object[o.valueField] !== 'undefined') object.valueField = object[o.valueField];

                        var template = Handlebars.compile((o.tpl)?$(o.tpl).html():o.tplHTML);
                        var $li = $(template(object));

                        $li.data('dados', object);

                        $container.find("ul").append($li);

                        if (typeof o.listeners.afterrenderitem === 'function') {
                            o.listeners.afterrenderitem(object, index, $li);
                        }

                    });

                     if (o.checked === false) {

                        $select.show();
                        $containerParent.find('.list-group').remove();

                    } else {

                        if (typeof $.fn.iCheck === 'function') {

                            $container.find(':checkbox').iCheck({
                                checkboxClass: 'icheckbox_square',
                                radioClass: 'iradio_square',
                                increaseArea: '10%'
                            });

                            for ( var x in o.listeners ) {
                                switch(x){
                                    case 'check':
                                        if (typeof o.listeners[x] === 'function') {
                                            $container.find(':checkbox').on('ifChecked',function (){
                                                o.listeners.check(this, $(this).closest('li').data());
                                            });
                                        }
                                        break;
                                    case 'uncheck':
                                        if (typeof o.listeners[x] === 'function') {
                                            $container.find(':checkbox').on('ifUnchecked',function (){
                                                o.listeners.uncheck(this, $(this).closest('li').data());
                                            });
                                        }
                                        break;
                                }
                            }
                            
                            $container.find(':checkbox').on('ifChanged', function(event, a){

                                var $li = $(this).parents('li');
                                $li.trigger('click');

                            });

                            $container.find('li').on('click', function(){

                                $container.find('li.active').removeClass('active');
                                $(this).toggleClass('active');
                                $selectFilter.focus();

                                if (typeof o.listeners.select == "function" ) o.listeners.select(this, $(this).closest('li').data());

                            });

                        }

                    }

                }

                var timerCheckFilter;

                function setTimerCheckFilter(){

                    if (timerCheckFilter) {
                        clearTimeout(timerCheckFilter);
                        timerCheckFilter = undefined;
                    }

                    timerCheckFilter = setTimeout(function(){

                        if (timerCheckFilter) {
                            clearTimeout(timerCheckFilter);
                            timerCheckFilter = undefined;
                        }
                        checkFilter();

                    }, 250);

                }

                function checkFilter(){
                    var text = '';
                    $.each(filterKey, function(index, item){
                        text += item.value;
                    });

                    filterKey = [];

                    if ($container.filter(":visible").length > 0) {

                        var $result = $container.filter(":visible").find('li:startsWith("'+text+'")');

                        if ($result.length === 0) {
                            $result = $container.filter(":visible").find('li:Contains("'+text+'")');
                        }

                        if ($result.length > 0) {

                            var $li = $($result[0]).trigger('click');

                            $li.trigger('click');
                            $containerParent.scrollTop($li.prop('offsetTop'));                            

                        }

                    }

                }

                function initEvents(){

                    $selectFilter.appendTo('body');

                    $selectFilter.on('keyup', function(event){

                        var filterKeyNew = [];

                        $.each(filterKey, function(index, item){
                            if (index > 0) {
                                var ts = filterKey[index-1].timeStamp;
                            } else {
                                var ts = new Date().getTime();
                            }
                            if (ts - item.timeStamp <= 1000) {
                                filterKeyNew.push(item);
                            }
                        });

                        filterKey = filterKeyNew;

                        filterKey.push({
                            value:String.fromCharCode(event.keyCode),
                            timeStamp:event.timeStamp
                        });

                        setTimerCheckFilter();

                    });
                    
                    for ( var x in o.listeners ) {
                        switch(x){
                            case 'ready':
                            if (typeof o.listeners[x] === 'function') {
                                o.listeners.ready(this);
                            }
                                break;
                        }
                    }

                }

                (function init(){
                    
                    initEvents();

                    if (o.data.length > 0) {

                        initSelect();

                    } else if(o.url.length) {

                        $.store({
                            url:o.url,
                            success:function(data){
                                
                                o.data = data;
                                console.log('ajax', data);
                                initSelect();

                            },
                            failure:function(err){

                                if (typeof o.failure === 'function') o.failure(err);

                            }
                        });

                        initSelect();

                    }                    

                }());
                			
    		});
    		
    	}
	});
	
})(jQuery);