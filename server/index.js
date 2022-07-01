'use strict';

const express = require('express');
const morgan = require('morgan');

const DAOcourses = require('./modules/DAO/DAOCourse');
const DAOStudyPlan = require('./modules/DAO/DAOStudyPlan');
const DAOUser = require('./modules/DAO/DAOUser');
const DAOUserSP = require('./modules/DAO/DAOUserStudyPlan');

const app = express();
const port = 3001;
const cors = require('cors');

app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(morgan('dev'));

const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await DAOUser.getUser(username, password)
  if (!user)
    return cb(null, false, 'Incorrect username or password.');

  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) { // this user is id + email + name
  return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authorized' });
}

app.use(session({
  secret: "Eugenio, this is a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

app.post('/api/sessions', passport.authenticate('local'), (req, res) => {
  res.status(201).json(req.user);
});

/* POST /api/sessions */
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).send(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        return res.status(201).json(req.user);
      });
  })(req, res, next);
});

/* GET /api/sessions/current */
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  }
  else
    res.status(401).json({ error: 'Not authenticated' });
});

/* DELETE /api/session/current */
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

/* --- APIs ---*/

/* GET /api/courses */
app.get('/api/courses', async (req, res) => {
  try {
    const listCourses = await DAOcourses.listCourses();
    return res.status(200).json(listCourses).end();
  } catch (error) {
    return res.status(500).json(error).end();
  }
});

/* GET /api/studyplan/:matricola */
app.get('/api/studyplan/:matricola', isLoggedIn, async (req, res) => {
  const matricola = req.params.matricola;
  console.log(matricola);

  try {
    const studyPlan = await DAOStudyPlan.getStudyPlan(matricola);
    return res.status(200).json(studyPlan).end();
  } catch (error) {
    return res.status(500).json(error).end();
  }
});

/* POST /api/studyplan */
app.post('/api/studyplan', isLoggedIn, async (req, res) => {
  const sp = req.body;

  try {
    await DAOStudyPlan.addCourseInStudyPlan(sp);
    return res.status(201).json('Course succesfully added on StudyPlan').end();
  } catch (error) {
    return res.status(500).json(error).end();
  }
})

/* DELETE /api/studyplan/:matricola/:code */
app.delete('/api/studyplan/:matricola/:code', isLoggedIn, async (req, res) => {
  const matricola = req.params.matricola;
  const code = req.params.code;
  try {
    await DAOStudyPlan.deleteCourseFromStudyPlan(matricola, code);
    res.status(204).end();
  } catch (err) {
    res.status(503).json({ error: `ATTENTION! Error for the delete of exam ${code}.` });
  }
})

/* DELETE /api/studyplan/:matricola */
app.delete('/api/studyplan/:matricola', isLoggedIn, async (req, res) => {
  const matricola = req.params.matricola;
  try {
    await DAOStudyPlan.deleteStudyPlan(matricola);
    res.status(204).end();
  } catch (err) {
    res.status(503).json({ error: `ATTENTION! Error for the delete of StudyPlan of ${matricola}.` });
  }
})

/* PUT /api/courses/:code */
app.put('/api/courses/:code', isLoggedIn, async (req, res) => {
  const course = req.body;
  if (req.params.code === course.code) {
    try {
      await DAOStudyPlan.updateCourse(course);
      res.status(200).end();
    }
    catch (err) {
      console.error(err);
      res.status(503).json({ error: `Database error while updating ${courseToUpdate.code}.` });
    }
  }
  else {
    res.status(503).json({ error: `Wrong exam code in the request body.` });
  }
});

/* PUT /api/user/studyplan/:matricola/:type */
app.put('/api/user/studyplan/:matricola/:type', isLoggedIn, async (req, res) => {
  const type = req.params.type;
  const matricola = req.params.matricola;
  
  const body = {
    "matricola": matricola,
    "type": type
  }

  try {
    await DAOUserSP.updateTypeStudyPlan(body);
    res.status(200).end();
  }
  catch (err) {
    console.error(err);
    res.status(503).json({ error: `Database error` });
  }
});

/* GET /api/studyplan/:matricola */
app.get('/api/user/studyplan/:matricola', isLoggedIn, async (req, res) => {
  const matricola = req.params.matricola;
  console.log(matricola);

  try {
    const studyPlan = await DAOUserSP.getTypeUser(matricola);
    return res.status(200).json(studyPlan).end();
  } catch (error) {
    return res.status(500).json(error).end();
  }
});



app.listen(port, () => console.log(`Server started at http://localhost:${port}.`));

