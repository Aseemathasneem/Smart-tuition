import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentAssignments, submitAssignmentAnswer } from '../../redux/assignment/assignmentSlice';
import { Card, Button, FileInput, Modal } from 'flowbite-react';
import { useToast } from '../../contexts/ToastContext';
import GradientButton from '../../components/GradientButton';

const StudentAssignments = () => {
  const dispatch = useDispatch();
  const assignments = useSelector(state => state.assignment.studentAssignments);
  const currentUser = useSelector(state => state.student.currentUser);
  const showToast = useToast();
  
  const [answers, setAnswers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);

  useEffect(() => {
    if (currentUser && currentUser._id) {
      console.log('Fetching assignments for studentId:', currentUser._id);
      dispatch(fetchStudentAssignments(currentUser._id));
    }
  }, [dispatch, currentUser]);

  const handleFileChange = (e) => {
    setAnswers({
      ...answers,
      file: e.target.files[0]
    });
  };

  const handleSubmit = () => {
    if (currentAssignment && currentUser) {
      const formData = new FormData();
      formData.append('file', answers.file);
      formData.append('assignmentId', currentAssignment._id);
      formData.append('studentId', currentUser._id);
      
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

  if (!currentUser) {
    return <div>Loading...</div>; // Or a more sophisticated loader/spinner
  }

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6">Your Assignments</h1>
      <p className="text-lg text-blue-600 dark:text-gray-400 mb-8">Stay on top of your tasks and submit your assignments on time.</p>
      
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
                <p><strong>Total Mark:</strong> {assignment.grade}</p>
              </div>
              {assignment.status === 'assigned' ? (
                <GradientButton onClick={() => openModal(assignment)}>
                  Upload Your Assignment
                </GradientButton>
              ) : assignment.status === 'completed' ? (
                <span className="text-green-500 font-bold">Answer Submitted</span>
              ) : assignment.status === 'verified' && assignment.tutorAssignedGrade !== undefined ? (
                <div className="mt-4">
  <div className="flex flex-col">
    <div className="flex items-center space-x-2">
      <span className="text-blue-500 font-bold">Your Mark:</span>
      <span className="text-blue-500 font-bold">{assignment.tutorAssignedGrade}</span>
    </div>
    <div className="mt-2">
      <p className="text-green-500 dark:text-gray-300"><strong>Remarks:</strong> {assignment.remarks || 'No remarks provided'}</p>
    </div>
  </div>
</div>

              
              ) : null}
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
            <FileInput onChange={handleFileChange} />
            <p className="text-sm text-gray-600 p-1">
              Accepted file formats: PDF (.pdf), Microsoft Word (.docx), and plain text (.txt).<br />
              Maximum file size: 4 MB.<br />
              Please ensure your file is in one of the accepted formats before uploading.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <GradientButton onClick={handleSubmit}>
              Submit
            </GradientButton>
            <Button color="failure" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default StudentAssignments;
