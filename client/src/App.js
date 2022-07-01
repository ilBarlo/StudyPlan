import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Row } from 'react-bootstrap'
import { useState, useEffect } from 'react';
import { CourseView } from './CourseView';
import { LoginRoute } from './LoginView';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import NavbarCustom from './Navbar';
import API from './API';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { StudyPlan } from './StudyPlan';

function App() {
  const [courses, setCourses] = useState([]);
  const [studyPlan, setStudyPlan] = useState();
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrmsg] = useState();
  const [credits, setCredits] = useState(0);
  const [incompatible, setInconmpatible] = useState();
  const [preparatory, setPreparatory] = useState();
  const [removeprep, setRemovePrep] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState();
  const [studyPlanUser, setStudyPlanUser] = useState();
  const [maxCFU, setmaxCFU] = useState(0);

  /* State used for Wrong Authentication */
  const [showB, setShowB] = useState(false);

  /* State use for Modal after update/delete of StudyPlan */
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [errSD, setErrSD] = useState(false);
  const handleCloseSD = () => setErrSD(false);
  const [errSP, setErrSP] = useState(false);
  const handleCloseSP = () => setErrSP(false);
  const [errCFU, setErrCFU] = useState(false);
  const handleCloseCFU = () => setErrCFU(false);
  const [auth, setauth] = useState(false);
  const handleCloseauth = () => { setauth(false); getTypeUser(user.id); setLoading(true) }
  const [authout, setauthout] = useState(false);
  const handleCloseauthout = () => { setauthout(false) }

  const reloadStudyPlan = async () => {
    setLoading(false);
    /* Reset of the enrolled students */
    const check = await API.getStudyPlan(user.id);
    let check_course = null
    for (let c of studyPlan.courses) {
      if (check) check_course = check.courses.filter((co) => (co.code === c.code));
      if (check_course === null || !check_course.length) {
        const course = courses.filter((co) => (co.code === c.code));
        course[0].signedStudents -= 1;
        await API.updateCourse(course[0]);
      }
    }

    if (check) {
      for (let ch of check.courses) {
        check_course = studyPlan.courses.find(c => (c.code === ch.code));
        if (check_course === undefined) {
          const course = courses.filter((co) => (co.code === ch.code));
          course[0].signedStudents += 1;
          await API.updateCourse(course[0]);
        }
      }
    }


    getStudyPlan(user.id); /* Matricola will come from the user */
    clearErrMsg();
    setLoading(true);
  }

  const updateStudyPlan = async (newSp) => {
    setLoading(false);
    if (credits >= maxCFU - 20 && credits <= maxCFU) {
      const studyPlanDB = await API.getStudyPlan(user.id)
      if (studyPlanDB) await API.deleteCourseFromStudyPlan(user.id); /* Matricola will come from the user */
      for (let co of newSp.courses) {
        await API.addStudyPlan(user.id, co.code);
      }
      getStudyPlan(user.id);
      setLoading(true);
      clearErrMsg();
      setShow(true);
    } else {
      setErrCFU(true);
      setLoading(true);
    }

  }

  const deleteStudyPlan = async () => {
    setLoading(false);
    if (studyPlan.courses.length) {
      const studyPlan = await API.getStudyPlan(user.id);
      if (studyPlan !== null) {
        /* Reset of the enrolled students */
        for (let c of studyPlan.courses) {
          const course = courses.filter((co) => (co.code === c.code));
          course[0].signedStudents -= 1;
          await API.updateCourse(course[0]);
        }
        setStudyPlan();
        setCredits(0);
        getAllCourses();
        setTypeUser(user.id, null);
        setStudyPlanUser();
        await API.deleteCourseFromStudyPlan(user.id); /* Matricola will come from the user */
        setErrSD(true);
      } else {
        setErrSP(true);
      }
    }
    setLoading(true);
  }

  const getAllCourses = async () => {
    setLoading(false);
    const courses = await API.getAllCourses();
    setCourses(courses);
    setLoading(true);
  }

  const getStudyPlan = async (matricola) => {
    setLoading(false);
    const studyPlan1 = await API.getStudyPlan(matricola);
    if (studyPlan1 !== null) { setStudyPlan(studyPlan1) } else { setStudyPlan() };
    let cfu = 0;
    if (studyPlan1) for (let c of studyPlan1.courses) cfu += c.credits;
    setCredits(cfu);
    setLoading(true);
  }

  const getTypeUser = async (matricola) => {
    setLoading(false);
    const userSp = await API.getUserStudyPlan(matricola);
    setStudyPlanUser(userSp.type);
    setmaxCredits(userSp.type);
    setLoading(true);
  }

  const setTypeUser = async (matricola, type) => {
    await API.setTypeUser(matricola, type);
    setmaxCredits(type);
    setStudyPlanUser(type);
  }

  const setmaxCredits = (type) => {
    switch (type) {
      case 'full-time':
        setmaxCFU(80);
        break;

      case 'part-time':
        setmaxCFU(40);
        break;

      default: break;
    }
  }

  const removeCourse = async (code) => {
    try {
      const courseDelete = studyPlan.courses.filter((sp) => (sp.code === code));
      const newSp = new StudyPlan(studyPlan.matricola, studyPlan.courses.filter((sp) => (sp.code !== code)), credits - courseDelete[0].credits);
      var flag = undefined;
      for (let c of newSp.courses) {
        if (c.preparatoryCourse && courseDelete[0].code === c.preparatoryCourse) {
          flag = c.code;
        }
      }

      /* Check to see it is a preparatory course */
      if (!flag) {
        setCredits(credits - courseDelete[0].credits);
        setStudyPlan(newSp);
        setErrmsg();
        setInconmpatible();
        setRemovePrep();
        courseDelete[0].signedStudents -= 1;
        /* I decided to manage the concurrency access in this way: 
           Everytime a student decide to add or remove a course, 
           I change the number of enrolled students. */
        await API.updateCourse(courseDelete[0]);
        getAllCourses();
      } else {
        setRemovePrep(flag);
        setErrmsg();
        setInconmpatible();
      }

    } catch (e) {
      console.log(e);
    }
  }

  const addCourse = async (code) => {
    try {
      if (studyPlan) {
        const check = studyPlan.courses.filter((c) => (c.code === code));
        let flag = undefined;
        if (check.length) {
          setErrmsg(check[0].code);
          setInconmpatible();
          setRemovePrep();
          setPreparatory();
        } else {
          const course = courses.filter((c) => (c.code === code));
          if (course[0].incompatibleCourse || course[0].preparatoryCourse) {
            /* Check to see the incompatible courses */
            if (course[0].incompatibleCourse) {
              for (let co of course[0].incompatibleCourse) {
                const check = studyPlan.courses.filter((c) => (c.code === co))
                if (check.length) {
                  flag = check;
                }
              }
            }

            if (flag) {
              setInconmpatible(flag[0].code);
              setErrmsg();
              setPreparatory();
              setRemovePrep();
              flag = undefined;
            } else {
              /* Check to see the preparatory courses */
              if (course[0].preparatoryCourse) {
                const check = studyPlan.courses.filter((c) => (c.code === course[0].preparatoryCourse))
                if (!check.length) {
                  setPreparatory(course[0].preparatoryCourse);
                  setInconmpatible();
                  setErrmsg();
                  setRemovePrep(false);
                } else {
                  const newSp = new StudyPlan(studyPlan.matricola, studyPlan.courses, studyPlan.credits);
                  newSp.addCourse(course[0]);
                  setCredits(credits + course[0].credits); /* Set the new amount of credits for the studyPlan */
                  setStudyPlan(newSp);
                  setErrmsg();
                  setInconmpatible();
                  setPreparatory();
                  setRemovePrep();
                  course[0].signedStudents += 1;
                  /* I decided to manage the concurrency access in this way: 
                     Everytime a student decide to add or remove a course, 
                     I change the number of enrolled students. */
                  await API.updateCourse(course[0]);

                }
              } else {
                const newSp = new StudyPlan(studyPlan.matricola, studyPlan.courses, studyPlan.credits);
                newSp.addCourse(course[0]);
                setCredits(credits + course[0].credits); /* Set the new amount of credits for the studyPlan */
                setStudyPlan(newSp);
                setErrmsg();
                setInconmpatible();
                setPreparatory();
                setRemovePrep();
                course[0].signedStudents += 1;
                /* I decided to manage the concurrency access in this way: 
                   Everytime a student decide to add or remove a course, 
                   I change the number of enrolled students. */
                await API.updateCourse(course[0]);

              }
            }

          } else {
            const newSp = new StudyPlan(studyPlan.matricola, studyPlan.courses, studyPlan.credits);
            newSp.addCourse(course[0]);
            setCredits(credits + course[0].credits); /* Set the new amount of credits for the studyPlan */
            setStudyPlan(newSp);
            setErrmsg();
            setInconmpatible();
            setPreparatory();
            setRemovePrep();
            course[0].signedStudents += 1;
            /* I decided to manage the concurrency access in this way: 
               Everytime a student decide to add or remove a course, 
               I change the number of enrolled students. */
            await API.updateCourse(course[0]);
          }
        }
      } else {
        /* Check to see the preparatory courses */
        const course = courses.filter((c) => (c.code === code));
        if (course[0].preparatoryCourse) {
          setPreparatory(course[0].preparatoryCourse);
          setInconmpatible();
          setErrmsg();
          setRemovePrep(false);
        } else {
          const course = courses.filter((c) => (c.code === code));
          setCredits(credits + course[0].credits); /* Set the new amount of credits for the studyPlan */
          const newSp = new StudyPlan(user.id, course);
          clearErrMsg();
          setStudyPlan(newSp);
          course[0].signedStudents += 1;
          /* I decided to manage the concurrency access in this way: 
             Everytime a student decide to add or remove a course, 
             I change the number of enrolled students. */
          await API.updateCourse(course[0]);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  const clearErrMsg = () => {
    setErrmsg();
    setInconmpatible();
    setRemovePrep();
    setPreparatory();
  }

  /* Authentication */
  const handleLogin = async (credentials) => {
    setLoading(false)
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
      setShowB(false);
      setauth(true);
      getStudyPlan(user.id);
    } catch (err) {
      console.log(err);
      setShowB(true);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(false);
      await API.logOut();
      getAllCourses();
      setLoggedIn(false);
      setauthout(true);
      setLoading(true);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    setLoading(false);
    const checkAuth = async () => {
      const user = await API.getUserInfo(); // we have the user info here
      if (user) {
        setLoading(false);
        getStudyPlan(user.id);
        getTypeUser(user.id);
        setUser(user);
        setLoggedIn(true);
        setLoading(true);
      }
    };
    checkAuth();
    getAllCourses();
    setLoading(true);
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(false);
      setUser(user);
      getStudyPlan(user.id);
      setLoading(true);
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Row>
        <Modal show={show} onHide={handleClose}><Modal.Header closeButton><Modal.Title>StudyPlan succesfully updated!</Modal.Title></Modal.Header><Modal.Footer><Button variant="success" onClick={handleClose}>Close</Button></Modal.Footer></Modal>
        <Modal show={errSP} onHide={handleCloseSP}><Modal.Header closeButton><Modal.Title>No StudyPlan uploaded, first update a new Study Plan!</Modal.Title></Modal.Header><Modal.Footer><Button variant="danger" onClick={handleCloseSP}>Close</Button></Modal.Footer></Modal>
        <Modal show={errSD} onHide={handleCloseSD}><Modal.Header closeButton><Modal.Title>StudyPlan succesfully deleted!</Modal.Title></Modal.Header><Modal.Footer><Button variant="success" onClick={handleCloseSD}>Close</Button></Modal.Footer></Modal>
        <Modal show={errCFU} onHide={handleCloseCFU}><Modal.Header closeButton><Modal.Title>Error!</Modal.Title></Modal.Header><Modal.Body>Set the right amount of CFU.</Modal.Body><Modal.Footer><Button variant="danger" onClick={handleCloseCFU}>Close</Button></Modal.Footer></Modal>
        <Modal show={auth} onHide={handleCloseauth}><Modal.Header closeButton><Modal.Title>Authentication done!</Modal.Title></Modal.Header><Modal.Body>Welcome on the StudyPlan App</Modal.Body><Modal.Footer><Button variant="success" onClick={(handleCloseauth)}>Close</Button></Modal.Footer></Modal>
        <Modal show={authout} onHide={handleCloseauthout}><Modal.Header closeButton><Modal.Title>Logout done!</Modal.Title></Modal.Header><Modal.Body>See you later!</Modal.Body><Modal.Footer><Button variant="warning" onClick={(handleCloseauthout)}>Close</Button></Modal.Footer></Modal>
        <NavbarCustom user={user} logout={handleLogout} loggedIn={loggedIn} />
      </Row>
      <Routes>
        <Route path='/studyplan' element={
          loggedIn ? <CourseView courses={courses} studyPlan={studyPlan} addCourse={addCourse} removeCourse={removeCourse} errMsg={errMsg} credits={credits} incompatible={incompatible} preparatory={preparatory} removeprep={removeprep} reloadStudyPlan={reloadStudyPlan} updateStudyPlan={updateStudyPlan} deleteStudyPlan={deleteStudyPlan} user={user} isLogged={loggedIn} type={studyPlanUser} setType={setTypeUser} maxCFU={maxCFU} loading={loading} setLoading={setLoading} /> : <Navigate replace to='/login' />
        } />
        <Route path='/login' element={
          loggedIn ? <Navigate replace to='/studyplan' /> : <LoginRoute login={handleLogin} showB={showB} setShowB={setShowB} />
        } />
        <Route path='/' element={<CourseView courses={courses} isLogged={false} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
