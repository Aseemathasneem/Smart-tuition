import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTutors, blockTutor, unblockTutor } from '../../redux/admin/adminSlice'; 
import { Button, Table } from 'flowbite-react';


export default function TutorsList() {
  const dispatch = useDispatch();
  const { tutors, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchTutors());
  }, [dispatch]);

  useEffect(() => {
    console.log("Fetched Tutors:", tutors);
  }, [tutors]);

  const handleBlockUnblock = (tutorId, isBlocked) => {
    if (isBlocked) {
      dispatch(unblockTutor(tutorId)); // Replace with your unblock tutor action
    } else {
      dispatch(blockTutor(tutorId)); // Replace with your block tutor action
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
   
      <div className="min-h-screen p-6">
        <h2 className="text-2xl font-bold mb-5">Tutor List</h2>
        <Table hoverable={true}>
          <Table.Head>
            <Table.HeadCell>Profile Image</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {tutors.map((tutor) => (
              <Table.Row key={tutor._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>
                  <img src={tutor.profilePicture} alt={tutor.name} className="h-10 w-10 rounded-full" />
                </Table.Cell>
                <Table.Cell>{tutor.name}</Table.Cell>
                <Table.Cell>{tutor.email}</Table.Cell>
                <Table.Cell>
                  <Button
                    gradientDuoTone={tutor.isBlocked ? 'pinkToOrange' : 'greenToBlue'}
                    onClick={() => handleBlockUnblock(tutor._id, tutor.isBlocked)}
                  >
                    {tutor.isBlocked ? 'Unblock' : 'Block'}
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    
  );
}
