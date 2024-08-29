import Navbar from '../navbar/Navbar';
import VerticalSidebar from '../newSidebar';

const Layout = ({ children }) => {

  return (
    <div className="min-w-full bg-[#E9EAEC] container roboto-regular flex flex-col ">
        {/* <Toaster /> */}
      <Navbar />
      <div className="content flex bg-[f7f9f9] ">
        {/* <Sidebar /> */}
        <VerticalSidebar />
        <main style={{maxWidth:'100%'}} className='w-full mx-auto overflow-x-auto'>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
