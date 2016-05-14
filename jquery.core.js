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
$.jRangelCoreFn = (function(){

  var t = this;

  t.running = false;
  t.id = 0;
  t.debug = false;

  window.jRangel = {
    queue:[]
  };

  var defaults = {
    debug:false,
    method:'GET',
    data:$.param({}),
    beforeSend:function(){ if (System && typeof System.loadHeader === 'function') System.loadHeader(); },
    complete:function(){ if (System && typeof System.doneHeader === 'function') System.doneHeader(); },
    success:function(){},
    failure:function(){},
    dataType:'json',
    $http:null
  };

  t.isQueue = function(opts){

    var is = false, queue = t.getQueue();

    for (var i = queue.length - 1; i >= 0; i--) {
      if (
        queue[i].url === opts.url
        &&
        queue[i].data === opts.data
        &&
        queue[i].method === opts.method
      ) {
        is = true;
        break;
      }
    }

    return is;

  };

  t.getQueue = function(){

    return window.jRangel.queue;

  };

  t.addQueue = function(opts){

    if (t.debug === true) console.info('addQueue', opts);

    if (!t.isQueue(opts)) {

      t.id++;
      opts.id = t.id;

      opts = $.extend({}, defaults, opts || {});

      window.jRangel.queue.push(opts);

      if (!t.running) t.execute();

    }

  };

  t.removeQueueById = function(id, callback){

    if (t.debug === true) console.info('removeQueueById', id);

    var queue = t.getQueue(), newQueue = [], removed = {};

    for (var i = queue.length - 1; i >= 0; i--) {

      if (queue[i].id !== id) {
        newQueue.push(queue[i]);
      } else {
        removed = queue[i];
      }

    }

    window.jRangel.queue = newQueue;

    if (t.debug === true) console.warn('removed', removed);

    callback(removed);

  };

  t.rest = function(opts){

    if (t.debug === true) console.info('rest', opts);
    t.addQueue(opts);

  };

  t.execute = function(){

    if (t.debug === true) console.info('execute');

    if (window.jRangel.queue.length > 0) {

      t.running = true;

      var opts = window.jRangel.queue[0];

      switch (opts.method) {

          case "DELETE":
          case "PUT":
          opts.data = $.extend({}, {
              _METHOD:opts.method.toUpperCase()
          }, opts.data);
          opts.method = 'POST';
          break;

      }

      var successOpts = opts.success;
      var failureOpts = opts.failure;

      var success = function(){

        if (t.debug === true) console.info('success');

        t.running = false;
        t.removeQueueById(opts.id, function(){
          t.execute();
        });

        successOpts.apply(this, arguments);

      };

      opts.success = success;

      var failureCheckLogin = function(Error, callback){

        if (Error.errorCode === 403 && System && System.showLogin === 'function') {
          System.showLogin({
            success:function(response){
              rest(opts);
            }
          });
        } else {
          callback();
        }

      };

      var failure = function(r, a, b){

        if (t.debug === true) console.info('failure');

        t.running = false;

        var dataError = {
          success:false, 
          error:'Não foi possível executar está ação. Tente novamente mais tarde.'
        };

        if (typeof r.responseJSON === 'object') {
          dataError = r.responseJSON;
        } else if (typeof r.data === 'object') {
          dataError = r.data;
        }

        failureCheckLogin(dataError, function(){

          failureOpts(dataError, r);

          t.removeQueueById(opts.id, function(){
            t.execute();
          });

        });

      };

      if (typeof opts.$http === 'function') {

        opts.headers = { 
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        opts.data = $.param(opts.data);
        opts.$http(opts).then(function(r){

          if (typeof success === 'function') success(r.data, r);

        }, failure);

      } else {

        $.ajax(opts).fail(failure).done();

      }

    } else {

      if (t.debug === true) console.info('clear queue and stop');
      t.running = false;

    }

  };

});

$.jRangelCore = new $.jRangelCoreFn();

function rest(opts){

  $.jRangelCore.rest(opts);

}