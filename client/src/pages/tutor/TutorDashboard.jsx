import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TutorProfile from './TutorProfile';
import TutorProfileApproval from './tutorProfileApproval';
import ScheduleAvailability from './ScheduleAvailability';
import TutorSidebar from '../../components/TutorSidebar'
import BookedSlots from './BookedSlots';
import AvailableSlots from './AvailableSlots'
import PostAssignment from './PostAssignment';
import TutorSubmittedAssignments from './TutorSubmittedAssignments';
import DashboardContent from './DashboardContent';







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
      <div className='flex-1 p-4'>
        {tab === 'dash' && <DashboardContent />}
        {tab === 'profile' && <TutorProfile />}
        {tab === 'apply_for_approval' && <TutorProfileApproval />}
        {tab === 'availability' && <ScheduleAvailability />}
        {tab === 'booked-slots' && <BookedSlots />}
        {tab === 'available-slots' && <AvailableSlots />}
        {tab === 'post-assignment' && <PostAssignment />}
        {tab === 'submitted-assignments' && <TutorSubmittedAssignments />}
      </div>
    </div>
  );
}




