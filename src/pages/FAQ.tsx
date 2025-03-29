
import React from 'react';
import Layout from '@/components/Layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

const FAQ = () => {
  const faqCategories = [
    {
      category: "General",
      questions: [
        {
          question: "What services does CuraMate provide?",
          answer: "CuraMate offers a comprehensive healthcare platform that connects patients with doctors, manages electronic health records, facilitates appointment scheduling, and provides a healthcare chatbot for quick answers to common medical questions."
        },
        {
          question: "How do I create an account?",
          answer: "You can create an account by clicking on the 'Register' button in the navigation menu and following the registration process. You'll need to provide some basic information and choose whether you're registering as a patient or a healthcare provider."
        },
        {
          question: "Is my medical information secure?",
          answer: "Yes, we take security very seriously. All medical information is encrypted and stored securely following healthcare industry standards and regulations for patient data protection."
        },
        {
          question: "Can I use CuraMate on my mobile device?",
          answer: "Yes, CuraMate is fully responsive and can be accessed on smartphones, tablets, and desktop computers with an internet connection."
        }
      ]
    },
    {
      category: "Appointments",
      questions: [
        {
          question: "How do I schedule an appointment?",
          answer: "You can schedule an appointment by logging into your account, navigating to the 'Appointments' section, and selecting your preferred doctor, date, and time slot."
        },
        {
          question: "Can I cancel or reschedule my appointment?",
          answer: "Yes, you can cancel or reschedule your appointment through your dashboard. We recommend doing so at least 24 hours in advance out of courtesy to the healthcare provider."
        },
        {
          question: "Will I receive a reminder for my appointment?",
          answer: "Yes, we send automatic reminders via email or text message (based on your preferences) 24 hours before your scheduled appointment."
        },
        {
          question: "What if I'm running late for my appointment?",
          answer: "If you're running late, please contact the healthcare provider's office directly. Depending on their schedule, they may be able to accommodate you or may need to reschedule for another time."
        }
      ]
    },
    {
      category: "Medical Records",
      questions: [
        {
          question: "How can I access my medical records?",
          answer: "You can access your medical records by logging into your account and navigating to the 'Medical Records' section in your patient dashboard."
        },
        {
          question: "Can I share my medical records with a different healthcare provider?",
          answer: "Yes, you can generate a shareable link or PDF of your medical records that you can provide to other healthcare providers as needed."
        },
        {
          question: "How far back do my medical records go?",
          answer: "Your medical records on CuraMate will include all information from appointments and interactions that have occurred through our platform. Historical records would need to be uploaded by you or your healthcare provider."
        },
        {
          question: "Can I download my medical records?",
          answer: "Yes, you can download your medical records in PDF format for your personal records or to share with other healthcare providers."
        }
      ]
    },
    {
      category: "Billing & Insurance",
      questions: [
        {
          question: "Does CuraMate accept insurance?",
          answer: "CuraMate is a platform that connects patients with healthcare providers. Insurance acceptance depends on the individual healthcare providers. You can filter for providers who accept your insurance plan."
        },
        {
          question: "How do I pay for my appointment?",
          answer: "Payment methods vary by healthcare provider. Most providers on our platform accept credit/debit cards, and some may accept insurance co-pays directly through our system."
        },
        {
          question: "Will I receive a receipt for my payment?",
          answer: "Yes, you will receive an email receipt for any payments made through our platform."
        },
        {
          question: "What if I have a billing question?",
          answer: "For billing questions, you can contact the healthcare provider directly or reach out to our support team through the 'Contact Us' page."
        }
      ]
    }
  ];

  return (
    <Layout>
      <div className="healthcare-container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-healthcare-light-purple rounded-full mb-4">
              <HelpCircle className="h-8 w-8 text-healthcare-purple" />
            </div>
            <h1 className="text-4xl font-bold text-healthcare-dark-blue mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-healthcare-gray">
              Find answers to the most common questions about our healthcare services.
            </p>
          </div>

          <div className="space-y-8">
            {faqCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader className="bg-healthcare-light-gray">
                  <CardTitle className="text-healthcare-dark-blue">
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`item-${index}-${faqIndex}`}>
                        <AccordionTrigger className="text-left font-medium text-healthcare-dark-blue">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-healthcare-gray">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-healthcare-gray mb-4">
              Didn't find what you were looking for?
            </p>
            <a href="/contact" className="text-healthcare-blue hover:text-healthcare-purple transition-colors font-medium">
              Contact our support team
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
