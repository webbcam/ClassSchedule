//  public/courses.js
var app = angular.module('CourseSchedule', ['ui.router','ui.bootstrap','ngAnimate']);


app.config(function($stateProvider, $locationProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
        .state('today', {
            url : "/today",
            templateUrl : "views/today.html"
        })
        .state('classes', {
            url : "/classes",
            templateUrl : "views/classes.html",
            controller : "mainCtrl"
        });
    $urlRouterProvider.otherwise('/today');
})

app.controller('mainCtrl', function($scope, $http) {
    $scope.courseName = "";
    $scope.courseSection = "";
    $scope.courseData = {};
    $scope.isCollapsed = true;

    $http.get('/api/courses')
        .success(function(data) {
            $scope.courseList = data;
            console.log(data);
        })

        .error(function(data) {
            console.log("Error: " + data);
        });


        $scope.createCourse = function() {

            
            $http.post('/api/courses', $scope.courseData)
                .success(function(data) {
                    $scope.courseData = {};
                    $scope.courseList = data;
                    console.log(data);
                })
                .error(function(data) {
                    console.log("Error: " + data);
                });
        };

        //  deletes an item based on its _id
        $scope.deleteCourse = function(id) {
            $http.delete('/api/courses/'+id)
                .success(function(data) {
                    $scope.courseData = {};
                    $scope.courseList = data;
                    console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        };

});