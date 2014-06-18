'use strict';

var app = angular.module('RedirectApp',[]);

// Controller for sub form.
app.controller('RedirectCtrl',function($scope, $http, ApiService, CookieService){

    $scope.message = "Talking to Reddit...";

    $scope.init = function(state, code, error){
        if(error != null && error != "")
            $scope.message = "Error accessing your account. Sorry. :(";
        else if(state != CookieService.getCookie('state'))
            $scope.message = "Authentication error. Oops. Please refresh and try again.";
        else
        {
            ApiService.getTokens(code).then(function(response){
                if(response.data)
                {
                    var data = jQuery.parseJSON(response.data.match(/({.*})/)[1]);
                    if (data.access_token && data.refresh_token)
                    {
                        $scope.message = "Phew, it worked!";
                        CookieService.setCookie('access_token', data.access_token, 1/24);
                        CookieService.setCookie('refresh_token', data.refresh_token, 1/24);
                        window.location.href = '/';
                    }
                    else if(data.error != undefined)
                        $scope.message = 'Error returned from API. Cannot continue.';
                    else $scope.message = 'Invalid data returned from API. Cannot continue.';
                } else $scope.message = 'No data returned from API. Cannot continue.';
            });
        }
    };
});
