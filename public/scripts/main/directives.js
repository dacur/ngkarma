'use strict';

var app = angular.module('MainApp');

app.directive('brickContent', ['PostContentFactory', function(PostContentFactory){

    // Check if post content is direct image link.
    function isImage(url){
        return /jpg|png|gif$/i.test(url);
    }

    // Check if post is Imgur link.
    function isImgur(dom){
        return /imgur\.com/.test(dom);
    }

    // Check if post is YouTube video link.
    function isYouTube(dom, url){
        return (/youtube.com/.test(dom) && /watch/.test(url)) || /youtu.be/.test(dom);
    }

    // Check if post content is self post.
    function isSelf(self){
        return self != null && self != "";
    }

    return {
        restrict: 'A',
        scope: {
            post: '=postData'
        },
        link: function(scope){
            if(isImage(scope.post.url) && isImgur(scope.post.domain)){
                scope.post.url = PostContentFactory.getImgurThumb(scope.post.url);
                scope.template = '/templates/imgur_image.html';
            }
            else if(isImgur(scope.post.domain)){
                scope.template = '/templates/imgur_gallery.html';
            }
            else if(isYouTube(scope.post.domain,scope.post.url)){
                scope.template = '/templates/youtube.html';
            }
            else if(scope.post.is_self){
                scope.template = '/templates/self.html';
            }
            else if(!isImage(scope.post.url) && !isImgur(scope.post.domain)){
                scope.template = '/templates/external.html';
            }

        },
        template: '<div ng-include="template"></div>'
    }
}]);