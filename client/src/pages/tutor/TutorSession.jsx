import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

export default function TutorSession() {
  const { slotId } = useParams();

  useEffect(() => {
    const appID = Number(import.meta.env.VITE_APP_ZEGO_APP_ID);
    const serverSecret = import.meta.env.VITE_APP_ZEGO_SERVER_SECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      slotId,
      slotId, // Using slotId as userId
      'Tutor'
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: document.getElementById('video-call-container'),
      scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
    });
  }, [slotId]);

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-5">Tutoring Session</h2>
      <div id="video-call-container" className="video-call-container" style={{ width: '100%', height: '500px' }}></div>
    </div>
  );
}
