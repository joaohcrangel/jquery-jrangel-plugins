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
    
    opts = $.extend({}, {
    	debug:false,
      method:'GET',
      data:$.param({}),
      beforeSend:function(){ if (System && typeof System.loadHeader === 'function') System.loadHeader(); },
      complete:function(){ if (System && typeof System.doneHeader === 'function') System.doneHeader(); },
      success:function(){},
      failure:function(){},
      dataType:'json',
      $http:null
    }, opts || {});
  
  if (!window.setTimeoutRest) window.setTimeoutRest = {};

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

    if (typeof System === 'object' && System.ajaxExecution === true) {

        console.warn('Aguardando conclusão de execução em andamento...');
        window.setTimeoutRest[opts.url] = setTimeout(function(){
            if (window.setTimeoutRest[opts.url]) {
              clearTimeout(window.setTimeoutRest[opts.url]);
              window.setTimeoutRest[opts.url] = undefined;
            }
            rest(opts);
        }, 10000);

        return false;

    } else {
      
      if (typeof System === 'object') System.ajaxExecution = true;

      if (typeof opts.$http === 'function') {
        if (opts.debug === true) console.log('AJAX WITH', '$http');
          opts.headers = { 
              'Content-Type': 'application/x-www-form-urlencoded'
          };
          opts.data = $.param(opts.data);
        opts.$http(opts).then(function(r){
          if (window.setTimeoutRest[opts.url]) {
            clearTimeout(window.setTimeoutRest[opts.url]);
            window.setTimeoutRest[opts.url] = undefined;
          }
          if (typeof System === 'object') System.ajaxExecution = false;
          if (typeof opts.success === 'function') opts.success(r.data, r);
        }, opts.failure);
      } else {

        if (opts.debug === true) console.log('AJAX WITH', '$.ajax');
          
          opts.success = function(r){
            
              if (window.setTimeoutRest[opts.url]) {
                clearTimeout(window.setTimeoutRest[opts.url]);
                window.setTimeoutRest[opts.url] = undefined;
              }

              if (typeof System === 'object') System.ajaxExecution = false;
              success(r);

          };

          opts.failure = function(r){
            
              if (window.setTimeoutRest[opts.url]) {
                clearTimeout(window.setTimeoutRest[opts.url]);
                window.setTimeoutRest[opts.url] = undefined;
              }

              if (typeof System === 'object') System.ajaxExecution = false;

              if (opts.debug === true) console.log('AJAX failure', r);

              if (typeof r.responseJSON === 'object') {
                  if (r.responseJSON.errorCode === 403 && System && System.showLogin === 'function') {
                    System.showLogin({
                      success:function(r){
                        rest(opts);
                      }
                    });
                  }
                  failure(r.responseJSON, r);
              } else {
                  if (r.errorCode === 403 && System && System.showLogin === 'function') {
                    System.showLogin({
                      success:function(r){
                        rest(opts);
                      }
                    });
                  }
                  failure({success:false}, r);
              }

          };

        return $.ajax(opts).fail(opts.failure);
      }   
      
    }   

};