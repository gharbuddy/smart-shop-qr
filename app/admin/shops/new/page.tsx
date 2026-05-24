'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { QRCodeCanvas } from 'qrcode.react'

export default function NewShopPage() {
  const [shopName, setShopName] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [instagram, setInstagram] = useState('')
  const [facebook, setFacebook] = useState('')
  const [twitter, setTwitter] = useState('')
  const [maps, setMaps] = useState('')
  const [review, setReview] = useState('')
  const [offer, setOffer] = useState('')
  const [pin, setPin] = useState('1234')

  const [createdLink, setCreatedLink] = useState('')
  const [message, setMessage] = useState('')

  function createSlug(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  async function createShop() {
    setMessage('')
    setCreatedLink('')

    if (!shopName.trim() || !phone.trim()) {
      setMessage('Shop name and phone are required')
      return
    }

    const slug = createSlug(shopName)

    const { error } = await supabase.from('shops').insert({
      shop_name: shopName.trim(),
      slug,
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || phone.trim(),
      instagram_url: instagram.trim(),
      facebook_url: facebook.trim(),
      twitter_url: twitter.trim(),
      google_maps_url: maps.trim(),
      google_review_url: review.trim(),
      today_offer: offer.trim(),
      cashier_pin: pin.trim() || '1234',
    })

    if (error) {
      setMessage(error.message)
      return
    }

    const fullLink = `${window.location.origin}/shop/${slug}`
    setCreatedLink(fullLink)
    setMessage('Shop created successfully')
  }

  function printQr() {
    window.print()
  }

  return (
    <main className="min-h-screen bg-[#050711] p-5 text-white">
      <div className="mx-auto max-w-md py-8">
        <h1 className="text-3xl font-black">Add New Shop</h1>
        <p className="mt-2 text-sm text-white/60">
          Create shop profile and QR link
        </p>

        <div className="mt-8 space-y-4 print:hidden">
          <input className="input" placeholder="Shop name" value={shopName} onChange={(e) => setShopName(e.target.value)} />
          <input className="input" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input className="input" placeholder="WhatsApp number" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
          <input className="input" placeholder="Instagram URL" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
          <input className="input" placeholder="Facebook URL" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
          <input className="input" placeholder="X / Twitter URL" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
          <input className="input" placeholder="Google Maps URL" value={maps} onChange={(e) => setMaps(e.target.value)} />
          <input className="input" placeholder="Google Review URL" value={review} onChange={(e) => setReview(e.target.value)} />
          <input className="input" placeholder="Today offer" value={offer} onChange={(e) => setOffer(e.target.value)} />
          <input className="input" placeholder="Cashier PIN" value={pin} onChange={(e) => setPin(e.target.value)} />

          <button
            onClick={createShop}
            className="w-full rounded-3xl bg-lime-300 p-4 font-black text-black"
          >
            Create Shop
          </button>

          {message && (
            <p className="rounded-2xl bg-white/10 p-3 text-sm">{message}</p>
          )}
        </div>

        {createdLink && (
          <div className="mt-8 rounded-[32px] border border-white/10 bg-white/10 p-6 text-center shadow-2xl print:border-0 print:bg-white print:text-black print:shadow-none">
            <p className="text-sm text-white/60 print:text-black/60">
              Shop QR Link
            </p>

            <h2 className="mt-2 text-2xl font-black print:text-black">
              {shopName}
            </h2>

            <p className="mt-3 break-all text-xs font-medium text-white/70 print:text-black/70">
              {createdLink}
            </p>

            <div className="mt-6 inline-block rounded-3xl bg-white p-4">
              <QRCodeCanvas
                id="shop-qr"
                value={createdLink}
                size={240}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin
              />
            </div>

            <p className="mt-4 text-lg font-black print:text-black">
              Scan to view offers and rewards
            </p>

            <p className="mt-2 text-sm text-white/60 print:text-black/60">
              No app install required
            </p>

            <button
              onClick={printQr}
              className="mt-6 w-full rounded-3xl bg-lime-300 p-4 font-black text-black print:hidden"
            >
              Print QR
            </button>

            <a
              href={createdLink}
              target="_blank"
              className="mt-3 block rounded-3xl bg-white p-4 font-black text-black print:hidden"
            >
              Open Shop Page
            </a>
          </div>
        )}
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.1);
          padding: 16px;
          color: white;
          outline: none;
        }

        .input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        @media print {
          body {
            background: white;
          }
        }
      `}</style>
    </main>
  )
}