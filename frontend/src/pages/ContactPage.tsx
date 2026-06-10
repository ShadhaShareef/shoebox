import { useState } from 'react';
import Container from '../components/layout/Container';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <Container className="pb-16 pt-10">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="rounded-[32px] border border-neutral-200 bg-white p-12 shadow-sm text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Contact us</p>
          <h1 className="mt-4 text-3xl font-semibold text-neutral-900">Get in touch</h1>
          <p className="mt-3 leading-7 text-neutral-600">
            Have a question or feedback? We'd love to hear from you. Reach out anytime.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[28px] border border-neutral-200 bg-white p-8 shadow-sm space-y-6">
          {submitted && (
            <div className="rounded-[20px] bg-brand-50 px-4 py-3 text-sm text-brand-800">
              ✓ Thank you for your message. We'll get back to you soon.
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-neutral-900">Name</label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-neutral-900">Email</label>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-neutral-900">Subject</label>
            <Input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="What's this about?"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-neutral-900">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Your message..."
              required
              rows={6}
              className="w-full rounded-[16px] border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
            />
          </div>

          <Button type="submit" size="lg" className="w-full">Send message</Button>
        </form>
      </div>
    </Container>
  );
};

export default ContactPage;
