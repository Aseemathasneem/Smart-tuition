import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { apiCall } from '../../api/apiCalls';
import endpoints from '../../api/endpoints';

export default function TutorSession() {
  const { sessionId } = useParams();
  const location = useLocation();
  const { studentId, tutorId } = location.state || {};
  const currentUser = useSelector((state) => state.tutor.currentUser);
  const tutorName = currentUser ? currentUser.name : 'Tutor';

  useEffect(() => {
    const appID = Number(import.meta.env.VITE_APP_ZEGO_APP_ID);
    const serverSecret = import.meta.env.VITE_APP_ZEGO_SERVER_SECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      sessionId,
      sessionId, // Using slotId as userId
      tutorName
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
          await apiCall('put',endpoints.MARK_ATTENDANCE(sessionId), {
            tutorId,
            tutorAttended: true,
          });
          console.log('Tutor left the room:', users);
        } catch (error) {
          console.error('Error marking tutor attendance:', error);
        }
      }
    });

    return () => {
      zp.leaveRoom();
    };
  }, [sessionId, tutorId]);

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-5">Tutoring Session</h2>
      <div id="video-call-container" className="video-call-container" style={{ width: '100%', height: '500px' }}></div>
    </div>
  );
}
