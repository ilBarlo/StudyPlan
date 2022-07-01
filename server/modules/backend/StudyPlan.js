'use strict'

function StudyPlan(matricola, courses){
    this.matricola = matricola;
    this.courses = [...courses];
}

exports.StudyPlan = StudyPlan;