<!doctype html>
<html lang="en" ng-app="MainApp">
<head>
    <meta charset="UTF-8">
    <title>SpreddIt - Just another way to reddit</title>

    <!--Bootstrap CSS-->
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">

    <!--FontAwesome.io-->
    <link href="//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">

    <!--Google Fonts-->
    <link href="http://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet" type="text/css">

    <!--Main Stylesheet-->
    <link rel="stylesheet" href="/styles/main.css">
</head>
<body ng-controller="MainCtrl" ng-cloak>

    <!--Load Menu-->
    @yield('menu')

    <!--Load main body-->
    @yield('main')

    <!--jQuery-->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>

    <!--AngularJS-->
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.15/angular.min.js"></script>

    <!--Main Angular Scripts-->
    <script src="/scripts/main/controllers.js"></script>
    <script src="/scripts/main/services.js"></script>
    <script src="/scripts/main/factories.js"></script>
    <script src="/scripts/main/directives.js"></script>

    <!--Masonry-->
    <script src="//cdnjs.cloudflare.com/ajax/libs/masonry/3.1.5/masonry.pkgd.min.js"></script>

    <!--Script to make Angular and Masonry function together-->
    <script src="/bower_components/angular-masonry/angular-masonry.js"></script>

    <!--Script to allow Masonry to wait until all images have loaded before reacting.-->
    <script src="/bower_components/imagesloaded/imagesloaded.js"></script>

</body>
</html>