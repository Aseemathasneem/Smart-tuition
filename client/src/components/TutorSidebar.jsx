import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiDocumentReport,
  HiCalendar,
  HiChartPie,
  HiClock,
  HiPlusCircle,
} from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiCall } from "../api/apiCalls";
import endpoints from "../api/endpoints";

export default function TutorSidebar() {
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate for redirection
  const { currentUser: tutorUser } = useSelector((state) => state.tutor);
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  // Function to check if the tutor is blocked
  const checkBlockedStatus = async (event, targetPath) => {
    event.preventDefault(); // Prevent the default navigation
    const token = localStorage.getItem("tu_token");
    if (token) {
      try {
        const data = await apiCall("get", endpoints.GET_TUTOR_STATUS);
        if (data.isBlocked) {
          navigate("/tutor/blocked"); // Redirect to /blocked if the tutor is blocked
        } else {
          navigate(targetPath); // Proceed to the intended path if not blocked
        }
      } catch (error) {
        console.error("Error fetching blocked status:", error);
        navigate("/tutor/blocked"); // Redirect to /blocked on error as a fallback
      }
    } else {
      navigate("/tutor/home"); // Redirect to home if no token is found
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <a
            href="/tutor/dashboard?tab=dash"
            onClick={(e) => checkBlockedStatus(e, "/tutor/dashboard?tab=dash")}
          >
            <Sidebar.Item
              active={tab === "dash" || !tab}
              icon={HiChartPie}
              as="div"
            >
              Dashboard
            </Sidebar.Item>
          </a>

          {tutorUser?.status !== "approved" && (
            <a
              href="/tutor/dashboard?tab=apply_for_approval"
              onClick={(e) =>
                checkBlockedStatus(e, "/tutor/dashboard?tab=apply_for_approval")
              }
            >
              <Sidebar.Item
                active={tab === "apply_for_approval"}
                icon={HiDocumentReport}
                as="div"
              >
                Apply for Approval
              </Sidebar.Item>
            </a>
          )}

          {tutorUser?.status === "approved" && (
            <>
              <a
                href="/tutor/dashboard?tab=profile"
                onClick={(e) =>
                  checkBlockedStatus(e, "/tutor/dashboard?tab=profile")
                }
              >
                <Sidebar.Item
                  active={tab === "profile"}
                  icon={HiUser}
                  label={"Tutor"}
                  labelColor="dark"
                  as="div"
                >
                  Profile
                </Sidebar.Item>
              </a>

              <a
                href="/tutor/dashboard?tab=availability"
                onClick={(e) =>
                  checkBlockedStatus(e, "/tutor/dashboard?tab=availability")
                }
              >
                <Sidebar.Item
                  active={tab === "availability"}
                  icon={HiCalendar}
                  as="div"
                >
                  Schedule Availability
                </Sidebar.Item>
              </a>
            </>
          )}

          <a
            href="/tutor/dashboard?tab=booked-slots"
            onClick={(e) =>
              checkBlockedStatus(e, "/tutor/dashboard?tab=booked-slots")
            }
          >
            <Sidebar.Item
              active={tab === "booked-slots"}
              icon={HiClock}
              as="div"
            >
              View Booked Slots
            </Sidebar.Item>
          </a>

          <a
            href="/tutor/dashboard?tab=available-slots"
            onClick={(e) =>
              checkBlockedStatus(e, "/tutor/dashboard?tab=available-slots")
            }
          >
            <Sidebar.Item
              active={tab === "available-slots"}
              icon={HiClock}
              as="div"
            >
              View Available Slots
            </Sidebar.Item>
          </a>

          <a
            href="/tutor/dashboard?tab=post-assignment"
            onClick={(e) =>
              checkBlockedStatus(e, "/tutor/dashboard?tab=post-assignment")
            }
          >
            <Sidebar.Item
              active={tab === "post-assignment"}
              icon={HiPlusCircle}
              as="div"
            >
              Post Assignment
            </Sidebar.Item>
          </a>

          <a
            href="/tutor/dashboard?tab=submitted-assignments"
            onClick={(e) =>
              checkBlockedStatus(
                e,
                "/tutor/dashboard?tab=submitted-assignments"
              )
            }
          >
            <Sidebar.Item
              active={tab === "submitted-assignments"}
              icon={HiDocumentReport}
              as="div"
            >
              Submitted Answers
            </Sidebar.Item>
          </a>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
