@extends('layout.main.master')
@section('menu')

<div id="menubar" ng-cloak>
    <div id="menu">
        <div id="left" ng-click="getFrontPage()">
            <i class="fa fa-reddit"></i> SpreddIt
        </div>
        <div id="right">
            <div ng-show="!loggedIn">
                <button class="btn btn-danger btn-connect" ng-click="authorizeAccount()" ng-show="!connecting">
                    Log in with your Reddit account!
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