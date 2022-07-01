import 'bootstrap-icons/font/bootstrap-icons.css';

import { Table, Button, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useState } from 'react';
import './App.css';


function CourseTable(props) {

  return (<>
    <div className='table-container'>
      <Table border={'dot'} hover size='sm' className='table'>
        <thead>
          <tr>
            <th>Code</th>
            <th>Course Name</th>
            <th>Credits</th>
            <th>Enrolled Students</th>
            <th>Maximum possible enrolled students</th>
          </tr>
        </thead>
        <tbody>
          {
            props.courses.map((c) =>
              <CourseRow course={c} key={`course-${c.code}`} addCourse={props.addCourse} isLogged={props.isLogged} maxCFU={props.maxCFU} type={props.type} />)
          }
        </tbody>
      </Table>
    </div>
  </>
  );
}

function CourseRow(props) {
  const [expanded, setExpanded] = useState(false);

  const showInfoCourse = () => {
    setExpanded(oldStatus => !oldStatus);
  }

  return (
    <>
      <tr className={expanded ? "" : "row-separation"}>
        <CourseData course={props.course} />
        {props.isLogged && (props.type === "full-time" || props.type === "part-time") ?
          <td>
            {props.course.maxStudents != null && props.course.maxStudents === props.course.signedStudents ?
              <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Max Students reached!</Tooltip>}>
                <span className="d-inline-block">
                  <Button variant="danger" disabled><i className="bi bi-exclamation-circle"></i></Button>
                </span>
              </OverlayTrigger>
              :
              <Button className="button-add" color='green' onClick={() => { props.addCourse(props.course.code) }}><i className="bi bi-plus"></i></Button>
            }
          </td> : <td />
        }

        <td>
          <Button className="button-course" onClick={showInfoCourse}>
            <i className={`bi bi-caret-${expanded ? 'up-fill' : 'down-fill'}`} />
          </Button>
        </td>

      </tr>
      <tr className={expanded ? "row-separation" : "d-none"}>
        <CourseDescription course={props.course} />
      </tr>
    </>

  );
}

function CourseData(props) {
  return (
    <>
      <td>{props.course.code}</td>
      <td>{props.course.name}</td>
      <td>{props.course.credits}</td>
      <td>{props.course.signedStudents}</td>
      <td>{props.course.maxStudents != null ? props.course.maxStudents : '-'}</td>
    </>
  );
}

function CourseDescription(props) {
  return (
    <>
      <td colSpan="3" className="text-start">
        <Badge bg="info">{props.course.printIncompatible()}</Badge>
      </td>
      <td colSpan="3" className="text-end">
        <Badge bg="warning" text="dark">{props.course.printPreparatory()}</Badge>
      </td>
      <td></td>
    </>
  )
}

/* Accordion component to use an expand list */

export default CourseTable;