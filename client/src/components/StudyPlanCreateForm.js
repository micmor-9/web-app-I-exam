import { Form, FormControl, FormLabel } from "react-bootstrap";

function StudyPlanCreateForm(props) {
  return (
    <Form>
      <Form.Group className="mb-3" controlId="studyPlanOption">
        <FormLabel>Option</FormLabel>
        <FormControl type="text"></FormControl>
      </Form.Group>
    </Form>
  );
}

export default StudyPlanCreateForm;
