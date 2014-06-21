'use strict';

var app = angular.module('MainApp');

app.factory('MainFactory',function(DefaultSubService)
{
    return {
        cycleSubs: function(){
            var subs = DefaultSubService.defaultSubs;
            setInterval(function(){
                var n = Math.floor(Math.random()*subs.length+1);
                $('#sub').attr('placeholder','r/' + subs[n]);
            },1500);
        }
    }
});

app.factory('ImgurApi',function($http)
{
    return {
        getGallery: function(id){
            return $http({
                method: 'GET',
                url: '/api/imgur/gallery',
                params: {
                    id: id
                }
            });
        }
    }
});

app.factory('PostContent',function()
{
    return {
        getPostAge: function(p){
            var now = new Date();
            var post = new Date(p*1000);
            var days = Math.abs((now.getTime() - post.getTime())/86400000);
            if(Math.floor(days*24) < 1) // Less than one hour
                return Math.floor(days*24*60) + " minutes ago";
            if(Math.floor(days*24) == 1) // One hour
                return Math.floor(days*24) + " hour ago";
            if(Math.floor(days) < 1) // More than one hour, but not a day
                return Math.floor(days*24) + " hours ago";
            if(Math.floor(days) == 1) // One day
                return "Yesterday";
            if(Math.floor(days) > 1 && days/30 < 1) // More than one day, but not a month (30 days)
                return Math.floor(days) + " days ago";
            if(Math.floor(days/30) == 1) // One month
                return Math.floor(days/30) + " month ago";
            if(Math.floor(days/30) > 1 && Math.floor(days/365) < 1) // More than one month, but not a year
                return Math.floor(days/30) + " months ago";
            if(Math.floor(days/365) == 1) // One year
                return Math.floor(days/365) + " year ago";
            if(Math.floor(days/365) > 1) // More than one year
                return Math.floor(days/365) + " years ago";
            return "In the past";
        },

        getYouTubeVideoId: function(dom,url){
            var video_id;
            if(/youtube.com/.test(dom))
                video_id = url.match(/[^a-zA-Z0-9]v=([a-zA-Z0-9-_]+)/);
            else if(/youtu.be/.test(dom))
                video_id = url.match(/youtu\.be\/([a-zA-Z0-9-_]+)/);
            if(video_id != undefined && video_id.length > 1)
                return video_id[1];
            return false;
        },

        getImgurThumb: function(url){
            return url.replace(/(\.[a-zA-Z0-9]+)$/,"m$1");
        },

        htmlEntities: function(str) {
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        },

        stripHttps: function(url){
            if(/^https:/i.test(url))
                return url.replace(/^https/i,'http');
            return url;
        }
    };
});

app.factory('PostType',function(){
    return {
        // Check if post is direct link to Imgur image.
        isImgurImage: function(url){
            return /imgur\.com.*\.(jpg|jpeg|png)$/i.test(url);
        },

        // Check if post content is direct image link.
        isImage: function(url){
            return /\.(jpg|png|gif)$/i.test(url);
        },

        isImgur: function(dom){
            return dom == 'imgur.com';
        },

        // Check if post is Imgur Image by ID.
        isImgurImageId: function(url){
            return /imgur.com\/[a-zA-Z0-9-]+$/i.test(url);
        },

        // Check if post is Imgur Gallery.
        isImgurGalleryId: function(url){
            return /imgur.com\/gallery/i.test(url);
        },

        // Check if post is Imgur Gallery.
        isImgurAlbumId: function(url){
            return /imgur.com\/a\//i.test(url);
        },

        // Check if post is YouTube video link.
        isYouTube: function(dom, url){
            return (/youtube\.com/i.test(dom) && /watch/.test(url)) || /youtu\.be/.test(dom);
        }
    }
});