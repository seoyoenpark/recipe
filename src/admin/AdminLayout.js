import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminNav from './AdminNav';
import './AdminLayout.css';

function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminHeader />
      <div className="admin-body">
        <AdminNav />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
