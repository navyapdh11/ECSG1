'use client';

import { PricingTiers } from './PricingTiers';
import { PricingCalculator } from './PricingCalculator';

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-20">
          <PricingTiers />
          <PricingCalculator />
        </div>
      </div>
    </section>
  );
}
