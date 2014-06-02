'use strict';

var app = angular.module('MainApp');

app.service('brickService',function(){
    return {
        createBrick: function(data){
            return '<div class="masonry-brick brick">\
                <div class="title">' + data.title + '</div>\
                <div class="content">\
                    <!-- If image, display it here. -->\
                    <img ng-if="isImage(' + data.url + ')" id="contentImage" src="' + data.url + '" />\
                    <!-- If link to imgur page, refer to image directly. -->\
                    <img ng-if="isImgur(' + data.url + ') && !isImage(' + data.url + ')" id="contentImage" src="' + data.url + '.jpg" />\
                    <!-- If self post, post the text. -->\
                    <div ng-if="isSelf(' + data.selftext + ') && !isImgur(' + data.url + ') && !isImage(' + data.url + ')" id="contentText"\
                    ng-body-html-unsafe="test">' + data.selftext + '</div>\
                    <!-- Otherwise, try to screenshot the link destination. -->\
                    <img ng-if="!isImage(' + data.url + ') && !isImgur(' + data.url + ') && !isSelf(' + data.selftext + ')"\
                    id="contentImage" src="http://immediatenet.com/t/l?Size=1024x768&URL=' + data.url + '" />\
                </div>\
                <div class="info">\
                    <div class="left">\
                        <strong>' + data.author + '</strong><br/>\
                    On: ' + data.created + '<br/>\
                    Comments:\
                        <a href="http://www.reddit.com' + data.permalink + '" target="_blank">' + data.num_comments + '</a>\
                    </div>\
                    <div class="right">\
                        <img src="/resources/images/upvote.png" /> ' + data.ups + '<br/>\
                        <img src="/resources/images/downvote.png" /> ' + data.downs + '<br/>\
                    Points: ' + data.score + '\
                    </div>\
                </div>\
            </div>';
        }
    }
});