import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Card, TextInput, Label, Textarea, FileInput } from "flowbite-react";
import GradientButton from "../../components/GradientButton";
import { useSelector, useDispatch } from "react-redux";
import { apiCall } from "../../api/apiCalls";
import endpoints from "../../api/endpoints";
import { updateTutorStatus } from "../../redux/tutor/tutorSlice";
import { storage } from "../../firebase"; // Import storage from Firebase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import necessary functions from Firebase Storage

function TutorProfileApproval() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser: tutorUser } = useSelector((state) => state.tutor);
  const [subjects, setSubjects] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [formValues, setFormValues] = useState({
    qualification: "",
    experience: "",
    classes: [],
    subjects: "",
    syllabus: [],
    hourlyRate: "",
    certificate: null,
    bio: "",
    profilePicture: null,
  });

  const dispatch = useDispatch();

  const fetchSubjects = async () => {
    try {
      const response = await apiCall("get", endpoints.TUTOR_FETCH_SUBJECTS);
      setSubjects(
        response.data.map((subject) => ({
          value: subject.name,
          label: subject.name,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (tutorUser) {
      setFormValues({
        qualification: tutorUser.qualification || "",
        experience: tutorUser.experience || "",
        classes: tutorUser.classes || [],
        subjects: tutorUser.subjects || "",
        syllabus: tutorUser.syllabus || [],
        hourlyRate: tutorUser.hourlyRate || "",
        certificate: null,
        bio: tutorUser.bio || "",
        profilePicture: null,
      });
      setProfilePicture(tutorUser.profilePicture || null);
    }
  }, [tutorUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOptions, { name }) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: selectedOptions.map((option) => option.value),
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(URL.createObjectURL(file));
    setFormValues((prevValues) => ({
      ...prevValues,
      profilePicture: file,
    }));
  };

  const uploadImageToFirebase = async (file) => {
    const storageRef = ref(storage, `profilePictures/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      qualification,
      experience,
      classes,
      subjects,
      syllabus,
      hourlyRate,
      certificate,
      bio,
      profilePicture, // Use the selected file
    } = formValues;

    if (
      !qualification ||
      !experience ||
      !classes.length ||
      !subjects ||
      !syllabus.length ||
      !hourlyRate ||
      !certificate ||
      !bio ||
      !profilePicture
    ) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      // Upload profile picture to Firebase and get the download URL
      const profilePictureURL = await uploadImageToFirebase(profilePicture);

      const formData = new FormData();
      formData.append("qualification", qualification);
      formData.append("experience", experience);
      formData.append("classes", JSON.stringify(classes));
      formData.append("subjects", subjects);
      formData.append("syllabus", JSON.stringify(syllabus));
      formData.append("hourlyRate", hourlyRate);
      formData.append("certificate", certificate);
      formData.append("bio", bio);
      formData.append("profilePicture", profilePictureURL); // Use the download URL

      const response = await apiCall(
        "post",
        endpoints.TUTOR_PROFILE_UPDATE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLoading(false);

      if (response.data.success === false) {
        setErrorMessage(response.data.message);
      } else {
        setSuccessMessage(response.data.message);
        dispatch(updateTutorStatus("pending"));
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || error.message || "An error occurred"
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 dark:bg-gray-900">
      {tutorUser?.status === "rejected" && (
        <div className="text-red-500 text-lg font-semibold">
          Your application is rejected, for more details you can check your
          mail.
        </div>
      )}

      {/* Render the form only if the status is not rejected */}
      {tutorUser?.status !== "rejected" && (
        <>
          <Card className="w-full md:w-1/4 bg-blue-100 dark:bg-gray-800 border border-blue-300 dark:border-gray-700 p-4">
  <img
    src={profilePicture}
    alt="Profile Picture"
    className="w-20 h-20 rounded-full mx-auto mt-2 border-4 border-blue-500"
  />
  <div className="p-2 text-center">
    <h5 className="text-lg font-semibold text-blue-900 dark:text-white">
      {tutorUser?.name}
    </h5>
    <p className="text-gray-500 dark:text-gray-400 text-sm">
      {tutorUser?.email}
    </p>
    <p className="text-blue-500 text-sm">
      Profile Status: {tutorUser?.status || "Pending Approval"}
    </p>
  </div>
  <div className="mt-2 text-center">
    <Label
      htmlFor="profilePicture"
      value="Upload Profile Photo"
      className="text-blue-900 dark:text-blue-300 text-sm"
    />
    <div className="relative inline-block mt-1">
      <input
        type="file"
        id="profilePicture"
        name="profilePicture"
        accept="image/*"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
      />
      <GradientButton
        type="button"
        className="rounded-full text-xs px-3 py-1"
        onClick={() => document.getElementById("profilePicture").click()}
      >
        Choose File
      </GradientButton>
    </div>
  </div>
</Card>

          {/* Right Card */}
          <Card className="w-full md:w-3/4 p-8 bg-blue-100 dark:bg-gray-800 border border-blue-300 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-white mb-4">
              Kindly fill out the form to apply for approval
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* other Form Fields */}
                <div>
                  <Label
                    htmlFor="qualification"
                    value="Qualification"
                    className="text-blue-900 dark:text-blue-300"
                  />
                  <TextInput
                    id="qualification"
                    name="qualification"
                    type="text"
                    placeholder="Enter qualification"
                    className="border-blue-300 dark:border-blue-600"
                    onChange={handleInputChange}
                    value={formValues.qualification}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="experience"
                    value="Experience (Years)"
                    className="text-blue-900 dark:text-blue-300"
                  />
                  <TextInput
                    id="experience"
                    name="experience"
                    type="number"
                    placeholder="Enter years of experience"
                    className="border-blue-300 dark:border-blue-600"
                    onChange={handleInputChange}
                    value={formValues.experience}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="classes"
                    value="Classes"
                    className="text-blue-900 dark:text-blue-300"
                  />
                  <Select
                    id="classes"
                    name="classes"
                    isMulti
                    options={[
                      { value: "1", label: "1" },
                      { value: "2", label: "2" },
                      { value: "3", label: "3" },
                      { value: "4", label: "4" },
                      { value: "5", label: "5" },
                      { value: "6", label: "6" },
                      { value: "7", label: "7" },
                      { value: "8", label: "8" },
                      { value: "9", label: "9" },
                      { value: "10", label: "10" },
                    ]}
                    className="border-blue-300 dark:border-blue-600"
                    onChange={(selected) =>
                      handleSelectChange(selected, { name: "classes" })
                    }
                    value={formValues.classes.map((value) => ({
                      value,
                      label: value,
                    }))}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="subjects"
                    value="Subject"
                    className="text-blue-900 dark:text-blue-300"
                  />
                  <Select
                    id="subjects"
                    name="subjects"
                    options={subjects}
                    className="border-blue-300 dark:border-blue-600 w-full p-2 rounded"
                    onChange={(selected) =>
                      handleSelectChange([selected], { name: "subjects" })
                    }
                    value={
                      formValues.subjects
                        ? {
                            value: formValues.subjects,
                            label: formValues.subjects,
                          }
                        : null
                    }
                  />
                </div>

                <div>
                  <Label
                    htmlFor="syllabus"
                    value="Syllabus"
                    className="text-blue-900 dark:text-blue-300"
                  />
                  <Select
                    id="syllabus"
                    name="syllabus"
                    isMulti
                    options={[
                      { value: "State syllabus", label: "State syllabus" },
                      { value: "CBSE", label: "CBSE" },
                      { value: "ICSE", label: "ICSE" },
                    ]}
                    className="border-blue-300 dark:border-blue-600"
                    onChange={(selected) =>
                      handleSelectChange(selected, { name: "syllabus" })
                    }
                    value={formValues.syllabus.map((value) => ({
                      value,
                      label: value,
                    }))}
                  />
                  <div className="text-gray-600 mt-1">
                    {formValues.syllabus.join(", ")}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="hourlyRate"
                    value="Hourly Rate"
                    className="text-blue-900 dark:text-blue-300"
                  />
                  <TextInput
                    id="hourlyRate"
                    name="hourlyRate"
                    type="number"
                    placeholder="Enter hourly rate"
                    className="border-blue-300 dark:border-blue-600"
                    onChange={handleInputChange}
                    value={formValues.hourlyRate}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="bio"
                    value="Bio"
                    className="text-blue-900 dark:text-blue-300"
                  />
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us about yourself"
                    className="border-blue-300 dark:border-blue-600"
                    rows={4}
                    onChange={handleInputChange}
                    value={formValues.bio}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="certificate"
                    value="Upload Certificate"
                    className="text-blue-900 dark:text-blue-300"
                  />
                  <FileInput
                    id="certificate"
                    name="certificate"
                    accept=".pdf"
                    className="border-blue-300 dark:border-blue-600"
                    onChange={(e) => {
                      setFormValues((prevValues) => ({
                        ...prevValues,
                        certificate: e.target.files[0],
                      }));
                    }}
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="text-red-500 mt-4">{errorMessage}</div>
              )}
              {successMessage && (
                <div className="text-green-500 mt-4">{successMessage}</div>
              )}

              <div className="mt-4 flex justify-center">
                <GradientButton type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit for Approval"}
                </GradientButton>
              </div>
            </form>
          </Card>
        </>
      )}
    </div>
  );
}

export default TutorProfileApproval;
