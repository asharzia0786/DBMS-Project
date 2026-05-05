import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ObjectScrollExperience from './components/ObjectScrollExperience';
import WorkshopExperience from './components/WorkshopExperience';
import ProductShowcase from './components/ProductShowcase';
import Testimonials from './components/Testimonials';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="bg-void text-beige overflow-x-hidden">
      <Navigation />
      <Hero />
      <ObjectScrollExperience />
      <WorkshopExperience />
      <ProductShowcase />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
}
