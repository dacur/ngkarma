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
            else if(PostType.isImgur(scope.post.domain)){
                scope.gallery_images = [];
                if(PostType.isImgurGalleryId(scope.post.url)){
                    scope.id = scope.post.url.match(/\/gallery\/([^/]+)/)[1];
                } else if(PostType.isImgurAlbumId(scope.post.url)){
                    scope.id = scope.post.url.match(/\/a\/([^/]+)/)[1];
                } else if(PostType.isImgurImageId(scope.post.url)){
                    scope.id = scope.post.url.match(/imgur.com\/([a-zA-Z0-9-]+)/)[1];
                } else {
                    console.error('No match for Imgur url ' + scope.post.url);
                    return false;
                }

                ImgurApi.getGallery(scope.id).success(function(response){
                    if(response.hasOwnProperty('status'))
                        if(response.status == 'GOOD' && response.images != undefined){
                            for(var i = 0; i < response.images.length; i++){
                                scope.gallery_images.push({
                                    id: response.images[i].id,
                                    title: PostContent.htmlEntities(response.images[i].title),
                                    description: PostContent.htmlEntities(response.images[i].description),
                                    link: response.images[i].link,
                                    thumb: PostContent.getImgurThumb(response.images[i].link)
                                });
                            }
                            scope.template = '/templates/imgur_gallery.html';
                        }
                        else if(response.status == 'FAIL')
                            scope.template = '/templates/external.html';

                }).error(function(){
                    console.error('Error retrieving gallery id ' + scope.id);
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