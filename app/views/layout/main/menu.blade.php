@extends('layout.main.master')
@section('menu')

<div class="menubar" ng-cloak>
    <div class="menu">
        <div class="left">
            <span class="logo glyphicon glyphicon-arrow-up" ng-click="goTo('about')"></span>
            <span class="title" ng-click="goTo()">ngKarma</span>
            <span class="slogan" class="hide_small">see reddit faster</span>
        </div>
        <div class="right">
            <div ng-show="!loggedIn">
                <button class="btn btn-danger btn-connect" ng-click="authorizeAccount()" ng-show="!connecting">
                    <span class="hide_very_small">Connect to your Reddit account</span>
                    <span class="show_very_small">Connect</span>
                </button>
                <div class="connect-link" ng-show="connecting">
                    Connecting...
                </div>
            </div>
            <div id="welcome" ng-show="loggedIn">
                Welcome, @{{user.name}}! <span id="logout"><i class="fa fa-power-off" ng-click="deauthorizeAccount()"></i></span>
            </div>
        </div>
        <div class="color-selector hide_small">
            <div class="color default" ng-click="setTheme('default')"></div>
            <div class="color orangered" ng-click="setTheme('orangered')"></div>
            <div class="color greyscale" ng-click="setTheme('greyscale')"></div>
            <div class="color lightblue" ng-click="setTheme('lightblue')"></div>
        </div>
    </div>
</div>
<script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-52338584-1', 'auto');
    ga('send', 'pageview');

</script>
@stop