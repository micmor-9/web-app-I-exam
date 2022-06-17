import { Button, Col, Table } from "react-bootstrap";

// Study Plan List component
function StudyPlanList({ studyPlanList, removeCourseFromStudyPlan }) {
  if (studyPlanList.length > 0) {
    return (
      <StudyPlanTable
        data={studyPlanList}
        removeCourseFromStudyPlan={removeCourseFromStudyPlan}
      />
    );
  } else {
    return (
      <div className="study-plan-list">No Study Plan has been defined</div>
    );
  }
}

// Table to show the list of course added to the study plan
function StudyPlanTable({ data, removeCourseFromStudyPlan = null }) {
  return (
    <Col xs={12}>
      <Table id="study-plan-table">
        <thead>
          <tr>
            <th scope="col">Code</th>
            <th scope="col">Name</th>
            <th scope="col">Credits</th>
            <th scope="col">Enrolled Students</th>
            <th scope="col">Max Students</th>
            <th scope="col">Preparatory Course</th>
            <th scope="col">Incompatible courses</th>
            {removeCourseFromStudyPlan && <th scope="col">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={removeCourseFromStudyPlan ? 8 : 7}>
                {" "}
                No course inserted yet{" "}
              </td>
            </tr>
          ) : (
            data.map((course) => {
              return (
                <tr key={course.code}>
                  <th scope="row">{course.code}</th>
                  <td>{course.name}</td>
                  <td>{course.credits}</td>
                  <td>{course.enrolledStudents || "0"}</td>
                  <td>{course.maxStudents || "-"}</td>
                  <td>
                    {course.preparatoryCourse.length === 0
                      ? "-"
                      : course.preparatoryCourse.map((course) => course.code)}
                  </td>
                  <td>
                    {course.incompatibleCourses.length === 0
                      ? "-"
                      : course.incompatibleCourses
                          .map((course) => course.code)
                          .join(", ")}
                  </td>
                  {removeCourseFromStudyPlan && (
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          removeCourseFromStudyPlan(course);
                        }}
                      >
                        <i className="bi bi-x-lg"></i>
                      </Button>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </Col>
  );
}

export default StudyPlanList;
