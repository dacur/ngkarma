'use strict';

var app = angular.module('MainApp');

app.directive('brickContent', ['PostContent', 'PostType', 'ImgurApi', function(PostContent, PostType, ImgurApi){
    return {
        restrict: 'A',
        scope: {
            post: '=postData'
        },
        link: function(scope){
            if(PostType.isImgurImage(scope.post.url)){
                scope.post.large_thumbnail = PostContent.getImgurThumb(scope.post.url);
                scope.template = '/templates/imgur_image.html';
            }
            else if(PostType.isImgurGallery(scope.post.url)){
                scope.gallery_id = scope.post.url.match(/\/gallery\/([^/]+)/)[1];
                scope.gallery_images = ImgurApi.getGallery(scope.gallery_id);
                scope.template = '/templates/imgur_gallery.html';
            }
            else if(PostType.isImage(scope.post.url)){
                scope.template = '/templates/image.html';
            }
            else if(PostType.isYouTube(scope.post.domain,scope.post.url)){
                scope.video_id = PostContent.getYouTubeVideoId(scope.post.domain,scope.post.url);
                scope.template = '/templates/youtube.html';
            }
            else if(scope.post.is_self){
                scope.template = '/templates/self.html';
            }
            else scope.template = '/templates/external.html';
        },
        template: '<div ng-include="template"></div>'
    }
}]);