import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import ReviewModal from './ReviewModal';
import { apiCall } from '../../api/apiCalls';
import endpoints from '../../api/endpoints';

export default function StudentSession() {
  const { sessionId } = useParams();
  const location = useLocation();
  const { studentId, tutorId } = location.state || {};
  const [showReviewModal, setShowReviewModal] = useState(false);
  const currentUser = useSelector((state) => state.student.currentUser);
  const studentName = currentUser ? currentUser.name : 'student';

  useEffect(() => {
    const appID = Number(import.meta.env.VITE_APP_ZEGO_APP_ID);
    const serverSecret = import.meta.env.VITE_APP_ZEGO_SERVER_SECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      sessionId,
      `${sessionId}_student`,
      studentName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: document.getElementById('video-call-container'),
      scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
      onJoinRoom: (users) => {
        // You can handle any logic needed when the room is joined
      },
      onLeaveRoom: async (users) => {
        try {
          await apiCall('put', endpoints.MARK_ATTENDANCE(sessionId), {
            studentId,
            studentAttended: true,
          });
          console.log('Student left the room:', users);
        } catch (error) {
          console.error('Error marking student attendance:', error);
        }
        setShowReviewModal(true);
      }
    });

    return () => {
      zp.leaveRoom();
    };
  }, [sessionId]);

  const handleReviewSubmit = async (reviewData) => {
    const dataToSubmit = {
      studentId,
      tutorId,
      sessionId,
      ...reviewData
    };
    try {
      const response = await apiCall('post', endpoints.STUDENT_SUBMIT_REVIEW, dataToSubmit);

      if (response.status === 201) {
        console.log('Review submitted successfully:', response.data);
        setShowReviewModal(false); // Close the modal after successful submission
      } else {
        console.error('Failed to submit review:', response.data.message);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-5">Tutoring Session</h2>
      <div id="video-call-container" className="video-call-container" style={{ width: '100%', height: '500px' }}></div>
      <ReviewModal
        show={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}
