import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';

const AboutPage = () => (
  <Container className="pb-16 pt-10">
    <div className="space-y-12">
      <section className="rounded-[32px] border border-neutral-200 bg-white p-12 shadow-sm">
        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">About Shoebox</p>
            <h1 className="mt-4 text-4xl font-semibold text-neutral-900">Premium footwear, local expertise</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-600">
              Shoebox is Kerala's premier destination for curated sneakers, everyday runners, and premium footwear. We blend modern design with approachable store experiences, fast delivery, and community-driven selections.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[28px] border border-neutral-200 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Our mission</p>
          <h2 className="mt-3 text-2xl font-semibold text-neutral-900">Make premium footwear accessible</h2>
          <p className="mt-4 leading-7 text-neutral-600">
            We believe everyone deserves access to quality shoes. Through our stores, curated collections, and fast delivery, we make premium footwear available to every Malayali.
          </p>
        </div>

        <div className="rounded-[28px] border border-neutral-200 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Our values</p>
          <h2 className="mt-3 text-2xl font-semibold text-neutral-900">Quality, speed, and community</h2>
          <p className="mt-4 leading-7 text-neutral-600">
            We source the best brands, deliver fast, and build a community of sneaker enthusiasts. Every pair comes with our commitment to excellence.
          </p>
        </div>
      </section>

      <section className="rounded-[28px] border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.24em] text-neutral-500">Stores across Kerala</p>
        <h2 className="mt-3 text-2xl font-semibold text-neutral-900">Visit us today</h2>
        <p className="mt-4 max-w-2xl leading-7 text-neutral-600">
          Find us in Thrissur, Kochi, and Kozhikode. Experience our curated collections in-store and take home your favorite pairs.
        </p>
        <Link to="/stores">
          <Button size="lg" className="mt-6">Find a store</Button>
        </Link>
      </section>
    </div>
  </Container>
);

export default AboutPage;
