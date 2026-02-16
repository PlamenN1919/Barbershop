import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import AccentStrip from '@/components/sections/AccentStrip';
import ServicesAccordion from '@/components/sections/ServicesAccordion';
import GallerySection from '@/components/sections/GallerySection';
import WhyUsSection from '@/components/sections/WhyUsSection';
import JourneySection from '@/components/sections/JourneySection';
import PricingSection from '@/components/sections/PricingSection';
import BookingSection from '@/components/sections/BookingSection';
import CTASection from '@/components/sections/CTASection';
import Footer from '@/components/sections/Footer';
import StickyBookButton from '@/components/StickyBookButton';

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <AccentStrip />
      <ServicesAccordion />
      <GallerySection />
      <WhyUsSection />
      <JourneySection />
      <PricingSection />
      <BookingSection />
      <CTASection />
      <Footer />
      <StickyBookButton />
    </main>
  );
}
