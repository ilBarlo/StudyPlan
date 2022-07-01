import { Row, Col, Alert, Button } from 'react-bootstrap';
import { LoginForm } from './LoginForm';

function DefaultRoute() {
  return(
    <>
      <Row>
        <Col>
          <h1>Nothing here...</h1>
          <p>This is not the route you are looking for!</p>
        </Col>
      </Row>
    </>
  );
}

function LoginRoute(props) {
  const showB = props.showB;
  
  return(
    <>
      <Row>
        <Col>
          <h1>Login</h1>
        </Col>
      </Row>
      {props.message && <Row>
        <Alert variant={props.message.type} onClose={() => props.setMessage('')} dismissible>{props.message.msg}</Alert>
      </Row>}
      <Row>
        <Col>
        {showB &&
            <Alert variant="danger" className='auth'>
              <Alert.Heading>Ouch!</Alert.Heading>
              <p>
                Wrong Email or Password!
              </p>
              <hr />
              <div className="d-flex justify-content-end">
                <Button onClick={() => props.setShowB(false)} variant="outline-danger">
                  Close this message!
                </Button>
              </div>
            </Alert>
          }
          <LoginForm login={props.login} />
        </Col>
      </Row>
    </>
  );
}

export { DefaultRoute, LoginRoute };