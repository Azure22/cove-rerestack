var app = angular.module('coveApp', []);

//options.api.base_url = 'http://localhost:3000/api'

app.run(function ($rootScope)
{
    // pass
});

/* Services - begin */

// Colony services
app.factory('colonyService', ['$http', function ($http)
{
    return {
        getColonyList: function ()
        {
            return $http.get('/api/colonylist');
        },

        // Param colony: { cid: xxx }
        getColonyData: function (colony)
        {
            return $http.post('/api/colonydata', colony);
        },

        drawColony:function (data)
        {
            //console.log("!!");
            create_initial_view(initialize(data, "localhost"));
            CV.formattedData.add_format("genderCheck", create_gender_format);
            CV.nodeLayout = layout_generations(CV.formattedData.get_hierarchy());
            update_view(CV.nodeLayout);
        }
    }
}]);

// Authentication Services
app.factory('authService', ['$http', function ($http)
{
    return {
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
}]);

// Token Services
app.factory('tokenService', ['$window', function ($window)
{
    return {
        exist: function ()
        {
            if ($window.sessionStorage.token) return true;
            else return false;
        },

        set: function (value)
        {
            $window.sessionStorage.token = value;
        },

        get: function ()
        {
            return $window.sessionStorage.token;
        },

        destory: function ()
        {
            if ($window.sessionStorage.token) delete $window.sessionStorage.token;
        },
    }
}]);

// Token Interceptor
// To insert token into request headers. Backend authentication is based on this.
app.factory('tokenInterceptor', ['tokenService', function (tokenService)
{
    return {
        request: function (config)
        {
            if (tokenService.exist()) {
                config.headers.token = tokenService.get();
            }
            return config;
        }
    }
}]);

app.config(['$httpProvider', function ($httpProvider)
{
    $httpProvider.interceptors.push('tokenInterceptor');
}]);

/* Services - end */

/* Controllers - begin */

// Body controller
app.controller('bodyController', ['$scope', '$location', 'authService', 'tokenService', 'colonyService', function ($scope, $location, authService, tokenService, colonyService)
{
    // Attributes
    $scope.user = { username: '', password: '' };
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
        tokenService.destory();
    };

    // Methods
    $scope.login = function ()
    {
        if (tokenService.get())
        {
            $scope.hideAuthForm();
            return;
        }

        authService.login($scope.user)
        .success(function (data, status, headers, config)
        {
            // Get the response of post and store it in the session
            tokenService.set(data.token);
            $scope.signin_message = 'Welcome!';
            console.log(tokenService.get());
            // This is in BodyController
            $scope.hideAuthForm();
            $scope.getColonyList();
        })
        .error(function (data, status, headers, config)
        {
            // Erase the token if the user fails to log in
            tokenService.destory();
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

    //Colony Service Start

    $scope.colony_list = {};
    $scope.colony_data = {};

    $scope.getColonyList = function ()
    {
        colonyService.getColonyList()
        .success(function (data, status, headers, config)
        {
            $scope.colony_list = data.colonylist;
        })
    }

    $scope.getColonyData = function (cid)
    {
        colonyService.getColonyData({ cid: cid })
        .success(function (data, status, headers, config)
        {
            if (data.colonydata[0].data) colonyService.drawColony(data.colonydata[0].data);
        })
    }
}]);

/* Controllers - end */

////////////////////////////////////////////////////////////////////////////////////////////////////////////

