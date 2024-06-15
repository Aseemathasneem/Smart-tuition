import React from 'react';
import { Sidebar } from 'flowbite-react';
import { HiUserGroup, HiAcademicCap, HiCheckCircle, HiChartBar } from 'react-icons/hi';
import { Outlet } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64" aria-label="Sidebar">
        <Sidebar>
          <Sidebar.Logo>
            Admin Dashboard
          </Sidebar.Logo>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item href="/admin/students" icon={HiUserGroup}>
                Students
              </Sidebar.Item>
              <Sidebar.Item href="/admin/tutors" icon={HiAcademicCap}>
                Tutors
              </Sidebar.Item>
              <Sidebar.Item href="/admin/approvals" icon={HiCheckCircle}>
                Approvals
              </Sidebar.Item>
              <Sidebar.Item href="/admin/reports" icon={HiChartBar}>
                Reports
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </aside>
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-5">Welcome to Admin Dashboard</h2>
        <Outlet />
      </main>
    </div>
  );
}
