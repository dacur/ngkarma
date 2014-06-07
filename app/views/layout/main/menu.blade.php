@extends('layout.main.master')
@section('menu')

<div id="menubar" class="container-fluid" ng-cloak>
    <div class="row">
        <div class="col-xs-6">
            <h3><i class="fa fa-reddit"></i> SpreddIt</h3>
        </div>
        <div class="col-xs-6">
            <div class="menu-right">
                <button class="btn btn-connect" ng-click="authorizeAccount()" ng-show="!connecting">
                    Connect with your Reddit Account!
                </button>
                <div id="connect-link" ng-show="!loggedIn">
                    <div ng-show="connecting">Connecting...</div>
                </div>
                <div id="welcome" ng-show="loggedIn">
                    Welcome, @{{user.name}}! <i class="fa fa-power-off" ng-click="deauthorizeAccount()"></i>
                </div>
            </div>
        </div>
    </div>
</div>
@stop