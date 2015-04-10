var app = angular.module('coveApp', []);

//options.api.base_url = 'http://localhost:3000/api'

/* Constants - begin */

app.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
});

/* Constants - end */

/* App Config -begin */

app.config(['$httpProvider', '$locationProvider', function ($httpProvider, $locationProvider)
{
    //Attach token to the header
    $httpProvider.interceptors.push('tokenInterceptor');
}]);

/* App Config - end */

/* RootScope Init - begin */

app.run(function ($rootScope)
{
    // pass
});

/* RootScope - end */

/* Services - begin */

// Colony Services
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
            ColonyViz.formattedData.add_format("genderCheck", create_gender_format);
            ColonyViz.nodeLayout = layout_generations(ColonyViz.formattedData.get_hierarchy());
            update_view(ColonyViz.nodeLayout);
        }
    }
}]);

// Authentication Services
app.factory('authService', ['$http', 'tokenService', 'AUTH_EVENTS', function ($http, tokenService, AUTH_EVENTS)
{
    return {
        // Param user: { username: xxx, password: xxx }
        login: function (user)
        {
            return $http.post('/api/login', user);

            //$http.post('/api/login', user)
            //.success(function (data, status, headers, config)
            //{
            //    // Get the response of post and store it in the session
            //    tokenService.set(data.token);
            //    return AUTH_EVENTS.loginSuccess;
            //})
            //.error(function (data, status, headers, config)
            //{
            //    // Erase the token if the user fails to log in
            //    tokenService.destory();
            //    return AUTH_EVENTS.loginFailed;
            //});
        },

        logout: function ()
        {
            tokenService.destory();
            return AUTH_EVENTS.logoutSuccess;
        },

        verify: function ()
        {
            return $http.get('/api/verify');
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

    $scope.init = function()
    {
        if(tokenService.exist())
        {
            $scope.getColonyList();
        }
    }

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

        //switch(authService.login($scope.user))
        //{

        //}

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
        authService.verify()
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

    //Init Page
    $scope.init();
}]);

/* Controllers - end */

////////////////////////////////////////////////////////////////////////////////////////////////////////////

