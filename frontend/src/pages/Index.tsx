
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, User, Calendar, MessageSquare } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-white to-healthcare-light-purple">
        <div className="healthcare-container">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-healthcare-dark-blue mb-4">
                Modern Healthcare Platform for Doctors and Patients
              </h1>
              <p className="text-lg text-healthcare-gray mb-8">
                Simplify healthcare management, improve patient care, and enhance
                communication between healthcare providers and patients.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Button asChild size="lg">
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80"
                alt="Healthcare Platform"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="healthcare-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-healthcare-dark-blue mb-4">
              Comprehensive Healthcare Solutions
            </h2>
            <p className="text-healthcare-gray max-w-2xl mx-auto">
              Our platform offers a range of features designed to streamline healthcare
              management for both doctors and patients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-t-4 border-t-healthcare-blue">
              <CardContent className="pt-6">
                <div className="text-healthcare-blue mb-4">
                  <FileText className="h-10 w-10 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  Electronic Health Records
                </h3>
                <p className="text-healthcare-gray text-center">
                  Securely manage patient records and medical history in one place.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-healthcare-purple">
              <CardContent className="pt-6">
                <div className="text-healthcare-purple mb-4">
                  <User className="h-10 w-10 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  Patient Management
                </h3>
                <p className="text-healthcare-gray text-center">
                  Easily manage patient information and provide better care.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-healthcare-blue">
              <CardContent className="pt-6">
                <div className="text-healthcare-blue mb-4">
                  <Calendar className="h-10 w-10 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  Appointment Scheduling
                </h3>
                <p className="text-healthcare-gray text-center">
                  Simple booking system for patients to schedule appointments.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-healthcare-purple">
              <CardContent className="pt-6">
                <div className="text-healthcare-purple mb-4">
                  <MessageSquare className="h-10 w-10 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  Healthcare Chatbot
                </h3>
                <p className="text-healthcare-gray text-center">
                  AI-powered assistant to answer common healthcare questions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-healthcare-light-purple">
        <div className="healthcare-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-healthcare-dark-blue mb-4">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="text-healthcare-gray mb-8">
              Join thousands of healthcare professionals and patients who are already
              benefiting from our platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button asChild size="lg">
                <Link to="/register">Register Now</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
