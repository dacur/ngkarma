'use strict';

var app = angular.module('RedirectApp',[]);

// Controller for sub form.
app.controller('RedirectCtrl',function($scope, $http, ApiService, CookieService){

    $scope.message = "Accessing your account...";

    $scope.init = function(state, code, error){
        if(error != null && error != "")
            $scope.message = "Error accessing your account.";
        else if(state != CookieService.getCookie('state'))
            $scope.message = "OAuth state error. Cannot continue.";
        else
        {
            ApiService.getTokens(code).then(function(response){
                console.log(response);
                if(response.data)
                {
                    var data = jQuery.parseJSON(response.data.match(/({.*})/)[1]);
                    if (data.access_token && data.refresh_token)
                    {
                        CookieService.setCookie("access_token", data.access_token, 1/24);
                        CookieService.setCookie("refresh_token", data.refresh_token, 1/24);
                        window.location.href = '/';
                    }
                    else if(data.error != undefined)
                    {
                        $scope.message = 'Error returned from API. Cannot continue.';
                    }
                    else $scope.message = 'Invalid data returned from API. Cannot continue.';
                }
                else $scope.message = 'No data returned from API. Cannot continue.';
            });
        }
    };
});
