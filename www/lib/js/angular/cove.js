var app = angular.module('coveApp', []);

//options.api.base_url = 'http://localhost:3000/api'

app.run(function ($rootScope)
{
    // pass
});

app.factory('authService', function ($http, $window)
{
    return {
        isAnonymus: true,

        setToken: function (value)
        {
            $window.sessionStorage.token = value;
        },

        getToken: function ()
        {
            return $window.sessionStorage.token;
        },

        destoryToken: function ()
        {
            if ($window.sessionStorage.token) delete $window.sessionStorage.token;
        },

        // Param user: { username: xxx, password: xxx }
        login: function (user)
        {
            return $http.post('/api/login', user);
        },

        logout: function ()
        {

        },

        check: function ()
        {
            return $http.get('/api/check');
        }
    }
});

app.factory('tokenInterceptor', ['$window', function ($window)
{
    return {
        request: function (config)
        {
            if ($window.sessionStorage.token) {
                config.headers.token = $window.sessionStorage.token;
            }
            return config;
        }
    }
}]);

app.config(['$httpProvider', function ($httpProvider)
{
    $httpProvider.interceptors.push('tokenInterceptor');
}]);

app.controller('bodyController', ['$scope', '$location', 'authService', function ($scope, $location, authService)
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
        authService.destoryToken();
    };

    // Methods
    $scope.login = function ()
    {
        if (authService.getToken())
        {
            $scope.hideAuthForm();
            return;
        }

        authService.login($scope.user)
        .success(function (data, status, headers, config)
        {
            // Get the response of post and store it in the session
            authService.setToken(data.token);
            authService.isAnonymus = false;
            $scope.signin_message = 'Welcome!';
            console.log(authService.getToken());
            // This is in BodyController
            $scope.hideAuthForm();
        })
        .error(function (data, status, headers, config)
        {
            // Erase the token if the user fails to log in
            authService.destoryToken();
            $scope.signin_message = 'Error: Invalid user or password';
        });
    };

    $scope.check = function ()
    {
        // Post the token back to the server, in which it will be decoded
        authService.check()
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

