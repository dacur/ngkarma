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
                    <span class="option-name">Theme</span>
                    <i class="fa fa-square color default" ng-click="setTheme('default')"></i>
                    <i class="fa fa-square color orangered" ng-click="setTheme('orangered')"></i>
                    <i class="fa fa-square color greyscale" ng-click="setTheme('greyscale')"></i>
                    <i class="fa fa-square color lightblue" ng-click="setTheme('lightblue')"></i>
                </div>
                <div class="col-md-4 col-sm-6 col-xs-12 option hide_small">
                    <span class="option-name">Horizontal Column Spacing</span>
                    <span class="spacing-options">
                        <i class="fa fa-minus-square spacing" ng-click="decreaseGutterWidth()"></i>
                        <i class="fa fa-plus-square spacing" ng-click="increaseGutterWidth()"></i>
                    </span>
                </div>
                <div class="col-md-4 col-sm-6 col-xs-12 option">
                    <span class="option-name">Show NSFW Posts</span>
                    <input type="checkbox" ng-model="showNsfw" />
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