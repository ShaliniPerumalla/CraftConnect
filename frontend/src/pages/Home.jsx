import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedCrafts from '../components/FeaturedCrafts';
import FeaturedCreators from '../components/FeaturedCreators';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

import AnnouncementBar from '../components/landing/AnnouncementBar';
import TrustStrip from '../components/landing/TrustStrip';
import PlatformIntro from '../components/landing/PlatformIntro';
import FeatureSplit from '../components/landing/FeatureSplit';
import TransparencySection from '../components/landing/TransparencySection';
import Testimonials from '../components/landing/Testimonials';
import Reveal from '../components/landing/Reveal';

import {
  CreatorProfileMockup,
  ExploreMockup,
  CartMockup,
} from '../components/landing/FrameMockups';

export default function Home() {
  return (
    <div className="min-h-screen bg-cream font-body">

      {/* 0. Announcement */}
      <AnnouncementBar />

      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Hero — plays immediately, no scroll-reveal delay */}
      <Hero />

      {/* 3. Trusted by / gallery marquee */}
      <TrustStrip />

      {/* 4. Platform intro — 3-step numbered cards */}
      <Reveal>
        <PlatformIntro />
      </Reveal>

      {/* 5. Verified creators */}
      <Reveal>
        <FeatureSplit
          eyebrow="Every creator, verified"
          title="Know exactly who made the thing you're buying."
          description="Every shop is a real person with a name, a location, and a body of work you can browse before you buy."
          bullets={[
            {
              title: 'Verified profiles',
              description: 'Creators confirm their identity and craft before they can list.',
            },
            {
              title: 'Ratings that mean something',
              description: 'Reviews come only from people who actually bought the piece.',
            },
          ]}
          mockup={<CreatorProfileMockup />}
          tone="amber"
        />
      </Reveal>

      {/* 6. Curated discovery */}
      <Reveal>
        <FeatureSplit
          eyebrow="Built for browsing"
          title="Curated categories, endless discovery."
          description="Filter by craft, material or maker, and find pieces that actually match your taste — not a warehouse feed."
          bullets={[
            {
              title: 'Real filters',
              description: 'Search by category, price, and materials in one place.',
            },
            {
              title: 'No lookalikes',
              description: "Every listing is reviewed so mass-produced items never sneak in.",
            },
          ]}
          mockup={<ExploreMockup />}
          reverse
          tone="white"
        />
      </Reveal>

      {/* 7. Save, compare, checkout */}
      <Reveal>
        <FeatureSplit
          eyebrow="Simple to buy"
          title="Save favorites, checkout in a click."
          description="Wishlist pieces you love, compare them side by side, and check out directly — the creator gets your order instantly."
          bullets={[
            {
              title: 'Wishlist & compare',
              description: "Keep track of pieces across creators until you're ready.",
            },
            {
              title: 'Direct to the maker',
              description: "Orders go straight to the creator's queue — no warehouse in between.",
            },
          ]}
          mockup={<CartMockup />}
          tone="forest"
        />
      </Reveal>

      {/* 8. Transparency */}
      <Reveal>
        <TransparencySection />
      </Reveal>

      {/* 9. Featured Crafts */}
      <Reveal>
        <FeaturedCrafts />
      </Reveal>

      {/* 10. Meet the Makers - Creator Profiles */}
      <Reveal>
        <FeaturedCreators />
      </Reveal>

      {/* 11. Testimonials */}
      <Reveal>
        <Testimonials />
      </Reveal>

      {/* 12. Start Selling */}
      <Reveal>
        <CTA />
      </Reveal>

      {/* 13. Footer */}
      <Footer />

    </div>
  );
}
