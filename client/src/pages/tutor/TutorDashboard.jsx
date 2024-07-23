import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TutorProfile from './TutorProfile';
import TutorProfileApproval from './tutorProfileApproval';
import ScheduleAvailability from './ScheduleAvailability';
import TutorSidebar from '../../components/TutorSidebar'
import BookedSlots from './BookedSlots';

export default function TutorDashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <TutorSidebar />
      </div>
      <div className='flex-1 flex justify-center items-center'>
      {/* profile... */}
      {tab === 'profile' && <TutorProfile />}
      {/* profile-approval... */}
      {tab === 'apply_for_approval' && <TutorProfileApproval />}
      {/* users */}
      {tab === 'availability' && <ScheduleAvailability />}
      {tab === 'booked-slots' && <BookedSlots />}
      </div>
    </div>
  )
}




