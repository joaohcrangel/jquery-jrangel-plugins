/**
 *
 * @name Core
 * @version 0.1
 * @requires jQuery v1.7+
 * @author João Rangel
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, buy TopSundue:
 * 
 */
function rest(opts){

    var opts = $.extend({}, {
    	debug:false,
        method:'GET',
        data:$.param({}),
        success:function(){},
        failure:function(){},
        dataType:'json',
        $http:null
    }, opts || {});

    switch (opts.method) {

        case "DELETE":
        case "PUT":
        opts.data = $.extend({}, {
            _METHOD:opts.method.toUpperCase()
        }, opts.data);
        opts.method = 'POST';
        break;

    }

    var success = opts.success;
    var failure = opts.failure;

    if (typeof opts.$http === 'function') {
    	if (opts.debug === true) console.log('AJAX WITH', '$http');
        opts.headers = { 
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        opts.data = $.param(opts.data);
    	opts.$http(opts).then(function(r){
    		if (typeof opts.success === 'function') opts.success(r.data, r);
    	}, opts.failure);
    } else {

    	if (opts.debug === true) console.log('AJAX WITH', '$.ajax');
        
        opts.success = function(r){

            success(r);

        };

        opts.failure = function(r){

            if (opts.debug === true) console.log('AJAX failure', r);

            if (typeof r.responseJSON === 'object') {
                failure(r.responseJSON, r);
            } else {
                failure({success:false}, r);
            }

        };
        
    	return $.ajax(opts).fail(opts.failure);
    }    

};