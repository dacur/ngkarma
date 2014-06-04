@extends('layout.main.master')
@section('menu')
<div id="menubar" class="container-fluid">
    <div class="row">
        <div class="col-xs-3">
            <h3>Reddit Interface</h3>
        </div>
        <div class="col-xs-9">
            <div class="form-inline menu-right">
                <form class="login" ng-submit="logIn()" ng-show="!isLoggedIn">
                    <input class="form-control" id="user" ng-model="r_user" type="text" placeholder="reddit username" />
                    <input class="form-control" id="pass" ng-model="r_pass" type="password" placeholder="reddit password" />
                    <input class="form-control" id="login-button" type="submit" value="log in"/>
                </form>
                <h3 ng-show="isLoggedIn">Welcome, @{{user.name}}!</h3>
            </div>
        </div>
    </div>
</div>
@stop