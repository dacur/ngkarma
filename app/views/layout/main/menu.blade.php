@extends('layout.main.master')
@section('menu')

<div id="menubar" class="menubar" ng-cloak>
    <div class="menu">
        <div class="toggle-options hide_very_small" ng-click="toggleOptionsMenu()">
            <i class="fa fa-cog icon"></i>
        </div>
        <div class="toggle-options-mobile show_very_small" ng-click="toggleOptionsMenu()">
            <i class="fa fa-cog icon"></i>
        </div>
        <div class="left">
            <span class="title" ng-click="goTo()">ngK<i class="logo fa fa-chevron-up"></i>rma</span>
            <span class="slogan hide_small">see reddit faster</span>
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
                <span class="hide_very_small">Welcome, @{{user.name}}!</span>
                <span class="show_very_small">@{{user.name}}</span>
                <span id="logout"><i class="fa fa-power-off" ng-click="deauthorizeAccount()"></i></span>
            </div>
        </div>
        <div class="container-fluid options" ng-show="showOptions">
            <hr />
            <div class="row">
                <div class="col-md-4 col-sm-6 col-xs-12 option">
                    <label class="col-xs-12">Theme</label>
                    <div class="color default" ng-click="setTheme('default')"></div>
                    <div class="color orangered" ng-click="setTheme('orangered')"></div>
                    <div class="color greyscale" ng-click="setTheme('greyscale')"></div>
                    <div class="color lightblue" ng-click="setTheme('lightblue')"></div>
                </div>
                <div class="col-md-4 col-sm-6 col-xs-12 option hide_small">
                    <label class="col-xs-12">Horizontal Column Spacing</label>
                    <button class="btn btn-primary" ng-click="decreaseGutterWidth()"><i class="fa fa-minus-square"></i></button>
                    <button class="btn btn-primary" ng-click="increaseGutterWidth()"><i class="fa fa-plus-square"></i></button>
                </div>

                <!-- Work in progress -- hidden from view for now. -->
                <div ng-hide="1" class="col-md-4 col-sm-6 col-xs-12 option">
                    <label>Show NSFW Posts</label>
                    <input type="checkbox" ng-model="showNsfw" ng-checked="showNsfw" />
                </div>
            </div>
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