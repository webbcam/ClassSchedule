//  server.js

    //  set up =============================

    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)


    //  configuration ======================  
    mongoose.connect('mongodb://localhost/schedule_fall15');

    app.use(express.static(__dirname + '/public'));
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({'extended' : 'true'}));
    app.use(bodyParser.json());
    app.use(bodyParser.json({ type : 'application/vnd.api+json' }));
    app.use(methodOverride());

    //  define model =======================
    var Course = mongoose.model('Course', {
        title : String,
        section : String
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

        var courseName = req.body.title;
        var courseSection = req.body.section;

        // app.get('http://api.umd.io/v0/courses/sections?course='+req.body.title'&number='+req.body.section), function(request, response) {
        //     Course.create({
        //         title : 
        //     })
        // }



        //  create a course, information comes from AJAX request from Angular
        Course.create({
            title : req.body.title,
            section : req.body.section
        }, function(err, course) {
            if (err)
                res.send(err);

            //  get and return all the courses after you create another
            Course.find(function(err, courses) {
                if (err)
                    res.send(err)
                res.json(courses);
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