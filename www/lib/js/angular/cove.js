var app = angular.module('coveApp', []);

//options.api.base_url = 'http://localhost:3000/api'

app.run(function ($rootScope)
{
    // pass
});

app.factory('authService', function ($http)
{
    return {
        isLogged: false,

        // Param user: { username: xxx, password: xxx }
        login: function (user)
        {
            return $http.post('/api/login', user);
        },

        logout: function ()
        {

        },

        // Param token: { token: xxx }
        check: function (token)
        {
            return $http.post('/api/check', token);
        }
    }
});

app.controller('bodyController', ['$scope', '$location', '$window', 'authService', function ($scope, $location, $window, authService)
{
    // Attributes
    $scope.user = { username: 'hanxi2', password: '123' };
    $scope.auth_display = 'none';
    $scope.signin_message = '';
    $scope.signup_message = '';

    $scope.showAuthForm = function ()
    {
        $scope.signin_message = '';
        $scope.signup_message = '';
        $scope.auth_display = 'normal';
    };

    $scope.hideAuthForm = function ()
    {
        $scope.signin_message = '';
        $scope.signup_message = '';
        $scope.auth_display = 'none';
    };

    $scope.logout = function ()
    {
        if ($window.sessionStorage.token) {
            console.log('Ready to logout');
            delete $window.sessionStorage.token;
        }
        else {
            console.log('Not login yet');
        }
    };

    // Methods
    $scope.login = function ()
    {
        if ($window.sessionStorage.token)
        {
            $scope.hideAuthForm();
            return;
        }

        authService.login($scope.user)
        .success(function (data, status, headers, config)
        {
            // Get the response of post and store it in the session
            $window.sessionStorage.token = data.token;
            $scope.signin_message = 'Welcome!';

            console.log($window.sessionStorage);

            // This is in BodyController
            $scope.hideAuthForm();
        })
        .error(function (data, status, headers, config)
        {
            // Erase the token if the user fails to log in
            delete $window.sessionStorage.token;
            $scope.signin_message = 'Error: Invalid user or password';
        });
    };

    $scope.check = function ()
    {
        // Post the token back to the server, in which it will be decoded
        authService.check({ token: $window.sessionStorage.token })
        .success(function (data, status, headers, config)
        {
            $scope.signup_message = 'Check result: ' + data.result;
        })
        .error(function (data, status, headers, config)
        {
            $scope.signup_message = 'Check failed';
        });
    };
}]);

app.controller('colonyController', ['$scope', function ($scope)
{
    // pass
}]);

////////////////////////////////////////////////////////////////////////////////////////////////////////////

