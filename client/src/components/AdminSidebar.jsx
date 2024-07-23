// AdminSidebar.jsx
import React from 'react';
import { Sidebar } from 'flowbite-react';
import { HiUserGroup, HiAcademicCap, HiCheckCircle, HiChartBar, HiBookOpen } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <Sidebar>
      <Sidebar.Logo>
        Admin Dashboard
      </Sidebar.Logo>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item as={Link} to="/admin/students" icon={HiUserGroup}>
            Students
          </Sidebar.Item>
          <Sidebar.Item as={Link} to="/admin/tutors" icon={HiAcademicCap}>
            Tutors
          </Sidebar.Item>
          <Sidebar.Item as={Link} to="/admin/approvals" icon={HiCheckCircle}>
            Approvals
          </Sidebar.Item>
          <Sidebar.Item as={Link} to="/admin/subjects" icon={ HiBookOpen}>
            Subjects
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default AdminSidebar;
