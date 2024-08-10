import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, TextInput, Textarea, Select } from 'flowbite-react';
import { fetchSubjects } from '../../redux/subjects/subjectsSlice'; 
import { fetchStudents } from '../../redux/tutor/tutorSlice';
import { createAssignment } from '../../redux/assignment/assignmentSlice';
import { useToast } from '../../contexts/ToastContext';


const PostAssignment = () => {
  const dispatch = useDispatch();
  const subjects = useSelector((state) => state.subjects.subjects);
  const students = useSelector((state) => state.tutor.students); 
  const [title, setTitle] = useState('');
  const currentUser = useSelector(state => state.tutor.currentUser);
  const tutorId = currentUser?._id;
  const showToast = useToast();

  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
 
  const [studentId, setStudentId] = useState('');
  const [subject, setSubject] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [instructions, setInstructions] = useState('');
  const [grade, setGrade] = useState('');

  useEffect(() => {
    dispatch(fetchSubjects());
    dispatch(fetchStudents());
   
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const assignmentData = {
      title,
      description,
      dueDate,
      tutorId,
      studentId,
      subject,
      instructions,
      grade
    };

    try {
      await dispatch(createAssignment(assignmentData)).unwrap();
      showToast('Assignment created successfully!', 'success');
      // Clear the form after successful submission
      setTitle('');
      setDescription('');
      setDueDate('');
      setStudentId('');
      setSubject('');
      setInstructions('');
      setGrade('');
    } catch (error) {
      showToast(`Failed to create assignment: ${error.message}`, 'error');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-3 w-full">
      <Card className="max-w-3xl w-full h-full">
        <h2 className="text-2xl font-bold mb-4 text-center">CREATE YOUR ASSIGNMENT</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <TextInput
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Assignment Title"
              required
            />
          </div>
          <div className="mb-4">
            <TextInput
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              
              required
            />
          </div>
          <div className="mb-4">
            <Select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Select Student"
              required
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="mb-4">
            <Select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Select Subject"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="mb-4">
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Instructions or Question"
              required
            />
          </div>
          <div className="mb-4">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              required
            />
          </div>
          <div className="mb-4">
            <TextInput
              type="number"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="Total Grade for assignment"
              required
            />
          </div>
          <Button type="submit">
            Post Assignment
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default PostAssignment;
