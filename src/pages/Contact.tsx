
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon!",
      });
      setName('');
      setEmail('');
      setMessage('');
      setPhone('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="healthcare-container py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-healthcare-dark-blue mb-4">Contact Us</h1>
            <p className="text-lg text-healthcare-gray max-w-2xl mx-auto">
              Have questions about our services or need to schedule an appointment? 
              Our team is here to help you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-healthcare-blue to-healthcare-purple text-white">
              <CardContent className="pt-6">
                <Phone className="h-10 w-10 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                <p className="opacity-90 mb-2">Mon-Fri from 8am to 5pm</p>
                <a href="tel:+1234567890" className="text-lg font-medium hover:underline">
                  +1 (234) 567-890
                </a>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-healthcare-purple to-healthcare-blue text-white">
              <CardContent className="pt-6">
                <Mail className="h-10 w-10 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                <p className="opacity-90 mb-2">We'll respond within 24 hours</p>
                <a href="mailto:info@curamate.com" className="text-lg font-medium hover:underline">
                  info@curamate.com
                </a>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-healthcare-blue to-healthcare-purple text-white">
              <CardContent className="pt-6">
                <MapPin className="h-10 w-10 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
                <p className="opacity-90 mb-2">123 Healthcare Avenue</p>
                <p className="text-lg font-medium">
                  Medical District, CA 90210
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Send Us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone Number (optional)
                    </label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (234) 567-890"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Your Message
                    </label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?"
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <div className="h-[400px] rounded-lg overflow-hidden">
              <div className="h-full bg-healthcare-light-gray flex items-center justify-center">
                <div className="text-center p-6">
                  <MapPin className="h-12 w-12 text-healthcare-blue mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-healthcare-dark-blue mb-2">Our Location</h3>
                  <p className="text-healthcare-gray mb-4">
                    123 Healthcare Avenue<br />
                    Medical District, CA 90210
                  </p>
                  <p className="text-healthcare-gray">
                    <strong>Mon-Fri:</strong> 8am - 5pm<br />
                    <strong>Saturday:</strong> 9am - 1pm<br />
                    <strong>Sunday:</strong> Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
