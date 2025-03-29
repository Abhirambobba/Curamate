
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, User, Calendar, MessageSquare, Heart, Activity, Clock, Shield } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-white to-healthcare-light-purple">
        <div className="healthcare-container">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-healthcare-dark-blue mb-4 leading-tight">
                Modern Healthcare Platform for Better Patient Care
              </h1>
              <p className="text-lg text-healthcare-gray mb-8">
                CuraMate connects doctors and patients, simplifies healthcare management, 
                and enhances communication for improved patient outcomes.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Button asChild size="lg" className="bg-healthcare-blue hover:bg-healthcare-blue/90">
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/doctors">Find a Doctor</Link>
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
            <Card className="border-t-4 border-t-healthcare-blue transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
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

            <Card className="border-t-4 border-t-healthcare-purple transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
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

            <Card className="border-t-4 border-t-healthcare-blue transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
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

            <Card className="border-t-4 border-t-healthcare-purple transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
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

      {/* Benefits Section */}
      <section className="py-16 bg-healthcare-light-gray">
        <div className="healthcare-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-healthcare-dark-blue mb-4">
              Why Choose CuraMate?
            </h2>
            <p className="text-healthcare-gray max-w-2xl mx-auto">
              Our platform provides unique benefits for both healthcare providers and patients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-healthcare-dark-blue mb-4">
                For Patients
              </h3>
              
              <div className="flex items-start space-x-4">
                <div className="bg-healthcare-blue p-3 rounded-full text-white mt-1">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-healthcare-dark-blue mb-1">
                    Convenient Scheduling
                  </h4>
                  <p className="text-healthcare-gray">
                    Book appointments online at any time, without phone calls or waiting on hold.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-healthcare-purple p-3 rounded-full text-white mt-1">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-healthcare-dark-blue mb-1">
                    Access to Medical Records
                  </h4>
                  <p className="text-healthcare-gray">
                    View your complete medical history and test results in one secure location.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-healthcare-blue p-3 rounded-full text-white mt-1">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-healthcare-dark-blue mb-1">
                    Direct Communication
                  </h4>
                  <p className="text-healthcare-gray">
                    Message your healthcare providers directly for follow-up questions.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-healthcare-dark-blue mb-4">
                For Healthcare Providers
              </h3>
              
              <div className="flex items-start space-x-4">
                <div className="bg-healthcare-purple p-3 rounded-full text-white mt-1">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-healthcare-dark-blue mb-1">
                    Streamlined Workflow
                  </h4>
                  <p className="text-healthcare-gray">
                    Reduce administrative burden with digital patient management tools.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-healthcare-blue p-3 rounded-full text-white mt-1">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-healthcare-dark-blue mb-1">
                    Enhanced Patient Insights
                  </h4>
                  <p className="text-healthcare-gray">
                    Access comprehensive patient data for more informed treatment decisions.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-healthcare-purple p-3 rounded-full text-white mt-1">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-healthcare-dark-blue mb-1">
                    Secure Data Management
                  </h4>
                  <p className="text-healthcare-gray">
                    Maintain patient records with industry-standard security protocols.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="healthcare-container">
          <div className="text-center mb-12">
            <Heart className="h-12 w-12 text-healthcare-purple mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-healthcare-dark-blue mb-4">
              What Our Users Say
            </h2>
            <p className="text-healthcare-gray max-w-2xl mx-auto">
              Discover how CuraMate has transformed healthcare experiences for patients and providers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-white to-healthcare-light-purple p-6">
              <CardContent className="p-0">
                <div className="mb-4">
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-healthcare-gray italic mb-6">
                  "CuraMate has completely changed how I manage my healthcare. Booking appointments is so easy, and I love having all my records in one place."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-healthcare-blue rounded-full flex items-center justify-center text-white font-bold text-xl">
                    S
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-healthcare-dark-blue">Sarah Johnson</h4>
                    <p className="text-sm text-healthcare-gray">Patient</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-white to-healthcare-light-purple p-6">
              <CardContent className="p-0">
                <div className="mb-4">
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-healthcare-gray italic mb-6">
                  "As a physician, CuraMate has streamlined my practice significantly. The EHR system is intuitive, and patient communication is seamless."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-healthcare-purple rounded-full flex items-center justify-center text-white font-bold text-xl">
                    D
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-healthcare-dark-blue">Dr. Michael Chen</h4>
                    <p className="text-sm text-healthcare-gray">Cardiologist</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-white to-healthcare-light-purple p-6">
              <CardContent className="p-0">
                <div className="mb-4">
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-healthcare-gray italic mb-6">
                  "Managing a medical practice is so much easier with CuraMate. The scheduling system has reduced no-shows by 30%, and patients love the platform."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-healthcare-blue rounded-full flex items-center justify-center text-white font-bold text-xl">
                    J
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-healthcare-dark-blue">Jennifer Rodriguez</h4>
                    <p className="text-sm text-healthcare-gray">Practice Manager</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-healthcare-purple to-healthcare-blue text-white">
        <div className="healthcare-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of healthcare professionals and patients who are already
              benefiting from our platform. Getting started is easy and takes just minutes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button size="lg" variant="secondary" asChild className="bg-white text-healthcare-blue hover:bg-white/90">
                <Link to="/register">Register Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                <Link to="/doctors">Find a Doctor</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
