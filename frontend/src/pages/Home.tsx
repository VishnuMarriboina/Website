import Slider from "react-slick";
import type { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Lottie from "react-lottie";
import type { Options } from "react-lottie";
import { BsQrCodeScan } from "react-icons/bs";
import { FcCheckmark } from "react-icons/fc";
import { AiOutlineSolution } from "react-icons/ai";
import { VscServerProcess } from "react-icons/vsc";
import { TbMessage2Code } from "react-icons/tb";
import { Link } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";

import a1 from "../Images/Home/1.png";
import a2 from "../Images/Home/2.png";
import a3 from "../Images/Home/3.png";
import a4 from "../Images/Home/4.png";
import a5 from "../Images/Home/6.png";
import t1 from "../Images/Home/dump-truck.jpg";
import ceo from "../Images/Home/CEO.png";
import cto from "../Images/Home/CTO.png";
import logo from "../Images/Home/logo-header.png";
import map from "../Images/Home/land-img.png";
import imageAnim from "../assets/image.json";
import scanAnim from "../assets/Scan.json";
import mapAnim from "../assets/Map.json";

// ── Animation helpers ─────────────────────────────────────────────────────────

function splitToChars(input: string): string[] {
  return Array.from(input.match(/[\s\S]/gu) ?? []);
}

const charVariant = { hidden: { opacity: 0 }, reveal: { opacity: 1 } };

// ── Slider config ─────────────────────────────────────────────────────────────

const sliderSettings: Settings = {
  dots: true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 3000,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: false,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2 } },
    { breakpoint: 640, settings: { slidesToShow: 1 } },
  ],
};

// ── Stat item ─────────────────────────────────────────────────────────────────

