@extends('layout.main.master')
@section('menu')

<div id="menubar" ng-cloak>
    <div id="menu">
        <div id="left">
            <span ng-click="goTo('about')"><i id="logo" class="fa fa-reddit"></i></span>
            <span id="title" ng-click="goTo()">ngReddit</span>
            <span id="slogan" class="hide_small">see reddit faster</span>
        </div>
        <div id="right">
            <div ng-show="!loggedIn">
                <button class="btn btn-danger btn-connect" ng-click="authorizeAccount()" ng-show="!connecting">
                    <span class="hide_very_small">Log in with your Reddit account!</span>
                    <span class="show_very_small">Log in!</span>
                </button>
                <div id="connect-link" ng-show="connecting">
                    Connecting...
                </div>
            </div>
            <div id="welcome" ng-show="loggedIn">
                Welcome, @{{user.name}}! <i class="fa fa-power-off" ng-click="deauthorizeAccount()"></i>
            </div>
        </div>
    </div>
</div>
@stop