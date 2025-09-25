import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminNav from './AdminNav';

function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminHeader />
      <AdminNav />
      <main className="admin-content">
        <Outlet /> 
      </main>
    </div>
  );
}

export default AdminLayout;