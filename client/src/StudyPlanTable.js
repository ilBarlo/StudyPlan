import 'bootstrap-icons/font/bootstrap-icons.css';
import { Badge, Button, Table } from 'react-bootstrap';
import './App.css';


function StudyPlanTable(props) {

  return(<>
    <div className='table-container'>
      <br/><h1>StudyPlan of {props.user.name}, matricola: {props.user.id}</h1>
      <Table  border={'dot'} hover responsive>
        <thead>
          <tr>
            <th>Code</th>
            <th>Course Name</th>
            <th>Credits</th>
            <th>Actions</th>
          </tr>
        </thead>
        {
          props.studyPlanCourses ? 
          <tbody>
          {
            props.studyPlanCourses.courses.map((c) => 
              <CourseRow course={c} key={`course-${c.code}`} removeCourse={props.removeCourse}/>)
          }
        </tbody>:null
        }
        
      </Table>
      <Badge className='badge' bg={props.credits >= props.maxCFU - 20 && props.credits<=props.maxCFU ? "success":"danger"}>Credits {props.credits}/{props.maxCFU}</Badge><br/><hr/>
      <Badge className='badge' pill bg={"primary"}>Min number of Credits: {props.maxCFU - 20} - Max number of Credits: {props.maxCFU}</Badge>
    </div>
    </>
  );
}

function CourseRow(props) {

    return(
        <>
            <tr className = "row-separation">
                <CourseData course={props.course} removeCourse={props.removeCourse}/>
            </tr>                
        </>

    );
}

function CourseData(props) {
  return(
    <>
      <td>{props.course.code}</td>
      <td>{props.course.name}</td>
      <td>{props.course.credits}</td>
      <td><Button variant='outline-danger' onClick={()=>{props.removeCourse(props.course.code)}}><i className="bi bi-trash-fill"></i></Button></td>
    </>
  );
}



export default StudyPlanTable;