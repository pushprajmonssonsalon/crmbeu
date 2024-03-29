// Layout.js
import React from 'react';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import VerticalSidebar from '../newSidebar';
import {Toaster} from 'react-hot-toast';

const Layout = ({ children }) => {
  return (
    <div className="min-w-full bg-[#E9EAEC] container roboto-regular">
        <Toaster />
      <Navbar />
      <div className="content flex bg-[f7f9f9]">
        {/* <Sidebar /> */}
        <VerticalSidebar />
        <main className='w-[90%] mx-auto '>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
