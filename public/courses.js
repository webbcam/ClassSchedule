//  public/courses.js
var app = angular.module('CourseSchedule', []);

app.controller('mainCtrl', function($scope, $http) {
    $scope.courseName = "";
    $scope.courseSection = "";
    $scope.courseData = {};

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