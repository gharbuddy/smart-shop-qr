import Link from 'next/link'
import {
  FaQrcode,
  FaGift,
  FaUsers,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaStar,
  FaChartLine,
  FaStore,
  FaUserCheck,
} from 'react-icons/fa'

export default function HomePage() {
  const benefits = [
    {
      icon: <FaQrcode />,
      title: 'One QR for your shop',
      text: 'Customers scan one QR and see your shop details, offers, location, social links, and rewards.',
    },
    {
      icon: <FaGift />,
      title: 'Reward loyal customers',
      text: 'Give points based on purchase amount and bring customers back again.',
    },
    {
      icon: <FaUsers />,
      title: 'Build customer list',
      text: 'Know who is visiting your shop, their phone number, visits, and reward points.',
    },
    {
      icon: <FaWhatsapp />,
      title: 'Easy WhatsApp contact',
      text: 'Customers can contact your shop directly from the QR page.',
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Google Maps access',
      text: 'Customers can open your shop location instantly.',
    },
    {
      icon: <FaStar />,
      title: 'Get more reviews',
      text: 'Add Google review button and make it easier for happy customers to review your shop.',
    },
  ]

  const customerBenefits = [
    'No app install required',
    'Login once and use across Smart Shop QR stores',
    'Earn points on purchases',
    'See offers in one place',
    'Open shop WhatsApp, location, and social pages quickly',
  ]

  const shopkeeperBenefits = [
    'Create digital shop profile',
    'Print QR code for counter',
    'Update offers anytime',
    'Track customers and visits',
    'Redeem customer reward points',
    'Manage everything from shopkeeper portal',
  ]

  return (
    <main className="min-h-screen overflow-hidden bg-[#050711] text-white">
      <section className="relative px-5 py-8">
        <div className="absolute left-[-160px] top-[-140px] h-96 w-96 rounded-full bg-lime-400/20 blur-3xl" />
        <div className="absolute right-[-160px] top-[240px] h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-300 text-xl text-black">
                <FaQrcode />
              </div>
              <div>
                <p className="text-lg font-black">Smart Shop QR</p>
                <p className="text-xs text-white/50">Digital rewards for local shops</p>
              </div>
            </div>

            <Link
              href="/owner/login"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-black"
            >
              Shopkeeper Login
            </Link>
          </nav>

          <div className="grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-lime-300">
                <FaStore />
                Built for local shops
              </div>

              <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight md:text-6xl">
                Turn your shop QR into a customer loyalty system.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
                Smart Shop QR helps shopkeepers show offers, social links, Google location, WhatsApp, reviews, and reward points through one simple QR code.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/admin/shops/new"
                  className="rounded-3xl bg-lime-300 px-8 py-4 text-center font-black text-black shadow-xl transition hover:scale-[1.02]"
                >
                  Register Shop
                </Link>

                <Link
                  href="/owner/login"
                  className="rounded-3xl border border-white/10 bg-white/10 px-8 py-4 text-center font-black text-white transition hover:scale-[1.02]"
                >
                  Already Registered
                </Link>
              </div>

              <p className="mt-5 text-sm text-white/45">
                No app needed for customers. They scan QR and open your page in browser.
              </p>
            </div>

            <div className="relative">
              <div className="rounded-[44px] border border-white/10 bg-white/[0.08] p-5 shadow-2xl backdrop-blur-2xl">
                <div className="rounded-[36px] bg-gradient-to-br from-lime-300 via-emerald-300 to-cyan-200 p-6 text-black">
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-black text-white">
                      <FaQrcode />
                    </div>
                    <div className="rounded-full bg-black/10 px-4 py-2 text-xs font-black">
                      Verified Shop
                    </div>
                  </div>

                  <h2 className="mt-8 text-3xl font-black">Kashmir Bakery</h2>
                  <p className="mt-2 text-sm text-black/60">
                    Scan, earn points, and view today’s offer.
                  </p>

                  <div className="mt-6 rounded-[30px] bg-black p-5 text-white">
                    <p className="text-sm text-white/50">Reward Balance</p>
                    <p className="mt-2 text-6xl font-black">520</p>
                    <p className="text-sm text-white/50">points available</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {['WhatsApp', 'Maps', 'Review'].map((item) => (
                    <div
                      key={item}
                      className="rounded-3xl bg-white/10 p-4 text-center text-sm font-bold text-white/70"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-3xl bg-white/10 p-5">
                  <p className="font-black">Today’s Offer</p>
                  <p className="mt-2 text-sm text-white/60">
                    Buy worth ₹5000 and earn 50 reward points.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-lime-300">
              Benefits
            </p>
            <h2 className="mt-4 text-4xl font-black">
              Why shopkeepers should use it
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/60">
              It helps your shop look modern, collect customers, promote offers, and encourage repeat visits.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item) => (
              <div
                key={item.title}
                className="rounded-[32px] border border-white/10 bg-white/[0.08] p-6 shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-300 text-2xl text-black">
                  {item.icon}
                </div>
                <h3 className="mt-5 text-xl font-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-10">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <div className="rounded-[36px] border border-white/10 bg-white/[0.08] p-7">
            <div className="flex items-center gap-3">
              <FaStore className="text-3xl text-lime-300" />
              <h2 className="text-2xl font-black">For shopkeepers</h2>
            </div>

            <div className="mt-6 space-y-4">
              {shopkeeperBenefits.map((item) => (
                <div key={item} className="flex gap-3 text-white/70">
                  <FaUserCheck className="mt-1 shrink-0 text-lime-300" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[36px] border border-white/10 bg-white/[0.08] p-7">
            <div className="flex items-center gap-3">
              <FaUsers className="text-3xl text-lime-300" />
              <h2 className="text-2xl font-black">For customers</h2>
            </div>

            <div className="mt-6 space-y-4">
              {customerBenefits.map((item) => (
                <div key={item} className="flex gap-3 text-white/70">
                  <FaUserCheck className="mt-1 shrink-0 text-lime-300" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-4xl rounded-[40px] bg-gradient-to-br from-lime-300 via-emerald-300 to-cyan-200 p-8 text-center text-black shadow-2xl">
          <FaChartLine className="mx-auto text-5xl" />
          <h2 className="mt-5 text-4xl font-black">
            Start with one QR. Build repeat customers.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-black/65">
            Register your shop, print your QR, place it on your counter, and let customers start earning points.
          </p>

          <Link
            href="/admin/shops/new"
            className="mt-8 inline-block rounded-3xl bg-black px-8 py-4 font-black text-white"
          >
            Register Your Shop
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-white/40">
        Smart Shop QR. Built for local businesses.
      </footer>
    </main>
  )
}