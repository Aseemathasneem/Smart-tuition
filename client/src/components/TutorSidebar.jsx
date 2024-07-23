import React from "react";
import { Sidebar } from "flowbite-react";
import { HiUser, HiDocumentReport, HiCalendar ,HiChartPie,HiClock} from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function TutorSidebar() {
  const location = useLocation();
 
 
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {/* <Link to="/dashboard?tab=dash">
            <Sidebar.Item
              active={tab === "dash" || !tab}
              icon={HiChartPie}
              as="div"
            >
              Dashboard
            </Sidebar.Item>
          </Link> */}

          <Link to="/tutor/dashboard?tab=apply_for_approval">
            <Sidebar.Item
              active={tab === "apply_for_approval" }
              icon={HiDocumentReport}
              as="div"
            >
              Apply for Approval
            </Sidebar.Item>
          </Link>

          <Link to="/tutor/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={"Tutor"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>

          <Link to="/tutor/dashboard?tab=availability">
            <Sidebar.Item
              active={tab === "availability"}
              icon={HiCalendar}
              as="div"
            >
              Schedule Availability
            </Sidebar.Item>
          </Link>
          <Link to="/tutor/dashboard?tab=booked-slots">
        <Sidebar.Item
          active={tab === 'booked-slots'}
          icon={HiClock}
          as="div"
        >
          View Booked Slots
        </Sidebar.Item>
      </Link>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
