import { PackageProvider } from "./context/PackageContext.jsx";
import { PhotoOverridesProvider } from "./context/PhotoOverridesContext.jsx";
import { PricingOverrideProvider } from "./context/PricingOverrideContext.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Stats from "./components/Stats.jsx";
import WhyUs from "./components/WhyUs.jsx";
import About from "./components/About.jsx";
import Formats from "./components/Formats.jsx";
import Pricing from "./components/Pricing.jsx";
import Gallery from "./components/Gallery.jsx";
import Partners from "./components/Partners.jsx";
import Team from "./components/Team.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import ScrollTopButton from "./components/ScrollTopButton.jsx";

export default function App() {
  return (
    <PackageProvider>
      <PhotoOverridesProvider>
        <PricingOverrideProvider>
          <a href="#main" className="skip-link">
            Перейти до основного вмісту
          </a>
          <Header />
          <main id="main">
            <Hero />
            <Stats />
            <WhyUs />
            <About />
            <Formats />
            <Pricing />
            <Gallery />
            <Partners />
            <Team />
            <Contact />
          </main>
          <Footer />
          <ScrollTopButton />
        </PricingOverrideProvider>
      </PhotoOverridesProvider>
    </PackageProvider>
  );
}
