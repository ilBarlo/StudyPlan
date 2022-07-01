'use strict';

function Course(code, name, credits, maxStudents, incompatibleCourse, preparatoryCourse, signedStudents){
    this.code = code;
    this.name = name;
    this.credits = credits;
    this.maxStudents = maxStudents;
    this.incompatibleCourse = incompatibleCourse ? [...incompatibleCourse] : null ;
    this.preparatoryCourse = preparatoryCourse;
    this.signedStudents = signedStudents;
}

exports.Course = Course;