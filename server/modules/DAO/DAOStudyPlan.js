'use strict';

const sqlite = require('sqlite3');
const {db} = require('./DB');
const {StudyPlan} = require('../backend/StudyPlan');
const {Course} = require('../backend/Course');

// Get Study Plan by matricola
exports.getStudyPlan = (matricola) => {
    return new Promise((resolve,reject) => {
        const sql = "SELECT * FROM StudyPlan AS S, Courses AS C\
                    WHERE  S.code = C.code AND matricola = ?";
        db.all(sql, [matricola], (err,rows) => {
            /* console.log("Debug DAOStudyPlan"); */
            if(err){
                reject(err);
                console.log(err)
            }else{
                if(rows.length !== 0){
                    const courses = rows.map((row) => new Course(
                        row.code, 
                        row.name, 
                        row.credits, 
                        row.maxStudents, 
                        row.incompatible ? row.incompatible.split(" "):null,
                        row.preparatory,
                        row.enrolledStudents)
                    )
                    resolve(new StudyPlan(matricola, courses));  
                }else{
                    resolve(null);
                }
                    
            }
      
        })
    })
};

// Add a course in Study Plan
exports.addCourseInStudyPlan = (body) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO StudyPlan(matricola,code) VALUES(?,?)";
        db.run(sql, [body.matricola,body.code],(err) =>{
            if(err)
                reject(err);
            else
                resolve(console.log('Course succesfully added!'));
        });
    });
}

// Delete a course from Study Plan
exports.deleteCourseFromStudyPlan = (matricola,code) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM StudyPlan WHERE matricola = ? AND code = ?';
        db.run(sql, [matricola, code], (err) => {
            if(err){
                reject(err);
                console.log(err);
            }else
                resolve(console.log('Course succesfully deleted!'));
        });
    })
};

// Delete a Study Plan
exports.deleteStudyPlan = (matricola) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM StudyPlan WHERE matricola=?';
        db.run(sql, [matricola], (err) => {
            if(err)
                reject(err);
            else
                resolve(console.log('StudyPlan succesfully deleted!'));
        });
    })
};

// Update enrolled students
exports.updateCourse = (course) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE Courses SET enrolledStudents=? WHERE code=?';
      db.run(sql, [course.signedStudents, course.code], function(err) {
        if(err) reject(err);
        else resolve(this.lastID);
      });
    });
  };