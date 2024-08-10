import { Card, Alert, Button, Label, Spinner, TextInput, Textarea, FileInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from 'react-redux';
import { apiCall } from '../../api/apiCalls'; 
import endpoints from '../../api/endpoints';
import { updateTutorStatus } from '../../redux/tutor/tutorSlice';

export default function TutorProfileApproval() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser: tutorUser } = useSelector((state) => state.tutor);
  const [subjects, setSubjects] = useState([]);
  const dispatch = useDispatch();

  const fetchSubjects = async () => {
    try {
      const response = await apiCall('get', endpoints.TUTOR_FETCH_SUBJECTS);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadSubjects = async () => {
      const fetchedSubjects = await fetchSubjects();
      setSubjects(fetchedSubjects);
    };
    loadSubjects();
  }, []);

  useEffect(() => {
    if (tutorUser) {
      formik.setValues({
        qualification: tutorUser.qualification || "",
        classes: tutorUser.classes || "",
        subjects: tutorUser.subjects || "",
        hourlyRate: tutorUser.hourlyRate || "",
        certificate: tutorUser.certificate || null,
        bio: tutorUser.bio || "",
      });
    }
  }, [tutorUser]);

  const formik = useFormik({
    initialValues: {
      qualification: "",
      classes: "",
      subjects: "",
      hourlyRate: "",
      certificate: null,
      bio: "",
    },
    validationSchema: Yup.object({
      qualification: Yup.string().required("Qualification is required"),
      classes: Yup.string().required("Classes for tutoring are required"),
      subjects: Yup.string().required("Subjects for tutoring are required"),
      hourlyRate: Yup.number().required("Hourly rate is required").typeError("Hourly rate must be a number"),
      certificate: Yup.mixed().required("Qualification certificate is required").test(
        "fileFormat",
        "Only PDF files are allowed",
        value => value && value.type === "application/pdf"
      ),
      bio: Yup.string().required("Bio is required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const formData = new FormData();
        formData.append('qualification', values.qualification);
        formData.append('classes', values.classes);
        formData.append('subjects', values.subjects);
        formData.append('hourlyRate', values.hourlyRate);
        formData.append('certificate', values.certificate);
        formData.append('bio', values.bio);

        const response = await apiCall('post', endpoints.TUTOR_PROFILE_UPDATE, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });

        setLoading(false);

        if (response.data.success === false) {
          setErrorMessage(response.data.message);
        } else {
          setSuccessMessage(response.data.message);
          dispatch(updateTutorStatus('pending'));
        }
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || error.message || "An error occurred"
        );
        setLoading(false);
      }
    },
  });

  const renderApprovalStatus = () => {
    if (tutorUser.status === 'approved') {
      return (
        <div className="flex-1 overflow-y-auto bg-gray-200 p-3 max-w-3xl mx-auto">
          <div className="min-h-screen flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold">Your Profile is Already Approved</h2>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex justify-center items-center min-h-screen p-3 w-full">
          <Card className="max-w-3xl w-full h-full">
            <div className="overflow-y-auto h-screen p-4">
              <div className="flex-1 overflow-y-auto">
                <div className="min-h-screen mt-20 p-3 flex-col gap-5">
                  <div className="flex flex-col items-center">
                    <img src={tutorUser?.profilePicture} alt="Profile" className="h-24 w-24 rounded-full" />
                    <h2 className="text-2xl font-bold mt-2">{tutorUser?.name}</h2>
                    <p className="text-sm">{tutorUser?.email}</p>
                    <p className="text-sm font-bold">{`Status: ${tutorUser?.status}`}</p>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-5">Kindly fill the form to complete your profile</h2>
                    <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
                      <div>
                        <Label value="Your qualification" />
                        <TextInput
                          type="text"
                          placeholder="Qualification"
                          id="qualification"
                          {...formik.getFieldProps("qualification")}
                        />
                        {formik.touched.qualification && formik.errors.qualification ? (
                          <div className="text-red-500 text-sm">{formik.errors.qualification}</div>
                        ) : null}
                      </div>
                      <div>
                        <Label value="Classes for tutoring" />
                        <TextInput
                          type="text"
                          placeholder="Classes"
                          id="classes"
                          {...formik.getFieldProps("classes")}
                        />
                        {formik.touched.classes && formik.errors.classes ? (
                          <div className="text-red-500 text-sm">{formik.errors.classes}</div>
                        ) : null}
                      </div>
                      <div>
                        <Label value="Subjects for tutoring" />
                        <select
                          id="subjects"
                          {...formik.getFieldProps("subjects")}
                          className="form-select"
                        >
                          <option value="">Select a subject</option>
                          {subjects.map(subject => (
                            <option key={subject._id} value={subject.name}>
                              {subject.name}
                            </option>
                          ))}
                        </select>
                        {formik.touched.subjects && formik.errors.subjects ? (
                          <div className="text-red-500 text-sm">{formik.errors.subjects}</div>
                        ) : null}
                      </div>
                      <div>
                        <Label value="Your hourly rate" />
                        <TextInput
                          type="number"
                          placeholder="Hourly Rate"
                          id="hourlyRate"
                          {...formik.getFieldProps("hourlyRate")}
                        />
                        {formik.touched.hourlyRate && formik.errors.hourlyRate ? (
                          <div className="text-red-500 text-sm">{formik.errors.hourlyRate}</div>
                        ) : null}
                      </div>
                      <div>
                        <Label value="Upload your qualification certificate" />
                        <FileInput
                          id="certificate"
                          accept=".pdf,.doc,.docx,.jpg,.png"
                          onChange={(event) => {
                            formik.setFieldValue("certificate", event.currentTarget.files[0]);
                          }}
                        />
                        {formik.touched.certificate && formik.errors.certificate ? (
                          <div className="text-red-500 text-sm">{formik.errors.certificate}</div>
                        ) : null}
                      </div>
                      <div>
                        <Label value="Bio" />
                        <Textarea
                          id="bio"
                          placeholder="Tell us about yourself"
                          {...formik.getFieldProps("bio")}
                        />
                        {formik.touched.bio && formik.errors.bio ? (
                          <div className="text-red-500 text-sm">{formik.errors.bio}</div>
                        ) : null}
                      </div>
                      <Button
                        gradientDuoTone="purpleToBlue"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner size="sm" />
                            <span className="pl-3">Loading...</span>
                          </>
                        ) : (
                          "Send for Approval"
                        )}
                      </Button>
                    </form>
                    {errorMessage && (
                      <Alert className="mt-5" color="failure">
                        {errorMessage}
                      </Alert>
                    )}
                    {successMessage && (
                      <Alert className="mt-5" color="success">
                        {successMessage}
                      </Alert>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {renderApprovalStatus()}
    </div>
  );
}
