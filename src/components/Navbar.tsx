import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '@/utils/csvUtils';
import { clearAuthUser, getAuthUser } from '@/utils/authUtils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, User as UserIcon, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const authUser = getAuthUser();
    setUser(authUser);
  }, []);

  const handleLogout = () => {
    clearAuthUser();
    setUser(null);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    return user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard';
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="healthcare-container">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-healthcare-blue">
                CuraMate
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="px-3 py-2 text-healthcare-gray hover:text-healthcare-blue transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="px-3 py-2 text-healthcare-gray hover:text-healthcare-blue transition-colors"
            >
              About
            </Link>
            <Link
              to="/services"
              className="px-3 py-2 text-healthcare-gray hover:text-healthcare-blue transition-colors"
            >
              Services
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-4">
                    <UserIcon className="mr-2 h-4 w-4" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink()}>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </nav>
          
          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2 pb-4">
            <Link
              to="/"
              className="block px-3 py-2 text-healthcare-gray hover:text-healthcare-blue transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-healthcare-gray hover:text-healthcare-blue transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/services"
              className="block px-3 py-2 text-healthcare-gray hover:text-healthcare-blue transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            
            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="block px-3 py-2 text-healthcare-gray hover:text-healthcare-blue transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-healthcare-gray hover:text-healthcare-blue transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-healthcare-gray hover:text-healthcare-blue transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 px-3 py-2">
                <Button
                  variant="ghost"
                  className="justify-start px-0"
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    navigate('/register');
                    setIsMenuOpen(false);
                  }}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
