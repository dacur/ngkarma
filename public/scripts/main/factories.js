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

app.factory('PostContentFactory',function()
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
        }
    };
});