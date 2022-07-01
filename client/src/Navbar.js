import { Button, Container, Nav, Navbar, Modal, Image } from 'react-bootstrap';
import './Navbar.css';
import { Outlet, NavLink } from 'react-router-dom';
import { useState } from 'react';

function NavbarCustom(props) {
  const [showModal, setShowModal] = useState(false);

  return <><Navbar bg="primary" expand="lg" className='navbar'>
    <Container>
      <Navbar.Brand><i className="bi bi-book" style={{ color: 'white' }} /><span style={{ color: 'white' }}>  Study Plan</span></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <NavLink to='/' className='span'><span style={{ color: 'white' }}>  Courses  </span></NavLink>
          <NavLink to='/studyplan' className='span'><span style={{ color: 'white' }}> My Study Plan  </span></NavLink>
          {props.loggedIn ?
            <NavLink to='/' className='span' onClick={() => { props.logout() }}><span style={{ color: 'white' }}>  Logout  </span></NavLink> :
            <NavLink to='/login' className='span' ><span style={{ color: 'white' }}>  Login  </span></NavLink>
          }
          <Button variant='raised' className='button' onClick={() => { setShowModal(true) }}><span style={{ color: 'white' }}>  Tutorial  </span></Button>
        </Nav>
        <Nav>
          {props.loggedIn &&
            <span style={{ color: 'white' }}>Welcome, {props.user.name}! </span>
          }
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
    <Outlet />
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Tutorial</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h2>Add/Remove exams</h2>
        <p>
          To <b>add</b> an exam to the study plan, click on the Add button <b>(+)</b> of the chosen exam.
          To <b>remove</b> an exam from the study plan, click on the Remove button <b>(<i className="bi bi-trash"></i>)</b> of the chosen exam.<br /><br />
        </p>
        <h3>Pay Attention!</h3>
        <p>
          Not all the exam can be added/remove, everytime you'll try to add an exam incompatible, already present or if the exam
          needs a preparatory course, you will have an <b>Alert</b> like this:<br></br>
          <Image src='/alert.png' fluid /><br />
          <Image src='/alert2.png' fluid /><br />
        </p>
        <h2>Visually check exam dependencies</h2>
        <p>
          If you want to visually check dependencies for an exam, expand the course by clicking the <b>down arrow</b>.<br />
          <br></br><Image src='/arrow.png' fluid /><br />

        </p>
        <h2>Save/Delete/ the study plan</h2>
        <p>
          You can save the study plan in a persistent way (this will replace any possible previous version) by clicking <b>'Update StudyPlan'</b>. You can also cancel the current modifications, and in this case the
          persistent copy (if any) must not be modified, by clicking <b>'Cancel'</b>. You can also delete the entire study plan (if a persistent copy is present) by clicking <b>'Delete StudyPlan'</b>:<br></br>
          <br></br><Image src='/buttons.png' fluid /><br />
          When saving, the study plan must be validated according to the min-max number of credits, so pay attention to set the right amount of credits,
          otherwise you will not be able to update your StudyPlan:
          <br></br><Image src='/cfu.png' fluid /><br />
        </p>
        <h2>Create a new study plan</h2>
        <p>
          If you don't have a StudyPlan, you can create a new one specifying the type: <b>part-time</b> or <b>full-time</b>:
          <br></br><Image src='/type.png' fluid /><br />
          If a study plan has already been created and persistently saved, it is immediately displayed. If you want to change the type of your StudyPlan, 
          you have first to delete the entire study plan (if a persistent copy is present) by clicking <b>'Delete StudyPlan'</b>.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => setShowModal(false)}>
          Close!
        </Button>
      </Modal.Footer>
    </Modal>
  </>
}

export default NavbarCustom;