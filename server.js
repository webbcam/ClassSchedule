//  server.js

    //  set up =============================

    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var request = require('request');           //  used for making http calls to umd.io api


    //  configuration ======================  
    mongoose.connect('mongodb://localhost/fall15');

    app.use(express.static(__dirname + '/public'));
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({'extended' : 'true'}));
    app.use(bodyParser.json());
    app.use(bodyParser.json({ type : 'application/vnd.api+json' }));
    app.use(methodOverride());

    //  define model =======================
    var Course = mongoose.model('Course', {
        course : String,
        section : String,
        semester: String,
        instructors : String,
        meetings : []

    });

//  routes =================================

    //  api ================================
    //  get all courses
    app.get('/api/courses', function(req, res) {
        //  use mongoose to get all courses in db
        Course.find(function(err, courses) {

            //  if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(courses);
        });
    });

    app.post('/api/courses', function(req, res) {
        var courseInfo = {};
        console.log("REQ: Course= "+req.body.course + "Section= " + req.body.section);

        request("http://api.umd.io/v0/courses/sections?course="+req.body.course.toUpperCase()+"&number="+req.body.section.toUpperCase(), function(err, response, body) {
            var courseInfo= (JSON.parse(body))[0];
                courseInfo.section = courseInfo.number; // give course object a "section" variable

            //  create a course, information comes from AJAX request from Angular
            Course.create(courseInfo, function(err, course) {
                if (err)
                    res.send(err);

                 // get and return all the courses after you create another
                Course.find(function(err, courses) {
                    if (err)
                        res.send(err)
                    res.json(courses);
                });
            });

            
        });
        
        

    });

    //  deletes a course from your schedule: pass it the course name
    app.delete('/api/courses/:id', function(req, res) {
        Course.remove({
            "_id" : req.params.id
        }, function(err, course) {
            if (err)
                res.send(err);

            //  get and return all the courses after you delete one
            Course.find(function(err, courses) {
                if (err)
                    res.send(err)

                res.json(courses);
            });
        });
    });

    //  application ========================
    app.get('*', function(req, res) {
        res.sendFile('./public/index.html');
    });

    //  listen =============================
    app.listen(3000);
    console.log("The magic happens on port 3000!");