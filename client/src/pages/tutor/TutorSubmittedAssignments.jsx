import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubmittedAssignments } from '../../redux/assignment/assignmentSlice';
import { Card, Button, Modal } from 'flowbite-react';

const TutorSubmittedAssignments = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.tutor.currentUser);
  const tutorId = currentUser?._id;
  const { submittedAssignments, loading, error } = useSelector(state => state.assignment);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => {
    if (tutorId) {
      dispatch(fetchSubmittedAssignments(tutorId));
    }
  }, [dispatch, tutorId]);

  const openModal = (file) => {
    setFileUrl(file);
    setIsModalOpen(true);
  };

  const handleVerify = (assignmentId) => {
    // Implement the verification logic here
    console.log(`Verifying assignment with ID: ${assignmentId}`);
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
                          <p>
                            <strong>Answer File:</strong> 
                            <a href="#"className="text-blue-600 underline" onClick={() => openModal(submission.file)}>
                              View Answer file
                            </a>
                          </p>
                        </div>
                      ))
                    ) : (
                      <div>No submissions</div>
                    )}
                  </div>
                </div>
                <Button onClick={() => handleVerify(assignment._id)}>
                  Verify Assignment
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="4xl">
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
          <Button onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TutorSubmittedAssignments;
