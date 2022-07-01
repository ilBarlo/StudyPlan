'use strict';

const sqlite = require('sqlite3');
const {db} = require('./DB');
const {Course} = require('../backend/Course');

// Get all Courses ordered by name
exports.listCourses = () => {
    return new Promise((resolve,reject) => {
        const sql = 'SELECT * FROM Courses ORDER BY name';
        db.all(sql, [], (err,rows) => {
            /* console.log("Debug DAOCourse"); */
            if(err) reject(err);
            else{
                if (rows !== undefined){
                    const courses = rows.map((row) => new Course(
                        row.code, 
                        row.name, 
                        row.credits, 
                        row.maxStudents, 
                        row.incompatible ? row.incompatible.split(" "):null,
                        row.preparatory,
                        row.enrolledStudents)
                    )
                    resolve(courses);
                } else {
                    resolve(null);
                }
            }
        })
    })
}

// Get informations about a course giving its code
exports.getCourse = (code) => {
    return new Promise((resolve,reject) => {
        const sql = 'SELECT * FROM Courses where code = ?';
        db.get(sql, [code], (err,row) => {
            /* console.log("Debug DAOCourse"); */
            if(err) reject(err);
            else{
                if (row !== undefined){
                    const course = new Course(
                        row.code, 
                        row.name, 
                        row.credits, 
                        row.maxStudents, 
                        row.incompatible ? row.incompatible.split(" "):null,
                        row.preparatory,
                        row.enrolledStudents)
                    
                    resolve(course);
                } else {
                    resolve(null);
                }
            }
        })
    })
}

