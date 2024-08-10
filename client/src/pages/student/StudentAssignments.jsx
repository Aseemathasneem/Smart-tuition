import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentAssignments,submitAssignmentAnswer } from '../../redux/assignment/assignmentSlice';
import { Card, Button, TextInput, FileInput, Modal } from 'flowbite-react';
import { useToast } from '../../contexts/ToastContext';

const StudentAssignments = () => {
  const dispatch = useDispatch();
  const assignments = useSelector(state => state.assignment.studentAssignments);
  const studentId = useSelector(state => state.student.currentUser._id);
  const submissionStatus = useSelector(state => state.assignment.submissionStatus);
  const showToast = useToast();

  const [answers, setAnswers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);

  useEffect(() => {
    if (studentId) {
      console.log('Fetching assignments for studentId:', studentId);
      dispatch(fetchStudentAssignments(studentId));
    }
  }, [dispatch, studentId]);

  useEffect(() => {
    console.log('Assignments state updated:', assignments);
  }, [assignments]);

  const handleFileChange = (e) => {
    setAnswers({
      ...answers,
      file: e.target.files[0]
    });
  };

  const handleTextChange = (e) => {
    setAnswers({
      ...answers,
      text: e.target.value
    });
  };

  const handleSubmit = () => {
    const answer = answers;
    if (answer) {
      const formData = new FormData();
      formData.append('file', answer.file);
      formData.append('assignmentId', currentAssignment._id);
      formData.append('studentId', studentId);
      
      dispatch(submitAssignmentAnswer(formData)).then(() => {
        showToast('Answer submitted successfully', 'success');
      }).catch(() => {
        showToast('Failed to submit answer', 'error');
      });
    }
    setShowModal(false);
  };

  const openModal = (assignment) => {
    setCurrentAssignment(assignment);
    setShowModal(true);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">Your Assignments</h1>
      <div className="flex flex-col gap-4 w-full">
        {assignments.map((assignment) => (
          <Card key={assignment._id} className="w-full">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">{assignment.title}</h2>
                <p><strong>Tutor:</strong> {assignment.tutorId.name}</p>
                <p><strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</p>
                <p><strong>Subject:</strong> {assignment.subject}</p>
                <p><strong>Instructions:</strong> {assignment.instructions}</p>
                <p><strong>Description:</strong> {assignment.description}</p>
                <p><strong>Grade:</strong> {assignment.grade}</p>
              </div>
              {submissionStatus[assignment._id] === 'submitted' ? (
                <span className="text-green-500  font-bold">Answer Submitted</span>
              ) : (
                <Button onClick={() => openModal(assignment)}>
                  Upload Your Assignment
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
      
      {showModal && (
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
        >
          <Modal.Header>
            Submit Your Answer
          </Modal.Header>
          <Modal.Body>
            
            <FileInput
              onChange={handleFileChange}
            />
              <p className="text-sm text-gray-600 p-1">
              Accepted file formats: PDF (.pdf), Microsoft Word (.docx), and plain text (.txt).<br />
              Maximum file size: 4 MB.<br />
              Please ensure your file is in one of the accepted formats before uploading.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleSubmit}>
              Submit
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default StudentAssignments;
