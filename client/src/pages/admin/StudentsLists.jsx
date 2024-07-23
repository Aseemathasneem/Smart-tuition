import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents, blockStudent, unblockStudent } from '../../redux/admin/adminSlice';
import { Button, Table } from 'flowbite-react';


export default function StudentsList() {
  const dispatch = useDispatch();
  const { students, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  useEffect(() => {
    console.log("Fetched Students:", students);
  }, [students]);

  const handleBlockUnblock = (studentId, isBlocked) => {
    if (isBlocked) {
      dispatch(unblockStudent(studentId));
    } else {
      dispatch(blockStudent(studentId));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
   
      <div className="min-h-screen p-6">
        <h2 className="text-2xl font-bold mb-5">Student List</h2>
        <Table hoverable={true}>
          <Table.Head>
            <Table.HeadCell>Profile Image</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {students.map((student) => (
              <Table.Row key={student._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>
                  <img src={student.profilePicture} alt={student.name} className="h-10 w-10 rounded-full" />
                </Table.Cell>
                <Table.Cell>{student.name}</Table.Cell>
                <Table.Cell>{student.email}</Table.Cell>
                <Table.Cell>
                  <Button
                    gradientDuoTone={student.isBlocked ? 'pinkToOrange' : 'greenToBlue'}
                    onClick={() => handleBlockUnblock(student._id, student.isBlocked)}
                    color={student.isBlocked ? 'pink' : 'green'}
                  >
                    {student.isBlocked ? 'Unblock' : 'Block'}
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    
  );
}