interface StatProps {
  value: string;
  label: string;
}
function Stat({ value, label }: StatProps) {
  return (
    <div className="text-center">
      <p className="text-2xl md:text-3xl font-bold text-orange-500">{value}</p>
      <p className="text-sm text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

function Home() {
  const lottieHero: Options = {
    loop: true,
    autoplay: true,
    animationData: imageAnim,
    rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
  };
  const lottieScan: Options = {
    loop: true,
    autoplay: true,
    animationData: scanAnim,
    rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
  };
  const lottieMap: Options = {
    loop: true,
    autoplay: true,
    animationData: mapAnim,
    rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
  };

  const welcomeChars = splitToChars("Welcome to");
  const brandChars = splitToChars("ServCrust");
  const strategyImages = [a1, a2, a3, a4, a5];

  return (
    <div className="bg-white">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-4">
            {/* Company logo + name */}
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                SERVCRUST
              </span>
            </div>
            <span className="inline-block bg-orange-50 text-orange-600 text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full w-fit border border-orange-200">
              India's #1 B2B Aggregates Platform
            </span>
            <motion.h1
              initial="hidden"
              whileInView="reveal"
              transition={{ staggerChildren: 0.05 }}
              className="text-sm font-medium text-slate-500 tracking-widest uppercase"
            >
              {welcomeChars.map((ch, i) => (
                <motion.span
                  key={i}
                  transition={{ duration: 0.04 }}
                  variants={charVariant}
                >
                  {ch}
                </motion.span>
              ))}
            </motion.h1>
            <motion.h2
              initial="hidden"
              whileInView="reveal"
              transition={{ staggerChildren: 0.06 }}
              className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight"
            >
              {brandChars.map((ch, i) => (
                <motion.span
                  key={i}
                  transition={{ duration: 0.05 }}
                  variants={charVariant}
                >
                  {ch}
                </motion.span>
              ))}
            </motion.h2>
            <p className="text-base text-slate-500 leading-relaxed max-w-md">
              Bharat's first e-commerce platform for stone aggregates —
              connecting buyers and suppliers across India with real-time
              ordering, tracking, and delivery.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <Link
                to="/products"
                className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
              >
                Browse Products
              </Link>
              <Link
                to="/qr"
                className="flex items-center gap-2 border border-slate-200 hover:border-slate-400 text-slate-700 text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
              >
                <BsQrCodeScan size={16} /> Quick Order via QR
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              <Lottie options={lottieHero} height={320} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────────── */}
      <section className="bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <Stat value="500+" label="Active Suppliers" />
          <Stat value="10K+" label="Orders Delivered" />
          <Stat value="15+" label="States Covered" />
          <Stat value="24 hr" label="Avg. Delivery Time" />
        </div>
      </section>

      {/* ── Scan to connect ───────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center">
            <div className="w-full max-w-xs rounded-2xl overflow-hidden shadow-lg border border-slate-100">
              <Lottie options={lottieScan} height={280} />
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <span className="text-xs font-bold tracking-widest text-orange-500 uppercase">
              Quick Connect
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Order via WhatsApp in seconds
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              The ServCrust platform integrates <strong>WhatsApp</strong> and
              our <strong>Mobile App</strong> for effortless order placement and
              real-time communication with suppliers.
            </p>
            <div className="space-y-3">
              {[
                "Scan & connect instantly",
                "Browse live product catalogue",
                "Place order, track delivery",
              ].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-700">{step}</span>
                </div>
              ))}
            </div>
            <Link
              to="/qr"
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors w-fit"
            >
              <BsQrCodeScan size={16} /> Get the QR Code
            </Link>
          </div>
        </div>
      </section>

      {/* ── About ─────────────────────────────────────────────────────────── */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="text-xs font-bold tracking-widest text-orange-500 uppercase">
              About Us
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2 mb-4">
              Your trusted partner in construction aggregates
            </h2>
            <p className="text-slate-500 text-sm leading-7">
              ServCrust is a dynamic digital platform dedicated to
              revolutionizing the construction industry through advanced
              technology and streamlined procurement — connecting buyers and
              suppliers at scale.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Our Vision",
                body: "A future where every infrastructure project is executed with unparalleled efficiency and precision.",
              },
              {
                title: "Our Mission",
                body: "Become the market-leading platform for procuring infrastructure materials — creating an ecosystem where partners flourish.",
              },
              {
                title: "Our Impact",
                body: "Building India's largest B2B platform for procuring infrastructure construction materials, state by state.",
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
              >
                <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coverage map ──────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="rounded-2xl overflow-hidden shadow-md border border-slate-100">
            <img
              src={map}
              alt="Service coverage map"
              className="w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-5">
            <span className="text-xs font-bold tracking-widest text-orange-500 uppercase">
              Pan India Coverage
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug">
              Performance to succeed today.
              <br />
              Technology to lead tomorrow.
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              We are rapidly expanding our supplier network and delivery reach
              across India — from tier-1 cities to tier-3 towns — making quality
              aggregates accessible everywhere.
            </p>
            <div className="flex gap-4">
              {[
                ["15+", "States"],
                ["50+", "Cities"],
                ["500+", "Quarries"],
              ].map(([n, l]) => (
                <div
                  key={l}
                  className="bg-orange-50 border border-orange-100 rounded-xl px-5 py-3 text-center"
                >
                  <p className="text-xl font-bold text-orange-600">{n}</p>
                  <p className="text-xs text-slate-500">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">
              Process
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">
              How ServCrust works
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              {[
                {
                  icon: <FcCheckmark className="text-2xl" />,
                  title: "Track your Truck",
                  desc: "Real-time GPS tracking from quarry to site.",
                },
                {
                  icon: <FcCheckmark className="text-2xl" />,
                  title: "On-Time Delivery",
                  desc: "We guarantee on-schedule delivery with live ETA updates.",
                },
                {
                  icon: <FcCheckmark className="text-2xl" />,
                  title: "Optimised Logistics",
                  desc: "AI-driven route optimisation reduces cost and wait time.",
                },
              ].map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 bg-white/5 rounded-xl p-4 border border-white/10"
                >
                  <span className="shrink-0 mt-0.5">{icon}</span>
                  <div>
                    <h3 className="text-white font-semibold text-sm">
                      {title}
                    </h3>
                    <p className="text-slate-400 text-xs mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <Lottie options={lottieMap} height={320} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Business strategy slider ──────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest text-orange-500 uppercase">
              Our Approach
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">
              Business Strategy
            </h2>
            <p className="text-slate-500 text-sm mt-3 max-w-lg mx-auto">
              Driving growth across India's construction sector through
              innovation, efficiency, and trusted partnerships.
            </p>
          </div>

          {/* slider wrapper — extra bottom padding gives dots room to breathe */}
          <div className="pb-10">
            <Slider {...sliderSettings}>
              {strategyImages.map((src, i) => (
                <div key={i} className="px-3 focus:outline-none">
                  <div className="group relative rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-white">
                    {/* contain so the full infographic is always visible */}
                    <div className="aspect-[4/3] flex items-center justify-center bg-slate-50">
                      <img
                        src={src}
                        alt={`Strategy ${i + 1}`}
                        className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                    {/* bottom label bar */}
                    <div className="px-4 py-3 border-t border-slate-100 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        Strategy 0{i + 1}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* ── Promises ──────────────────────────────────────────────────────── */}
      <section className="bg-slate-50 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest text-orange-500 uppercase">
              Our Commitment
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">
              Our Promises
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <AiOutlineSolution className="text-3xl text-orange-500" />
                ),
                title: "Smart Solutions",
                desc: "We listen to your unique needs, then deliver smart, high-quality solutions right-sized to your objectives and budget.",
              },
              {
                icon: <VscServerProcess className="text-3xl text-orange-500" />,
                title: "Powerful Processes",
                desc: "Our proven processes and commitment to continuous improvement greatly increase efficiency and keep projects on schedule.",
              },
              {
                icon: <TbMessage2Code className="text-3xl text-orange-500" />,
                title: "Open Communication",
                desc: "We keep everyone focused on a common goal with no surprises — transparent collaboration every step of the way.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{icon}</div>
                <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────────────────── */}
      {/* <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest text-orange-500 uppercase">
              Leadership
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">
              Our Team
            </h2>
            <p className="text-slate-500 text-sm mt-3 max-w-xl mx-auto">
              A team of passionate individuals with diverse backgrounds —
              committed to driving excellence and infusing innovation in
              everything we do.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              {
                src: ceo,
                name: "Kranthi Kiran Reddy",
                title: "Chief Executive Officer",
              },
              {
                src: cto,
                name: "Sandeep Pamidiparthi",
                title: "Chief Technology Officer",
              },
            ].map(({ src, name, title }) => (
              <div
                key={name}
                className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center w-60 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden border-4 border-orange-100 shadow-md">
                  <img
                    src={src}
                    alt={name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">{name}</h3>
                <p className="text-xs text-orange-500 font-medium mt-1">
                  {title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── Logo marquee ──────────────────────────────────────────────────── */}
      <section className="py-6 border-t border-slate-100">
        <Marquee gradient={false} speed={40}>
          <img
            src={logo}
            alt="ServCrust logo"
            className="h-10 mx-12 opacity-60"
          />
          <img
            src={logo}
            alt="ServCrust logo"
            className="h-10 mx-12 opacity-60"
          />
          <img
            src={logo}
            alt="ServCrust logo"
            className="h-10 mx-12 opacity-60"
          />
        </Marquee>
      </section>
    </div>
  );
}

export default Home;
