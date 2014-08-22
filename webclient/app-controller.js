/*
Copyright 2014 matrix.org

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/*
 * Main controller
 */

'use strict';

angular.module('MatrixWebClientController', ['matrixService'])
.controller('MatrixWebClientController', ['$scope', '$location', '$rootScope', 'matrixService', 'eventStreamService',
                               function($scope, $location, $rootScope, matrixService, eventStreamService) {
         
    // Check current URL to avoid to display the logout button on the login page
    $scope.location = $location.path();
    
    // Update the location state when the ng location changed
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $scope.location = $location.path();
    });
    
    
    // Manage the display of the current config
    $scope.config;
    
    // Toggles the config display
    $scope.showConfig = function() {
        if ($scope.config) {
            $scope.config = undefined;
        }
        else {
            $scope.config = matrixService.config();        
        }
    };
    
    $scope.closeConfig = function() {
        if ($scope.config) {
            $scope.config = undefined;
        }
    };

    if (matrixService.isUserLoggedIn()) {
        // eventStreamService.resume();
    }
    
    // Logs the user out 
    $scope.logout = function() {
        // kill the event stream
        eventStreamService.stop();
    
        // Clean permanent data
        matrixService.setConfig({});
        matrixService.saveConfig();
        
        // And go to the login page
        $location.url("login");
    };

    // Listen to the event indicating that the access token is no longer valid.
    // In this case, the user needs to log in again.
    $scope.$on("M_UNKNOWN_TOKEN", function() {
        console.log("Invalid access token -> log user out");
        $scope.logout();
    });
    
    $scope.requestNotifications = function() {
        if (window.Notification) {
            console.log("Notification.permission: " + window.Notification.permission);
            window.Notification.requestPermission(function(){});
        }
    };
    
    
}]);

   
