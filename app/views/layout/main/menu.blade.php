@extends('layout.main.master')
@section('menu')

<div id="menubar" class="container-fluid">
    <div class="row">
        <div class="col-xs-3">
            <h3>SpreadIt</h3>
        </div>
        <div class="col-xs-9">
            <div class="menu-right">
                <div class="form-inline">
                    <form class="login" ng-submit="logIn()" ng-show="!isLoggedIn">
                        <img src="/resources/images/loading.gif" id="login-loading" ng-show="loading" />
                        <input class="form-control" type="text" id="user" ng-model="r_user" placeholder="reddit username" />
                        <input class="form-control" type="password" id="pass" ng-model="r_pass" placeholder="reddit password" />
                        <input class="form-control" id="login-button" type="submit" value="log in"/>
                    </form>
                </div>
                <div ng-show="isLoggedIn">
                    <h3>Welcome, @{{name}}!</h3>
                </div>
            </div>
        </div>
    </div>
</div>
@stop