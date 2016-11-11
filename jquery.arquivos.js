/**
 *
 * @name arquivos
 * @version 0.1
 * @requires jQuery v1.7+
 * @author João Rangel
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, buy TopSundue:
 *
 */
$.arquivos = (function(){

    return function(config){

      return new (function(config){

        var t = this;
        //Set the default values, use comma to separate the settings, example:
  			var defaults = {
  				debug:true,
  				success:function(){},
  				failure:function(){},
  				upload:true,
          multiple:false,
          type:"image/*",
          title:"Selecionar Imagens..."
  			};

  			var o =  $.extend(defaults, config);

        var modalID = "modal-arquivos-"+new Date().getTime();
        var $modal;

        var tpl = {
          modal:Handlebars.compile(
            '<div class="modal modal-media modal-primary fade example-modal-lg" aria-hidden="true" aria-labelledby="{{id}}Large" role="dialog" tabindex="-1" id="{{id}}">'+
              '<div class="modal-dialog modal-lg">'+
                '<div class="modal-content">'+
                  '<div class="modal-header">'+
                    '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
                      '<span aria-hidden="true">×</span>'+
                    '</button>'+
                    '<h4 class="modal-title" id="exampleOptionalLarge">{{title}}</h4>'+
                  '</div>'+
                  '<div class="modal-body panel media-list margin-bottom-30 is-grid" style="min-height:200px">'+
                    '<ul class="blocks blocks-100 blocks-xlg-6 blocks-lg-6 blocks-md-6 blocks-ms-2 blocks-xs-2"></ul>'+
                  '</div>'+
                  '<div class="modal-footer">'+
                    '<button type="button" class="btn-raised btn btn-success btn-upload pull-left">'+
                      '<i class="front-icon wb-upload animation-scale-up" aria-hidden="true"></i>'+
                    '</button>'+
                    '<button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>'+
                    '<button type="button" class="btn btn-primary">Selecionar</button>'+
                  '</div>'+
                '</div>'+
              '</div>'+
            '</div>'
          ),
          file:Handlebars.compile(
            '<li class="animation-scale-up" style="animation-fill-mode: backwards; animation-duration: 250ms; animation-delay: 0ms;">'+
              '<div class="media-item">'+
                '<div class="checkbox-custom checkbox-primary checkbox-lg multi-select">'+
                  '<input type="checkbox" id="media_1">'+
                  '<label for="media_1"></label>'+
                '</div>'+
                '<div class="image-wrap">'+
                  '<img class="image img-rounded" src="{{desdirname}}/{{desfilename}}_thumb.{{desextensao}}">'+
                '</div>'+
                '<div class="info-wrap">'+
                  '<div class="dropdown">'+
                    '<span class="icon wb-settings dropdown-toggle" data-toggle="dropdown" aria-expanded="false" role="button"></span>'+
                    '<ul class="dropdown-menu" role="menu">'+
                      '<li><i class="icon wb-download" aria-hidden="true"></i>Download</li>'+
                      '<li><i class="icon wb-trash" aria-hidden="true"></i>Delete</li>'+
                    '</ul>'+
                  '</div>'+
                  '<div class="title">{{desbasename}}</div>'+
                  '<div class="time">{{desdtcadastro}}</div>'+
                  '<div class="media-item-actions btn-group">'+
                    '<button class="btn btn-icon btn-pure btn-default" data-original-title="Download" data-toggle="tooltip" data-container="body" data-placement="top" data-trigger="hover" type="button">'+
                      '<i class="icon wb-download" aria-hidden="true"></i>'+
                    '</button>'+
                    '<button class="btn btn-icon btn-pure btn-default" data-original-title="Delete" data-toggle="tooltip" data-container="body" data-placement="top" data-trigger="hover" type="button">'+
                      '<i class="icon wb-trash" aria-hidden="true"></i>'+
                    '</button>'+
                  '</div>'+
                '</div>'+
              '</div>'+
            '</li>'
          )
        };

        t.getModal = function(){

          $modal = $(tpl.modal({
            id:modalID,
            title:o.title
          }));

          $modal.find(".btn-upload").on("click", function(){

            $.upload({
              url:PATH+"/admin/arquivos",
              autoOpen:true,
              success:function(r){

                t.insertList(t.getElementFromData(r.data));

              }
            });

          });

          $modal.on('shown.bs.modal', function (e) {

            if (typeof $.components === 'object') $.components.init("panel");
            $modal.find(".media-list").css({
              'height':($('body').height()-150)+"px",
              'overflow':'auto'
            });
            t.getFiles();

          });

          $modal.on('hidden.bs.modal', function (e) {

            $modal.remove();

          });

          return $modal;

        };

        t.getFiles = function(){

          if (typeof $.components === 'object') $modal.find('.panel').data('panel-api').load();

          rest({
            url:PATH+"/admin/arquivos",
            data:{
              type:o.type
            },
            success:function(r){

              if (typeof $.components === 'object') $modal.find('.panel').data('panel-api').done();
              t.render(r.data);

            },
            failure:function(r){
              if (typeof $.components === 'object') $modal.find('.panel').data('panel-api').done();
              System.showError(r);
            }
          });

        };

        t.getElementFromData = function(data){

          var $li = $(tpl.file(data));

          $li.data("file", data);

          $li.find("img").on("error", function(){

            $(this).attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA6wAAAKACAIAAAAXQGLqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3NzgzMDUyOTIwOUIxMUU1QkFDNEU3NDlBNDVBNEE2QyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3NzgzMDUyQTIwOUIxMUU1QkFDNEU3NDlBNDVBNEE2QyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjc3ODMwNTI3MjA5QjExRTVCQUM0RTc0OUE0NUE0QTZDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjc3ODMwNTI4MjA5QjExRTVCQUM0RTc0OUE0NUE0QTZDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+f1c9VQAACmpJREFUeNrs1kEBAAAEwED0r6eBAhoI4i7CXsueDQAA+KQkAADABAMAgAkGAAATDAAAJhgAAEwwAACYYAAAMMEAAGCCAQDABAMAgAkGAAATDAAAJhgAAEwwAACYYAAAMMEAAJhgAAAwwQAAYIIBAMAEAwCACQYAABMMAAAmGAAATDAAAJhgAAAwwQAAYIIBAMAEAwCACQYAABMMAAAmGAAAEwwAACYYAABMMAAAmGAAADDBAABgggEAwAQDAIAJBgAAEwwAACYYAABMMAAAmGAAADDBAABgggEAwAQDAGCCAQDABAMAgAkGAAATDAAAJhgAAEwwAACYYAAAMMEAAGCCAQDABAMAgAkGAAATDAAAJhgAAEwwAACYYAAATDAAAJhgAAAwwQAAYIIBAMAEAwCACQYAABMMAAAmGAAATDAAAJhgAAAwwQAAYIIBAMAEAwCACQYAABMMAIAJBgAAEwwAACYYAABMMAAAmGAAADDBAABgggEAwAQDAIAJBgAAEwwAACYYAABMMAAAmGAAADDBAABgggEAwAQDAGCCAQDABAMAgAkGAAATDAAAJhgAAEwwAACYYAAAMMEAAGCCAQDABAMAgAkGAAATDAAAJhgAAEwwAACYYAAATDAAAJhgAAAwwQAAYIIBAMAEAwCACQYAABMMAAAmGAAATDAAAJhgAAAwwQAAYIIBAMAEAwCACQYAABMMAIAJBgAAEwwAACYYAABMMAAAmGAAADDBAABgggEAwAQDAIAJBgAAEwwAACYYAABMMAAAmGAAADDBAABgggEAMMEAAGCCAQDABAMAgAkGAAATDAAAJhgAAEwwAACYYAAAMMEAAGCCAQDABAMAgAkGAAATDAAAJhgAAEwwAAAmGAAATDAAAJhgAAAwwQAAYIIBAMAEAwCACQYAABMMAAAmGAAATDAAAJhgAAAwwQAAYIIBAMAEAwCACQYAwAQDAIAJBgAAEwwAACYYAABMMAAAmGAAADDBAABgggEAwAQDAIAJBgAAEwwAACYYAABMMAAAmGAAADDBAABgggEAMMEAAGCCAQDABAMAgAkGAAATDAAAJhgAAEwwAACYYAAAMMEAAGCCAQDABAMAgAkGAAATDAAAJhgAAEwwAAAmGAAATDAAAJhgAAAwwQAAYIIBAMAEAwCACQYAABMMAAAmGAAATDAAAJhgAAAwwQAAYIIBAMAEAwCACQYAwAQDAIAJBgAAEwwAACYYAABMMAAAmGAAADDBAABgggEAwAQDAIAJBgAAEwwAACYYAABMMAAAmGAAADDBAACYYAAAMMEAAGCCAQDABAMAgAkGAAATDAAAJhgAAEwwAACYYAAAMMEAAGCCAQDABAMAgAkGAAATDAAAJhgAABMMAAAmGAAATDAAAJhgAAAwwQAAYIIBAMAEAwCACQYAABMMAAAmGAAATDAAAJhgAAAwwQAAYIIBAMAEAwBggiUAAMAEAwCACQYAABMMAAAmGAAATDAAAJhgAAAwwQAAYIIBAMAEAwCACQYAABMMAAAmGAAATDAAAJhgAAAwwQAAmGAAADDBAABgggEAwAQDAIAJBgAAEwwAACYYAABMMAAAmGAAADDBAABgggEAwAQDAIAJBgAAEwwAACYYAAATDAAAJhgAAEwwAACYYAAAMMEAAGCCAQDABAMAgAkGAAATDAAAJhgAAEwwAACYYAAAMMEAAGCCAQDABAMAYIIBAMAEAwCACQYAABMMAAAmGAAATDAAAJhgAAAwwQAAYIIBAMAEAwCACQYAABMMAAAmGAAATDAAAJhgAABMMAAAmGAAADDBAABgggEAwAQDAIAJBgAAEwwAACYYAABMMAAAmGAAADDBAABgggEAwAQDAIAJBgAAEwwAgAkGAAATDAAAJhgAAEwwAACYYAAAMMEAAGCCAQDABAMAgAkGAAATDAAAJhgAAEwwAACYYAAAMMEAAGCCAQDABAMAYIIBAMAEAwCACQYAABMMAAAmGAAATDAAAJhgAAAwwQAAYIIBAMAEAwCACQYAABMMAAAmGAAATDAAAJhgAABMMAAAmGAAADDBAABgggEAwAQDAIAJBgAAEwwAACYYAABMMAAAmGAAADDBAABgggEAwAQDAIAJBgAAEwwAgAkGAAATDAAAJhgAAEwwAACYYAAAMMEAAGCCAQDABAMAgAkGAAATDAAAJhgAAEwwAACYYAAAMMEAAGCCAQAwwQAAYIIBAMAEAwCACQYAABMMAAAmGAAATDAAAJhgAAAwwQAAYIIBAMAEAwCACQYAABMMAAAmGAAATDAAACYYAABMMAAAmGAAADDBAABgggEAwAQDAIAJBgAAEwwAACYYAABMMAAAmGAAADDBAABgggEAwAQDAIAJBgDABAMAgAkGAAATDAAAJhgAAEwwAACYYAAAMMEAAGCCAQDABAMAgAkGAAATDAAAJhgAAEwwAACYYAAAMMEAAGCCAQAwwQAAYIIBAMAEAwCACQYAABMMAAAmGAAATDAAAJhgAAAwwQAAYIIBAMAEAwCACQYAABMMAAAmGAAATDAAACYYAABMMAAAmGAAADDBAABgggEAwAQDAIAJBgAAEwwAACYYAABMMAAAmGAAADDBAABgggEAwAQDAIAJBgDABAMAgAkGAAATDAAAJhgAAEwwAACYYAAAMMEAAGCCAQDABAMAgAkGAAATDAAAJhgAAEwwAACYYAAAMMEAAJhgAAAwwQAAYIIBAMAEAwCACQYAABMMAAAmGAAATDAAAJhgAAAwwQAAYIIBAMAEAwCACQYAABMMAAAmGAAAEwwAACYYAABMMAAAmGAAADDBAABgggEAwAQDAIAJBgAAEwwAACYYAABMMAAAmGAAADDBAABgggEAwAQDAGCCJQAAwAQDAIAJBgAAEwwAACYYAABMMAAAmGAAADDBAABgggEAwAQDAIAJBgAAEwwAACYYAABMMAAAmGAAADDBAACYYAAAMMEAAGCCAQDABAMAgAkGAAATDAAAJhgAAEwwAACYYAAAMMEAAGCCAQDABAMAgAkGAAATDAAAJhgAABMMAAAmGAAATDAAAJhgAAAwwQAAYIIBAMAEAwCACQYAABMMAAAmGAAATDAAAJhgAAAwwQAAYIIBAMAEAwBgggEAwAQDAIAJBgAAEwwAACYYAABMMAAAmGAAADDBAABgggEAwAQDAIAJBgAAEwwAACYYAABMMAAAmGAAAEwwAACYYAAAMMEAAGCCAQDABAMAgAkGAAATDAAAJhgAAEwwAACYYAAAMMEAAGCCAQDABAMAgAkGAAATDACACQYAABMMAAAmGAAATDAAAJhgAAAwwQAAYIIBAMAEAwCACQYAABMMAAAmGAAATDAAAJhgAAAwwQAAYIIBAMAEAwBgggEAwAQDAIAJBgAAEwwAACYYAABMMAAAmGAAADDBAABgggEAwAQDAIAJBgAAEwwAACYYAABMMAAAmGAAAEwwAACYYAAAMMEAAGCCAQDABAMAgAkGAAATDAAAJhgAAEwwAACYYAAAMMEAAGCCAQDABAMAgAkGAAATDACACQYAgB9OAAEGAGwZB6q7exotAAAAAElFTkSuQmCC");

          });

        };

        t.render = function(items){

          t.clearList();

          $.each(items, function(index, item){

            t.insertList(t.getElementFromData(item));

          });

        };

        t.clearList = function(){

          return $modal.find("ul.blocks").html("");

        };

        t.insertList = function($element){

          return $modal.find("ul.blocks").preppend($element);

        };

        t.insertStyles = function(){

          if (!$('#style-jquery-arquivos').length) {
            $('head').append(
              '<style id="style-jquery-arquivos">'+
              '.modal-media .title{white-space:nowrap;overflow: hidden;text-overflow: ellipsis;} .modal-media .media-list.is-list .info-wrap .title,.modal-media .slidePanel .overlay-top{white-space:nowrap;overflow:hidden;text-overflow:ellipsis} .modal-media .checkbox-custom{margin-bottom:20px}.modal-media .actions-inner{border-bottom:1px solid #e4eaec}.modal-media .btn-outline.btn-default{z-index:2}.modal-media .blocks{margin-left:-5px;margin-right:-5px}.modal-media .blocks>li{padding-left:5px;padding-right:5px;margin-bottom:0}.modal-media .time{color:#a3afb7}.modal-media .media-list{padding:20px 30px;overflow:hidden}.modal-media .media-list .image-wrap>.image{max-width:100%}.modal-media .media-list .media-item-actions{display:none}.modal-media .media-list .media-item{cursor:pointer}.modal-media .media-list.is-grid .media-item{width:100%;padding:10px;margin-bottom:10px;border-radius:4px;border:1px solid transparent;position:relative;cursor:pointer}.modal-media .media-list.is-grid .media-item.item-active,.modal-media .media-list.is-grid .media-item.item-checked,.modal-media .media-list.is-grid .media-item:hover{border-color:#e4eaec;background-color:#f3f7f9}.modal-media .media-list.is-grid .media-item.item-active .dropdown,.modal-media .media-list.is-grid .media-item.item-checked .dropdown,.modal-media .media-list.is-grid .media-item:hover .dropdown{display:block}.modal-media .media-list.is-grid .media-item .checkbox-custom{position:absolute;margin:0;padding:0;top:9px;left:34px}.modal-media .media-list.is-grid .media-item .image-wrap{margin-bottom:10px;max-height: 60px;overflow: hidden;}.modal-media .media-list.is-grid .media-item .dropdown{float:right;display:none}.modal-media .media-list.is-grid .media-item .dropdown.open .dropdown-toggle,.modal-media .media-list.is-grid .media-item .dropdown.open .dropdown-toggle:hover{color:#526069}.modal-media .media-list.is-grid .media-item .dropdown-toggle{color:#a3afb7}.modal-media .media-list.is-grid .media-item .dropdown-menu .icon{margin-right:10px}.modal-media .media-list.is-grid .media-item .dropdown-menu>li>a{padding:3px 10px}.modal-media .media-list.is-list{padding-left:0;padding-right:0}.modal-media .media-list.is-list .blocks>li{width:100%}.modal-media .media-list.is-list .media-item{padding:20px 30px;position:relative;white-space:nowrap}.modal-media .media-list.is-list .media-item>div{display:inline-block}.modal-media .media-list.is-list .media-item:hover{background-color:#f3f7f9}.modal-media .media-list.is-list .media-item:hover .media-item-actions{display:block}.modal-media .media-list.is-list .media-item:after{content:"";display:block;border-bottom:1px solid #e4eaec;width:-webkit-calc(100% - 60px);width:calc(100% - 60px);position:absolute;left:30px;bottom:0}.modal-media .media-list.is-list .checkbox-custom{margin-right:30px}.modal-media .media-list.is-list .image-wrap{width:140px;height:100px;margin-right:20px;font-size:0}.modal-media .media-list.is-list .image-wrap:before{content:"";display:inline-block;height:100%;vertical-align:middle}.modal-media .media-list.is-list .info-wrap{vertical-align:top}.modal-media .media-list.is-list .dropdown{display:none}.modal-media .media-list.is-list .media-item-actions{margin-top:15px}.modal-media .media-list.is-list .media-item-actions .btn-icon{color:#a3afb7;margin-left:1px}.modal-media .slidePanel-header{height:350px;width:100%}.modal-media .slidePanel-header .slidePanel-actions{min-height:46px}.modal-media .slidePanel .overlay-background{background-color:rgba(38,50,56,.6)}.modal-media .slidePanel .media-header{position:relative;margin-bottom:20px}.modal-media .slidePanel .media-header:after,.modal-media .slidePanel .media-header:before{content:" ";display:table}.modal-media .slidePanel .media-header:after{clear:both}.modal-media .slidePanel .media-header .time{line-height:40px}.modal-media .slidePanel .media-header .share{float:right;display:inline-block}.modal-media .slidePanel .media-header .tags{display:inline-block}.modal-media .slidePanel .avatar{vertical-align:middle}@media (max-width:480px){.modal-media .is-list .info-wrap{display:block!important;padding-left:60px}.modal-media .is-list .info-wrap:after,.modal-media .is-list .info-wrap:before{content:" ";display:table}.modal-media .is-list .info-wrap:after{clear:both}.modal-media .is-list .media-item-actions{display:block;margin-top:5px}.modal-media .page-header .page-header-actions{margin-top:20px;position:relative;top:0;right:0;-webkit-transform:none;-ms-transform:none;-o-transform:none;transform:none}.modal-media .slidePanel .media-header .share{float:none;display:block;margin-top:20px}} .modal-media li img {width: 100%;}'+
              '</style>'
            );
          }

        };

        t.init = function(){

          t.insertStyles();
          t.getModal().modal('show');

        };

        t.init();

      })(config);

  }

})();
