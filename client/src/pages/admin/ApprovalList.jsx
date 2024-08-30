import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApprovalRequests, approveRequest, rejectRequest, clearSuccessMessage } from '../../redux/admin/adminSlice';
import { Button, Card, Modal } from 'flowbite-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ApprovalList() {
  const dispatch = useDispatch();
  const { approvalRequests, loading, error, successMessage } = useSelector((state) => state.admin);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState('');
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [currentRequestId, setCurrentRequestId] = useState(null);

  useEffect(() => {
    dispatch(fetchApprovalRequests());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccessMessage());
    }
  }, [successMessage, dispatch]);

  const handleApprove = (requestId) => {
    dispatch(approveRequest(requestId));
  };

  const handleReject = (requestId) => {
    setCurrentRequestId(requestId);
    setIsRejectionModalOpen(true);
  };

  const handleViewCertificate = (url) => {
    console.log('Certificate URL:', url); 
    setCertificateUrl(url);
    setIsModalOpen(true);
  };

  const submitRejectionReason = () => {
    if (rejectionReason.trim()) {
      dispatch(rejectRequest({ requestId: currentRequestId, reason: rejectionReason }));
      setIsRejectionModalOpen(false);
      setRejectionReason('');
    } else {
      toast.error('Please enter a rejection reason.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-5">Approval Requests</h2>
      {approvalRequests.length === 0 && (
        <p className="text-lg">Currently no approval requests.</p>
      )}
      <div className="space-y-6">
        {approvalRequests.map((request) => {
          // Ensure request.tutor is defined
          if (!request.tutor) {
            return null;
          }
          const availableDays = request.tutor.availableDays ? JSON.parse(request.tutor.availableDays) : [];

          return (
            <Card key={request._id} className="w-full bg-white dark:border-gray-700 dark:bg-gray-800 p-4">
              <div className="flex items-center mb-4">
                <img
                  src={request.tutor.profilePicture}
                  alt={request.tutor.name}
                  className="h-16 w-16 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-bold">{request.tutor.name}</h3>
                  <p className="text-sm text-gray-500">{request.tutor.email}</p>
                </div>
              </div>
              <div className="mb-4">
                <p><strong>Subjects:</strong> {request.tutor.subjects}</p>
                <p><strong>Classes for tutoring:</strong> {JSON.parse(request.tutor.classes).join(', ')}</p>
               <p><strong>Syllabus:</strong> {JSON.parse(request.tutor.syllabus).join(', ')}</p>

                <p><strong>Hourly Rate:</strong> Rs.{request.tutor.hourlyRate}</p>
                <p><strong>Bio:</strong> {request.tutor.bio}</p>
                <a
                  href="#"
                  className="text-blue-600 underline"
                  onClick={(e) => {
                    e.preventDefault();
                    handleViewCertificate(request.tutor.certificate);
                  }}
                >
                  View Certificate
                </a>
              </div>
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <Button
                    gradientDuoTone='greenToBlue'
                    onClick={() => handleApprove(request._id)}
                  >
                    Approve
                  </Button>
                  <Button
                    gradientDuoTone='pinkToOrange'
                    onClick={() => handleReject(request._id)}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="4xl">
        <Modal.Header>Certificate</Modal.Header>
        <Modal.Body>
          <iframe
            src={`${import.meta.env.VITE_API_URL}/${certificateUrl}`}
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

      <Modal show={isRejectionModalOpen} onClose={() => setIsRejectionModalOpen(false)} size="md">
        <Modal.Header>Rejection Reason</Modal.Header>
        <Modal.Body>
          <textarea
            className="w-full p-2 border rounded"
            rows="4"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter the reason for rejection"
          ></textarea>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setIsRejectionModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submitRejectionReason}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
}
