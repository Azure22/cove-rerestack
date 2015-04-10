var app = angular.module('coveApp', []);

//options.api.base_url = 'http://localhost:3000/api'

/* Constants - begin */

app.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    //Unauthenticated: 'auth-not-authenticated',
    Unauthorized: 'auth-not-authorized',
    Authorized: 'auth-authorized'
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
    //pass
});

/* RootScope - end */

/* Services - begin */

//Colony Services
app.factory('colonyService', ['$http', function ($http)
{
    return {

        getColonyList: function (callback)
        {
            $http.get('/api/colony/list')
            .success(function (data, status, headers, config)
            {
                callback(data.colonylist);
            })
            .error(function (data, status, headers, config)
            {
                console.log("Error!");
            });
        },

        //Param colony: { cid: xxx }
        getColonyData: function (colony, callback)
        {
            $http.post('/api/colony/data', colony)
            .success(function (data, status, headers, config)
            {
                if (data.colonydata[0].data) callback(data.colonydata[0].data);
                else console.log("Failed!");
            })
            .error(function (data, status, headers, config)
            {
                console.log("Error!");
            });
        },

        drawColony: function (data)
        {
            //console.log("!!");
            create_initial_view(initialize(data, "localhost"));
            ColonyViz.formattedData.add_format("genderCheck", create_gender_format);
            ColonyViz.nodeLayout = layout_generations(ColonyViz.formattedData.get_hierarchy());
            update_view(ColonyViz.nodeLayout);
        }
    }
}]);

//Authentication Services
app.factory('authService', ['$http', 'tokenService', function ($http, tokenService)
{
    return {
        //Param user: { username: xxx, password: xxx }
        login: function (user, callback)
        {
            $http.post('/api/login', user)
            .success(function (data, status, headers, config)
            {
                //Get the response of post and store it in the session
                tokenService.set(data.token);
                callback(data.message);
            })
            .error(function (data, status, headers, config)
            {
                //Erase the token if the user fails to log in
                tokenService.destory();
                callback(data.message);
            });
        },

        logout: function (callback)
        {
            $http.get('/api/logout')
            .success(function (data, status, headers, config)
            {
                tokenService.destory();
                callback(data.message);
            })
            .error(function (data, status, headers, config)
            {
                tokenService.destory();
                callback(data.message);
            });
        },

        verify: function (callback)
        {
            $http.get('/api/verify')
            .success(function (data, status, headers, config)
            {
                tokenService.set(data.token);
                callback(data.message);
            })
            .error(function (data, status, headers, config)
            {
                callback(data.message);
            });
        }
    }
}]);

//Token Services
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

//Token Interceptor
//To insert token into request headers. Backend authentication is based on this.
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

//Body controller
app.controller('bodyController', ['$scope', '$location', 'authService', 'AUTH_EVENTS', 'colonyService', function ($scope, $location, authService, AUTH_EVENTS, colonyService)
{
    //Attributes
    $scope.user = { username: '', password: '' };
    $scope.auth_display = 'none';
    $scope.signin_message = '';
    $scope.signup_message = '';

    //Methods
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

    $scope.init = function ()
    {
        authService.verify(function (message)
        {
            if (message == AUTH_EVENTS.Authorized) $scope.getColonyList();
            else $scope.logout();
        });
    };

    $scope.auth_events = function (result)
    {
        //console.log(result);
        switch (result) {
            case AUTH_EVENTS.loginSuccess:
                $scope.hideAuthForm();
                $scope.getColonyList();
                break;
            case AUTH_EVENTS.loginFailed:
                $scope.signin_message = "username or password invalid";
                break;
            case AUTH_EVENTS.logoutSuccess:
                $scope.showAuthForm();
                break;
        };
    };

    $scope.login = function ()
    {
        authService.login($scope.user, $scope.auth_events);
    };

    $scope.logout = function ()
    {
        authService.logout($scope.auth_events);
    };

    $scope.verify = function ()
    {
        //Post the token back to the server, in which it will be decoded and verified
        authService.verify(function (message)
        {
            $scope.signup_message = 'Check result: ' + message;
        });
    };

    //Colony Service Start

    $scope.colony_list = {};
    $scope.colony_data = {};

    $scope.getColonyList = function ()
    {
        colonyService.getColonyList(function (d)
        {
            $scope.colony_list = d;
        });
    }

    $scope.getColonyData = function (cid)
    {
        colonyService.getColonyData({ cid: cid }, function (d)
        {
            colonyService.drawColony(d);
        });
    }

    //Init Page
    $scope.init();
}]);

/* Controllers - end */

////////////////////////////////////////////////////////////////////////////////////////////////////////////

