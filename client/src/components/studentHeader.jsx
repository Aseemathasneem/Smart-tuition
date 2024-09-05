import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Navbar, Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { FaMoon, FaSun, FaBell } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { clearAuth, fetchStudentData } from "../redux/student/studentSlice";
import { fetchSubjects } from "../redux/subjects/subjectsSlice";
import { useToast } from "../contexts/ToastContext";
import { NotificationContext } from "../contexts/NotificationContext";
import NotificationHandler from "./NotificationHandler";
import { apiCall } from '../api/apiCalls';
import endpoints from "../api/endpoints";

const StudentHeader = () => {
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.student);
  const { subjects } = useSelector((state) => state.subjects);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const showToast = useToast(); // Use the toast hook here
  const { notifications, addNotification } = useContext(NotificationContext); 

  useEffect(() => {
    const storedToken = localStorage.getItem("st_token");
    if (storedToken && !currentUser) {
      dispatch(fetchStudentData(storedToken));
    }
    dispatch(fetchSubjects());
  }, [dispatch, currentUser]);

  const handleSignout = async () => {
    try {
      const response = await apiCall("post", endpoints.STUDENT_SIGNOUT)
      
      if (response.status !== 200) {
        console.log("Signout failed:", response.data.message);
      } else {
        dispatch(clearAuth());
        localStorage.removeItem("st_token");
        navigate("/student/home"); 
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleNewNotification = (message) => {
    console.log("New notification received:", message);
    addNotification(message); // Add the notification to the context
    showToast(message.message, "success"); // Display the toast message
  };

  // Calculate unread notifications count
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  return (
    <Navbar className="border-b-2 bg-blue-200">
      <Link to="/">
        <img src="/images/logo.jpeg" alt="Logo" className="h-14 w-16" />
      </Link>
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>
        <Link to="/student/notifications">
          <Button className="w-12 h-10 relative" color="gray" pill>
            <FaBell />
            {unreadCount > 0 && (
              <span className="badge absolute top-0 right-0 flex items-center justify-center w-5 h-5 bg-red-600 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </Button>
        </Link>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{currentUser.name}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to="/student/profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/student/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/student/home"} as={"div"}>
          <Link to="/student/home">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/student/profile"} as={"div"}>
          <Link to="/student/approved-tutors">Tutors</Link>
        </Navbar.Link>
        <Dropdown label="Subjects" arrowIcon={false} inline className="ml-4">
          {subjects.map((subject) => (
            <Link key={subject.id} to={`/student/subjects/${subject.id}`}>
              <Dropdown.Item>{subject.name}</Dropdown.Item>
            </Link>
          ))}
        </Dropdown>
        <Navbar.Link active={path === "/student/booked_sessions"} as={"div"}>
          <Link to="/student/booked_sessions">Booked sessions</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/student/assignments"} as={"div"}>
          <Link to="/student/assignments">Assignments</Link>
        </Navbar.Link>
      </Navbar.Collapse>
      {currentUser && (
        <NotificationHandler
          onNewNotification={handleNewNotification}
          userId={currentUser._id}
        />
      )}
    </Navbar>
  );
};

export default StudentHeader;
