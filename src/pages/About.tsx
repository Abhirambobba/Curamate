
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  return (
    <Layout>
      <div className="healthcare-container py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-healthcare-dark-blue mb-4">About CuraMate</h1>
          <p className="text-healthcare-gray max-w-2xl mx-auto">
            Our mission is to revolutionize healthcare management through innovative technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div>
            <h2 className="text-2xl font-semibold text-healthcare-blue mb-4">Our Story</h2>
            <p className="text-healthcare-gray mb-4">
              Founded in 2023, CuraMate was born from a simple idea: healthcare management 
              should be intuitive, efficient, and accessible to everyone. Our team of healthcare 
              professionals and technology experts came together to create a platform that addresses 
              the real challenges faced by doctors and patients every day.
            </p>
            <p className="text-healthcare-gray">
              What started as a small project has grown into a comprehensive platform used by 
              healthcare providers and patients worldwide. We continue to innovate and expand our 
              offerings, always keeping our focus on improving the healthcare experience.
            </p>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1504439468489-c8920d796a29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80" 
              alt="Medical professionals collaborating" 
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        </div>

        <Card className="mb-16">
          <CardContent className="py-8">
            <h2 className="text-2xl font-semibold text-healthcare-dark-blue text-center mb-8">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-healthcare-light-purple w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-healthcare-purple">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-healthcare-blue mb-2">Privacy & Security</h3>
                <p className="text-healthcare-gray">
                  We treat your healthcare data with the utmost respect and implement 
                  industry-leading security measures.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-healthcare-light-purple w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-healthcare-purple">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-healthcare-blue mb-2">Innovation</h3>
                <p className="text-healthcare-gray">
                  We continuously improve our platform with the latest technology 
                  to provide the best possible healthcare experience.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-healthcare-light-purple w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-healthcare-purple">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-healthcare-blue mb-2">Accessibility</h3>
                <p className="text-healthcare-gray">
                  We believe healthcare management should be accessible to everyone,
                  regardless of technical ability or background.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mb-16">
          <h2 className="text-2xl font-semibold text-healthcare-dark-blue mb-6">Our Team</h2>
          <p className="text-healthcare-gray max-w-2xl mx-auto mb-8">
            CuraMate is powered by a diverse team of healthcare professionals, 
            engineers, designers, and customer support specialists who are passionate 
            about improving healthcare.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="text-center">
                <div className="w-32 h-32 bg-healthcare-light-gray rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-healthcare-blue mb-1">Team Member</h3>
                <p className="text-healthcare-gray text-sm">Role / Position</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
