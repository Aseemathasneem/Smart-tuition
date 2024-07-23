import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table, TextInput, Modal } from 'flowbite-react';
import Swal from 'sweetalert2';
import { addSubject, fetchSubjects, updateSubject } from '../../redux/subjects/subjectsSlice';
import { apiCall } from '../../api/apiCalls';
import endpoints from '../../api/endpoints';

const SubjectsLists = () => {
  const [newSubject, setNewSubject] = useState('');
  const [editSubject, setEditSubject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  const { subjects, loading, error } = useSelector((state) => state.subjects);

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  const handleAddSubject = () => {
    if (newSubject.trim() !== '') {
      dispatch(addSubject({ name: newSubject }));
      setNewSubject('');
    }
  };

  const confirmDeleteSubject = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await apiCall('delete', `${endpoints.DELETE_SUBJECT}/${id}`);
        Swal.fire('Deleted!', 'Your subject has been deleted.', 'success');
        dispatch(fetchSubjects()); 
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete subject.', 'error');
      }
    }
  };

  const handleUpdateSubject = () => {
    if (editSubject && editSubject.name.trim() !== '') {
      const { _id, name } = editSubject;
      dispatch(updateSubject({ id: _id, name }));
      setShowModal(false);
      setEditSubject(null);
    }
  };

  const openEditModal = (subject) => {
    setEditSubject(subject);
    setShowModal(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Subjects Management</h2>
      <div className="mb-4">
        <TextInput
          type="text"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          placeholder="Enter new subject"
        />
        <Button onClick={handleAddSubject} className="ml-1 mt-2">
          Add Subject
        </Button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <Table>
        <Table.Head>
          <Table.HeadCell>Sl. No</Table.HeadCell>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {subjects.map((subject, index) => (
            <Table.Row key={subject._id}>
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell>{subject.name}</Table.Cell>
              <Table.Cell className="flex">
                <Button onClick={() => openEditModal(subject)} className="mr-2">
                  Edit
                </Button>
                <Button onClick={() => confirmDeleteSubject(subject._id)} color="failure">
                  Delete
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {editSubject && (
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <Modal.Header>Edit Subject</Modal.Header>
          <Modal.Body>
            <TextInput
              type="text"
              value={editSubject?.name || ''}
              onChange={(e) => setEditSubject({ ...editSubject, name: e.target.value })}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleUpdateSubject}>Update</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default SubjectsLists;
