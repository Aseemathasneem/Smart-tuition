import { Button, Label, TextInput, Textarea, FileInput, Select, Checkbox, Card } from 'flowbite-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { apiCall } from '../../utils/api';

export default function TutorProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    qualification: '',
    classes: '',
    subjects: '',
    hourlyRate: '',
    availableTime: '',
    availableDays: [],
    certificate: null,
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, certificate: e.target.files[0] });
  };

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;
    setFormData((prevData) => {
      const availableDays = checked
        ? [...prevData.availableDays, id]
        : prevData.availableDays.filter((day) => day !== id);
      return { ...prevData, availableDays };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      qualification,
      classes,
      subjects,
      hourlyRate,
      availableTime,
      availableDays,
      certificate,
      bio
    } = formData;

    if (
      !qualification ||
      !classes ||
      !subjects ||
      !hourlyRate ||
      !availableTime ||
      availableDays.length === 0 ||
      !certificate ||
      !bio
    ) {
      setErrorMessage('Please fill all the fields.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    try {
      const response = await apiCall('post', '/tutor/profile', formDataObj);
      setLoading(false);

      if (response.data.success === false) {
        setErrorMessage(response.data.message);
      } else {
        setSuccessMessage('Profile submitted for approval.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <div className="flex items-center space-x-4 mb-6">
            <img src={currentUser.profilePicture} alt="Profile" className="w-16 h-16 rounded-full" />
            <div>
              <h2 className="text-xl font-semibold">{currentUser.name}</h2>
              <p>{currentUser.email}</p>
            </div>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="qualification" value="Qualification" />
              <TextInput id="qualification" type="text" onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="classes" value="Classes for Tutoring" />
              <TextInput id="classes" type="text" onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="subjects" value="Subjects for Tutoring" />
              <TextInput id="subjects" type="text" onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="hourlyRate" value="Hourly Rate" />
              <TextInput id="hourlyRate" type="number" onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="availableTime" value="Available Time" />
              <TextInput id="availableTime" type="text" onChange={handleChange} required />
            </div>
            <div>
              <Label value="Available Days" />
              <div className="flex flex-wrap gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <Checkbox
                    key={day}
                    id={day}
                    name="availableDays"
                    label={day}
                    onChange={handleCheckboxChange}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="certificate" value="Upload Qualification Certificate" />
              <FileInput id="certificate" onChange={handleFileChange} required />
            </div>
            <div>
              <Label htmlFor="bio" value="BIO" />
              <Textarea id="bio" rows={4} onChange={handleChange} required />
            </div>
            <Button gradientDuoTone="purpleToBlue" type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Send for Approval'}
            </Button>
          </form>
          {errorMessage && (
            <Alert color="failure" className="mt-5">
              {errorMessage}
            </Alert>
          )}
          {successMessage && (
            <Alert color="success" className="mt-5">
              {successMessage}
            </Alert>
          )}
        </Card>
      </div>
    </div>
  );
}
