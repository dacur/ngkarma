@extends('layout.main.master')
@section('menu')

<div id="menubar" class="container-fluid" ng-cloak>
    <div class="row">
        <div class="col-xs-3">
            <h3><i class="fa fa-reddit"></i> SpreadIt</h3>
        </div>
        <div class="col-xs-9">
            <div class="menu-right">
                <button class="btn btn-default" ng-click="authorizeAccount()" ng-show="!isLoggedIn">Use Reddit Acct.</button>
                <div id="welcome" ng-show="isLoggedIn">
                    Welcome, @{{name}}! <i class="fa fa-power-off" ng-click="deauthorizeAccount()"></i>
                </div>
            </div>
        </div>
    </div>
</div>
@stop