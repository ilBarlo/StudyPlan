import Course from './Course'
import { StudyPlan } from './StudyPlan';

const APIURL = 'http://localhost:3001/api';

async function getAllCourses() {
    const response = await fetch(APIURL + '/courses');

    try {
        if (response.ok) {
            const list = await response.json();
            return list.map(c => new Course(c.code, c.name, c.credits, c.maxStudents, c.incompatibleCourse, c.preparatoryCourse, c.signedStudents));
        } else {
            const text = response.text();
            throw new TypeError(text);
        }
    } catch (e) {
        throw (e);
    }
};

async function getStudyPlan(matricola) {
    const response = await fetch(APIURL + '/studyplan/' + matricola, 
    {
        credentials: 'include'
    });

    try {
        if (response.ok) {
            const studyPlan = await response.json();
            if (studyPlan) {
                const list = new StudyPlan(studyPlan.matricola, studyPlan.courses, studyPlan.type);
                return list;
            } else {
                return null;
            }

        }
        else {
            const errDetails = await response.text();
            throw errDetails;
        }
    } catch (e) {
        throw (e);
    }

}

async function deleteCourseFromStudyPlan(matricola) {
    const url = APIURL + `/studyplan/${matricola}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) {
            return true;
        } else {
            const text = await response.text();
            throw new TypeError(text);
        }
    } catch (ex) {
        throw ex;
    }
}

async function addStudyPlan(matricola, code) {
    const url = APIURL + '/studyplan';
    const body = {
        "matricola": matricola,
        "code": code
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }, 
            credentials: 'include'
        });

        if (response.ok) {
            return true;
        } else {
            const text = await response.text();
            throw new TypeError(text);
        }
    } catch (ex) {
        throw ex;
    }
}

async function updateCourse(course) {
    const url = APIURL + `/courses/${course.code}`;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(course),
            headers: {
                'Content-Type': 'application/json'
            }, 
            credentials: 'include'
        });
        if (response.ok) {
            return true;
        } else {
            const text = await response.text();
            throw new TypeError(text);
        }
    } catch (ex) {
        throw ex;
    }
}

async function getUserStudyPlan(matricola) {
    const response = await fetch(APIURL + '/user/studyplan/' + matricola, 
    {
        credentials: 'include'
    });

    try {
        if (response.ok) {
            const studyPlan = await response.json();
            if (studyPlan) {
                return studyPlan;
            } else {
                return null;
            }

        }
        else {
            const errDetails = await response.text();
            throw errDetails;
        }
    } catch (e) {
        throw (e);
    }

}

async function setTypeUser(matricola, type) {
    const url = APIURL + `/user/studyplan/${matricola}/${type}`;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }, 
            credentials: 'include'
        });
        
        if (response.ok) {
            return true;
        } else {
            const text = await response.text();
            throw new TypeError(text);
        }
    } catch (ex) {
        throw ex;
    }
}

const logIn = async (credentials) => {
    const url = APIURL + `/sessions`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
    });

    if (response.ok) {
        const user = await response.json();
        return user;
    }
    else {
        const errDetails = await response.text();
        throw errDetails;
    }
}

const logOut = async () => {
    const url = APIURL + `/sessions/current`;

    const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (response.ok) {
        return true;
    }
    else {
        return false;
    }

}

const getUserInfo = async () => {
    const url = APIURL + `/sessions/current`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
        });
        const user = await response.json();
        if (response.ok) {
            return user;
        } else {
            return null;
        }
    } catch (err) {
        throw new Error("Error in connection");
    }

};

const API = { getAllCourses, getStudyPlan, deleteCourseFromStudyPlan, addStudyPlan, updateCourse, logIn, logOut, getUserInfo , setTypeUser, getUserStudyPlan};
export default API;