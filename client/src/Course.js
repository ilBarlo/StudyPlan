function Course(code, name, credits, maxStudents, incompatibleCourse, preparatoryCourse, signedStudents, taken){
    this.code = code;
    this.name = name;
    this.credits = credits;
    this.maxStudents = maxStudents;
    this.incompatibleCourse = incompatibleCourse ? [...incompatibleCourse] : null ;
    this.preparatoryCourse = preparatoryCourse;
    this.signedStudents = signedStudents;
    this.taken = false;

    this.isFull = () => {
        return this.maxStudents === this.signedStudents ? true : false;
    }

    this.addStudent = () => {
        this.signedStudents++;
    }

    this.printIncompatible = () => {
        if(!this.incompatibleCourse) return `${this.name} doesn't have any incompatible course`
        
        let incompatibleCourse= `Incompatible course`;
        incompatibleCourse += (this.incompatibleCourse.length > 1) ? "s:" : ":";
        return(
            < >
                <span>{incompatibleCourse}</span>
                <br/>
                <ul>
                    {
                        this.incompatibleCourse.map((incompatibleCourse) => 
                            <li key = {incompatibleCourse}>{incompatibleCourse}</li>
                        )
                    }
                </ul>                
            </>
        );
    }

    this.printPreparatory = () => {
        return (this.preparatoryCourse ?
            `Preparatory course : ${this.preparatoryCourse}`
        : 
            `No preparatory course`);
            // `${this.name} doesn't have any preparatory course`);
    }

    this.setTaken = () => {
        this.taken = !this.taken;
    }

    
}

export default Course;