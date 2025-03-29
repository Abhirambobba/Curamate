
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="healthcare-container flex flex-col items-center justify-center py-20">
        <div className="text-center max-w-md">
          <h1 className="text-8xl font-bold text-healthcare-blue mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-healthcare-dark-blue mb-6">Page Not Found</h2>
          <p className="text-healthcare-gray mb-8">
            We're sorry, the page you requested could not be found. 
            Please check the URL or navigate back to the home page.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
