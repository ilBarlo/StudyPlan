function StudyPlan(matricola, courses, credits){
    this.matricola = matricola;
    this.courses = [...courses];
    this.credits = credits;

    this.addCourse = (course) => {
        this.courses.push(course);
    }

}

exports.StudyPlan = StudyPlan;