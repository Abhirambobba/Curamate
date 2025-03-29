
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { FileText, User, Calendar, MessageSquare, Shield, Clock, Activity } from 'lucide-react';

const Services = () => {
  return (
    <Layout>
      <div className="healthcare-container py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-healthcare-dark-blue mb-4">Our Services</h1>
          <p className="text-healthcare-gray max-w-2xl mx-auto">
            CuraMate offers a comprehensive suite of healthcare management solutions 
            designed for both healthcare providers and patients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <div className="text-healthcare-blue mb-4">
                <FileText className="h-10 w-10" />
              </div>
              <CardTitle>Electronic Health Records</CardTitle>
              <CardDescription>
                Secure, accessible patient records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-healthcare-gray mb-4">
                Our EHR system allows healthcare providers to maintain comprehensive, 
                up-to-date patient records. Easily track patient history, medications, 
                allergies, and more in one secure location.
              </p>
              <ul className="list-disc list-inside text-healthcare-gray space-y-1 mb-4">
                <li>Complete patient history</li>
                <li>Secure data storage</li>
                <li>Easy search and retrieval</li>
                <li>Customizable templates</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-healthcare-purple mb-4">
                <Calendar className="h-10 w-10" />
              </div>
              <CardTitle>Appointment Scheduling</CardTitle>
              <CardDescription>
                Efficient booking and management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-healthcare-gray mb-4">
                Our scheduling system makes it easy for patients to book appointments 
                and for healthcare providers to manage their calendar. Reduce no-shows 
                with automated reminders and confirmations.
              </p>
              <ul className="list-disc list-inside text-healthcare-gray space-y-1 mb-4">
                <li>Online booking for patients</li>
                <li>Calendar integration</li>
                <li>Automated reminders</li>
                <li>Rescheduling options</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-healthcare-blue mb-4">
                <MessageSquare className="h-10 w-10" />
              </div>
              <CardTitle>Healthcare Chatbot</CardTitle>
              <CardDescription>
                AI-powered healthcare assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-healthcare-gray mb-4">
                Our AI chatbot provides instant answers to common healthcare questions 
                and can assist with basic triage. Reduce the burden on your staff while 
                providing patients with immediate support.
              </p>
              <ul className="list-disc list-inside text-healthcare-gray space-y-1 mb-4">
                <li>24/7 patient support</li>
                <li>Common question handling</li>
                <li>Basic symptom assessment</li>
                <li>Multilingual capability</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-healthcare-purple mb-4">
                <User className="h-10 w-10" />
              </div>
              <CardTitle>Patient Management</CardTitle>
              <CardDescription>
                Complete patient relationship tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-healthcare-gray mb-4">
                Maintain comprehensive profiles for all your patients, including medical 
                history, demographics, insurance information, and communication preferences.
              </p>
              <ul className="list-disc list-inside text-healthcare-gray space-y-1 mb-4">
                <li>Detailed patient profiles</li>
                <li>Insurance verification</li>
                <li>Communication history</li>
                <li>Family relationships</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-healthcare-blue mb-4">
                <Shield className="h-10 w-10" />
              </div>
              <CardTitle>Secure Communications</CardTitle>
              <CardDescription>
                HIPAA-compliant messaging
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-healthcare-gray mb-4">
                Our secure messaging system ensures that all communications between 
                healthcare providers and patients remain private and compliant with 
                healthcare privacy regulations.
              </p>
              <ul className="list-disc list-inside text-healthcare-gray space-y-1 mb-4">
                <li>End-to-end encryption</li>
                <li>HIPAA compliance</li>
                <li>File sharing capabilities</li>
                <li>Mobile notifications</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-healthcare-purple mb-4">
                <Activity className="h-10 w-10" />
              </div>
              <CardTitle>Analytics & Reporting</CardTitle>
              <CardDescription>
                Actionable healthcare insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-healthcare-gray mb-4">
                Gain valuable insights into your practice with comprehensive analytics 
                and reporting tools. Track patient outcomes, practice efficiency, 
                and financial performance.
              </p>
              <ul className="list-disc list-inside text-healthcare-gray space-y-1 mb-4">
                <li>Customizable dashboards</li>
                <li>Patient outcome tracking</li>
                <li>Financial reporting</li>
                <li>Operational metrics</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="bg-healthcare-light-purple rounded-lg p-8 text-center mb-16">
          <h2 className="text-2xl font-semibold text-healthcare-dark-blue mb-4">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-healthcare-gray max-w-2xl mx-auto mb-6">
            Join thousands of healthcare professionals and patients who are already 
            benefiting from our comprehensive healthcare platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button asChild size="lg">
              <Link to="/register">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Services;
