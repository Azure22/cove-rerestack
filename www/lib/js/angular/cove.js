var app = angular.module('coveApp', []);

app.run(function ($rootScope)
{
    //pass
});

app.controller('bodyController', ['$scope', function ($scope)
{
    //pass
}]);

app.controller('loginController', ['$scope', '$http', '$window', function ($scope, $http, $window)
{
    //Attributes
    $scope.user = { username: 'hanxi2', password: '123' };
    $scope.message = '';
    $scope.visibility = 'visible';

    //Methods
    $scope.doLogin = function ()
    {
        $http.post('/api/authenticate', $scope.user)
        .success(function (data, status, headers, config)
        {
            //Get the response of post and store it in the session
            $window.sessionStorage.token = data.token;
            $scope.message = 'Welcome!';
            console.log($window.sessionStorage);
            //$scope.visibility = 'hidden';
        })
        .error(function (data, status, headers, config)
        {
            // Erase the token if the user fails to log in
            delete $window.sessionStorage.token;
            // Handle login errors here
            $scope.message = 'Error: Invalid user or password';
        });
    };

    $scope.doCheck = function ()
    {
        //Post the token back to the server, in which it will be decoded
        $http.post('/api/check', { token: $window.sessionStorage.token })
        .success(function (data, status, headers, config)
        {
            console.log('Check result: ' + data.result);
        });
    };
}]);

app.controller('colonyController', ['$scope', function ($scope)
{
    //pass
}]);

