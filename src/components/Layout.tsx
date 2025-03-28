
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children || <Outlet />}
      </main>
      <footer className="bg-healthcare-light-gray py-6">
        <div className="healthcare-container">
          <div className="text-center">
            <p className="text-healthcare-gray">© {new Date().getFullYear()} DocuHealth. All rights reserved.</p>
            <div className="mt-2 flex justify-center space-x-6">
              <a href="#" className="text-healthcare-blue hover:text-healthcare-purple transition-colors">Privacy Policy</a>
              <a href="#" className="text-healthcare-blue hover:text-healthcare-purple transition-colors">Terms of Service</a>
              <a href="#" className="text-healthcare-blue hover:text-healthcare-purple transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
