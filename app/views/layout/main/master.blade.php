<!doctype html>
<html lang="en" ng-app="MainApp">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no">

    <title>ngKarma</title>

    <!--Bootstrap CSS-->
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" />

    <!--FontAwesome.io-->
    <link href="//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet" />

    <!--Google Fonts-->
    <link href='http://fonts.googleapis.com/css?family=Cedarville+Cursive' rel='stylesheet' type='text/css' />
    <link href='http://fonts.googleapis.com/css?family=Play:400,700' rel='stylesheet' type='text/css' />

    <!--Main Stylesheet-->
    <link rel="stylesheet" href="/styles/main.css" type="text/css" />
    <link id="theme" rel="stylesheet" href="/styles/scheme-default.css" type="text/css" />
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

    <!--Angular ngSanitize-->
    <script src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.16/angular-sanitize.min.js"></script>

    <!--Main Angular Scripts-->
    <script src="/scripts/main/controllers.js"></script>
    <script src="/scripts/main/services.js"></script>
    <script src="/scripts/main/factories.js"></script>
    <script src="/scripts/main/directives.js"></script>

    <!--Masonry-->
    <script src="//cdnjs.cloudflare.com/ajax/libs/masonry/3.1.5/masonry.pkgd.min.js"></script>

    <!--Angular-Masonry Compatibility Library-->
    <script src="/bower_components_included/angular-masonry/angular-masonry.js"></script>

    <!--ImagesLoaded Library.-->
    <script src="/bower_components_included/imagesloaded/imagesloaded.js"></script>

    <!--Bootstrap UI-->
    <script src="//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.10.0/ui-bootstrap-tpls.min.js"></script>

</body>
</html>