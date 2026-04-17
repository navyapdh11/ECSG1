import { HeroSection } from '@/components/landing/HeroSection';
import { BookingForm } from '@/components/booking-steps/BookingForm';
import { PricingSection } from '@/components/pricing/PricingSection';
import { GamificationSection } from '@/components/gamification/GamificationSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <BookingForm />
      <PricingSection />
      <GamificationSection />
    </>
  );
}
