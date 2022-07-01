import { Row, Col, Button, Form, Spinner, Card } from 'react-bootstrap'
import CourseTable from './CourseTable';
import './App.css';
import StudyPlanTable from './StudyPlanTable';
import Alert from 'react-bootstrap/Alert'

function CourseView(props) {
  const isLogged = props.isLogged;

  return (
    <>
      <Row>
        <Col id='studyplan'>

          {props.message && <Row>
            <Alert variant={props.message.type} onClose={() => props.setMessage('')} dismissible>{props.message.msg}</Alert>
          </Row>}
          {isLogged ?
            <div>
              {
                props.loading ?
                  <div>
                    {props.type === "full-time" || props.type === "part-time" ?
                      <div><StudyPlanTable studyPlanCourses={props.studyPlan} removeCourse={props.removeCourse} credits={props.credits} user={props.user} maxCFU={props.maxCFU} />
                        <br /><div className='button-container'>

                          {
                            props.studyPlan &&
                            <div>
                              <Button className='add-button' variant="success" size="lg" onClick={() => { props.updateStudyPlan(props.studyPlan) }}>Update Study Plan</Button>
                              <Button className='add-button' variant="danger" size="lg" onClick={() => { props.reloadStudyPlan() }}>Cancel</Button>
                              <Button className='add-button' variant="warning" size="lg" onClick={() => { props.deleteStudyPlan() }}>Delete Study Plan</Button>
                            </div>
                          }

                        </div></div>
                      :
                      <div className='type-studyplan'>
                        <Card bg="" border="primary">
                          <Card.Header bg="primary" as="h2">Select the type of StudyPlan!</Card.Header>
                          <Card.Body>
                            <Card.Title>It is required to create a StudyPlan</Card.Title>
                            <Card.Text>
                              If you want to change the type of your StudyPlan, you will have
                              to delete your StudyPlan. After that, you will able to chose another
                              type.
                            </Card.Text>
                            <Form>
                              {['checkbox'].map((type) => (
                                <div key={`inline-${type}`} className="mb-3">
                                  <Form.Check
                                    inline
                                    label="full-time"
                                    name="group1"
                                    type={type}
                                    id={`inline-${type}-1`}
                                    onClick={() => { props.setType(props.user.id, "full-time") }}
                                  />
                                  <Form.Check
                                    inline
                                    label="part-time"
                                    name="group1"
                                    type={type}
                                    id={`inline-${type}-2`}
                                    onClick={() => { props.setType(props.user.id, "part-time") }}
                                  />
                                </div>
                              ))}
                            </Form>
                          </Card.Body>
                        </Card>
                      </div>
                    }
                    {
                      props.removeprep &&
                      <Alert variant="danger">
                        <Alert.Heading>Error!</Alert.Heading>
                        <p>
                          You cannot delete this course: it's a preparatory course needed for the course {props.removeprep}
                        </p>
                      </Alert>
                    }
                    {
                      props.preparatory &&
                      <Alert variant="warning">
                        <Alert.Heading>Warning!</Alert.Heading>
                        <p>
                          This course has a preparatory course, To add this course, first add course {props.preparatory}
                        </p>
                      </Alert>
                    }
                    {
                      props.incompatible &&
                      <Alert variant="primary">
                        <Alert.Heading>Incompatible Course!</Alert.Heading>
                        <p>
                          You cannot add this course. To add this course, first remove course {props.incompatible}
                        </p>
                      </Alert>
                    }
                    {props.errMsg &&
                      <Alert variant="danger">
                        <Alert.Heading>Error!</Alert.Heading>
                        <p>
                          {props.errMsg} already present in your studyPlan!
                        </p>
                      </Alert>}
                  </div> :
                  <Spinner animation="border" variant="primary" />
              }

            </div> : null
          }

        </Col>
      </Row>
      <Row>
        <Col>
          <br /><h1>List of Courses</h1>
          <CourseTable classname="course-table" courses={props.courses} addCourse={props.addCourse} isLogged={isLogged} type={props.type} />
        </Col>
      </Row>
    </>
  );
}

export { CourseView }