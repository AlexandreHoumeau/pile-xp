export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export type ContactInfo = {
  id: string;
  description: string;
  email: string;
  phone_number: string;
  photo_url: string | null;
  faq: FAQItem[];
};
