<!doctype html>
<html lang="en" ng-app="RedirectApp">
<head>
    <meta charset="UTF-8">
    <title>ngKarma - Accessing your account</title>

    <!--Bootstrap CSS-->
    <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">

    <!--FontAwesome.io-->
    <link href="//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">

    <!--Google Fonts-->
    <link href='http://fonts.googleapis.com/css?family=Ubuntu' rel='stylesheet' type='text/css'>

    <!--Redirect Stylesheet-->
    <link rel="stylesheet" href="/styles/redirect.css">

</head>
<body ng-controller="RedirectCtrl" ng-init="init('{{ Input::get('state') }}','{{ Input::get('code') }}','{{ Input::get('error') }}')" ng-cloak>

<div id="alien">
    <span id="arrow" class="glyphicon glyphicon-arrow-up"></span>
</div>
@{{message}}

<!--jQuery-->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>

<!--AngularJS-->
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.15/angular.min.js"></script>

<!--Main Angular Scripts-->
<script src="/scripts/redirect/redirect.js"></script>
<script src="/scripts/redirect/services.js"></script>

</body>
<script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-52338584-1', 'auto');
    ga('send', 'pageview');

</script>
</html>