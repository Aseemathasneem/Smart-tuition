import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../../components/OAuth";
import { apiCall } from "../../utils/api";

export default function TutorSignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return setErrorMessage("Please fill out all fields.");
    }
    if (formData.password !== formData.confirmPassword) {
      return setErrorMessage('Passwords do not match !');
  }
    try {
      setLoading(true);
      setErrorMessage(null);

      const response = await apiCall("post", "/tutor/signup", formData); // Assuming the API endpoint for tutor signup is '/tutor/signup'
      setLoading(false);

      if (response.data.success === false) {
        setErrorMessage(response.data.message);
      } else {
        navigate("/tutor/otp-verification", {
          state: { email: formData.email },
        }); // Assuming the verification page for tutor is '/tutor/otp-verification'
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || error.message || "An error occurred"
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <img src="/images/pic1.jpg" alt="pic1" className="h-64 w-64" />
          <p className="text-sm mt-5">
            Ready to excel in your teaching? Register now and connect with
            students to share your expertise!
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-5">Register as a tutor</h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your name" />
              <TextInput
                type="text"
                placeholder="Name"
                id="name"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="Email"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Confirm your password" />
              <TextInput
                type="password"
                placeholder="Confirm Password"
                id="confirmPassword"
                onChange={handleChange}
              />
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
                "Sign Up"
              )}
            </Button>
            <OAuth apiEndpoint="/api/tutor/google-signin" />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/tutor/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
