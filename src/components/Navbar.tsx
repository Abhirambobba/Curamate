
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '@/utils/csvUtils';
import { clearAuthUser, getAuthUser } from '@/utils/authUtils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Menu, User as UserIcon, LogOut, Calendar, Users, HelpCircle, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <header className="bg-white shadow-sm sticky top-0 z-50">
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
          <div className="hidden md:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link
                    to="/"
                    className="px-3 py-2 text-healthcare-gray hover:text-healthcare-blue transition-colors"
                  >
                    Home
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="px-3 py-2 text-healthcare-gray hover:text-healthcare-blue transition-colors">
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-healthcare-blue to-healthcare-purple p-6 no-underline outline-none focus:shadow-md"
                            to="/services"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium text-white">
                              Our Services
                            </div>
                            <p className="text-sm leading-tight text-white/90">
                              Explore our comprehensive healthcare solutions designed to meet your medical needs.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <Link
                          to="/doctors"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Doctors</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Meet our qualified healthcare professionals
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/appointments"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Appointments</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Schedule consultations with our healthcare professionals
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/faq"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">FAQ</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Answers to commonly asked questions
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/contact"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Contact Us</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Get in touch with our support team
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link
                    to="/about"
                    className="px-3 py-2 text-healthcare-gray hover:text-healthcare-blue transition-colors"
                  >
                    About
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link
                    to="/contact"
                    className="px-3 py-2 text-healthcare-gray hover:text-healthcare-blue transition-colors"
                  >
                    Contact
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-4">
                    <UserIcon className="mr-2 h-4 w-4" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardLink()} className="w-full">
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="w-full">
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'patient' && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/appointments" className="w-full">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Appointments</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
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
          </div>
          
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
              to="/doctors"
              className="block px-3 py-2 text-healthcare-gray hover:text-healthcare-blue transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Users className="inline-block mr-2 h-4 w-4" />
              Doctors
            </Link>
            <Link
              to="/appointments"
              className="block px-3 py-2 text-healthcare-gray hover:text-healthcare-blue transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Calendar className="inline-block mr-2 h-4 w-4" />
              Appointments
            </Link>
            <Link
              to="/faq"
              className="block px-3 py-2 text-healthcare-gray hover:text-healthcare-blue transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <HelpCircle className="inline-block mr-2 h-4 w-4" />
              FAQ
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-healthcare-gray hover:text-healthcare-blue transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 text-healthcare-gray hover:text-healthcare-blue transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Phone className="inline-block mr-2 h-4 w-4" />
              Contact
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
