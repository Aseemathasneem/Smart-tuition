import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubmittedAssignments, gradeSubmission } from '../../redux/assignment/assignmentSlice';
import { Card, Button, Modal, TextInput } from 'flowbite-react';
import GradientButton from '../../components/GradientButton';
import { useToast } from '../../contexts/ToastContext';

const TutorSubmittedAssignments = () => {
  const dispatch = useDispatch();
  const showToast = useToast(); // Import the useToast hook
  const currentUser = useSelector(state => state.tutor.currentUser);
  const tutorId = currentUser?._id;
  const { submittedAssignments, loading, error } = useSelector(state => state.assignment);

  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grade, setGrade] = useState('');
  const [remarks, setRemarks] = useState(''); 

  useEffect(() => {
    if (tutorId) {
      dispatch(fetchSubmittedAssignments(tutorId));
    }
  }, [dispatch, tutorId]);

  const openFileModal = (file) => {
    setFileUrl(file);
    console.log(`File URL: ${import.meta.env.VITE_API_URL}/${file}`);
    setIsFileModalOpen(true);
  };

  const openGradeModal = (submission) => {
    setSelectedSubmission(submission);
    setIsGradeModalOpen(true);
  };

  const handleGradeSubmission = async () => {
    if (selectedSubmission) {
      await dispatch(gradeSubmission({ 
        submissionId: selectedSubmission._id, 
        grade, 
        remarks 
      }));
      showToast('Mark submitted successfully', 'success');
      setIsGradeModalOpen(false);
      if (tutorId) {
        dispatch(fetchSubmittedAssignments(tutorId));
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">Submitted Assignments</h1>
      <div className="flex flex-col gap-4 w-full">
        {submittedAssignments.length === 0 ? (
          <div>No submitted assignments</div>
        ) : (
          submittedAssignments.map((assignment) => (
            <Card key={assignment._id} className="w-full">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{assignment.title}</h2>
                  <p><strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</p>
                  <p><strong>Subject:</strong> {assignment.subject}</p>
                  <p><strong>Description:</strong> {assignment.description}</p>
                  <p><strong>Grade:</strong> {assignment.grade}</p>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">Submissions:</h3>
                    {assignment.submissions && assignment.submissions.length > 0 ? (
                      assignment.submissions.map(submission => (
                        <div key={submission._id} className="mt-2 p-2 border rounded">
                          <p><strong>Student:</strong> {submission.studentId.name}</p>
                          <p><strong>Submission Date:</strong> {new Date(submission.createdAt).toLocaleDateString()}</p>
                          <p className='mb-5'>
                            <strong>Answer File:</strong> 
                            <a href="#" className="text-blue-600 underline" onClick={() => openFileModal(submission.file)}>
                              View Answer file
                            </a>
                          </p>
                          {submission.status === 'verified' ? (
                            <GradientButton disabled>
                              Verified
                            </GradientButton>
                          ) : (
                            <GradientButton onClick={() => openGradeModal(submission)}>
                              Grade Assignment
                            </GradientButton>
                          )}
                        </div>
                      ))
                    ) : (
                      <div>No submissions</div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* File Viewing Modal */}
      <Modal show={isFileModalOpen} onClose={() => setIsFileModalOpen(false)} size="4xl">
        <Modal.Header>Answer File</Modal.Header>
        <Modal.Body>
          <iframe
            src={`${import.meta.env.VITE_API_URL}/${fileUrl}`}
            
            frameBorder="0"
            width="100%"
            height="500px"
          ></iframe>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setIsFileModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Grading Modal */}
      <Modal show={isGradeModalOpen} onClose={() => setIsGradeModalOpen(false)} size="md">
        <Modal.Header>Grade Assignment</Modal.Header>
        <Modal.Body>
          <TextInput
            label="Grade"
            type="number"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="Enter grade"
          />
          <TextInput
            label="Remarks"
            type="text"
            value={remarks} 
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter remarks"
            className="mt-4" 
          />
        </Modal.Body>
        <Modal.Footer>
          <GradientButton onClick={handleGradeSubmission}>
            Submit Grade
          </GradientButton>
          <Button onClick={() => setIsGradeModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TutorSubmittedAssignments;
