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
                console.log(scope.post.title);
                scope.gallery_id = scope.post.url.match(/\/gallery\/([^/]+)/)[1];

                ImgurApi.getGallery(scope.gallery_id).success(function(response){
                    if(response.hasOwnProperty('status'))
                        if(response.status == 'GOOD' && response.images != undefined){
                            scope.gallery_images = response.images;
                            scope.template = '/templates/imgur_gallery.html';
                        }
                        else if(response.status == 'FAIL'){ /* TODO: do something here! */ }
                }).error(function(){
                    console.error('Error retrieving gallery id ' + id);
                });

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