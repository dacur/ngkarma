<!doctype html>
<html lang="en" ng-app="RedirectApp">
<head>
    <meta charset="UTF-8">
    <title>SpreadIt - Accessing your account</title>

    <!--Bootstrap CSS-->
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">

    <!--FontAwesome.io-->
    <link href="//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">

    <!--Google Fonts-->
    <link href='http://fonts.googleapis.com/css?family=Ubuntu' rel='stylesheet' type='text/css'>

</head>
<body ng-controller="RedirectCtrl" ng-init="init('{{ Input::get('state') }}','{{ Input::get('code') }}','{{ Input::get('error') }}')" ng-cloak>

@{{ message }}

<!--jQuery-->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>

<!--AngularJS-->
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.15/angular.min.js"></script>

<!--Main Angular Scripts-->
<script src="/scripts/redirect/redirect.js"></script>
<script src="/scripts/redirect/services.js"></script>

</body>
</html>