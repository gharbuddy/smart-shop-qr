'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

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

  const [createdShopName, setCreatedShopName] = useState('')
  const [createdPhone, setCreatedPhone] = useState('')
  const [createdPin, setCreatedPin] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  function createSlug(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  async function createShop() {
    setMessage('')
    setCreatedShopName('')
    setCreatedPhone('')
    setCreatedPin('')
    setLoading(true)

    const cleanShopName = shopName.trim()
    const cleanPhone = phone.trim()
    const cleanPin = pin.trim() || '1234'

    if (!cleanShopName || !cleanPhone) {
      setMessage('Shop name and phone are required')
      setLoading(false)
      return
    }

    const slug = createSlug(cleanShopName)

    const { data: existingShop } = await supabase
      .from('shops')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (existingShop) {
      setMessage('This shop name already exists. Please use a different shop name.')
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('shops')
      .insert({
        shop_name: cleanShopName,
        slug,
        phone: cleanPhone,
        whatsapp: whatsapp.trim() || cleanPhone,
        instagram_url: instagram.trim(),
        facebook_url: facebook.trim(),
        twitter_url: twitter.trim(),
        google_maps_url: maps.trim(),
        google_review_url: review.trim(),
        today_offer: offer.trim(),
        cashier_pin: cleanPin,
        owner_phone: cleanPhone,
        owner_pin: cleanPin,
      })
      .select()
      .single()

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    localStorage.removeItem('owner_shop_id')
    localStorage.removeItem('owner_shop_name')

    setCreatedShopName(data.shop_name)
    setCreatedPhone(cleanPhone)
    setCreatedPin(cleanPin)
    setMessage('Shop registered successfully. Please login to your dashboard.')
    setLoading(false)

    setShopName('')
    setPhone('')
    setWhatsapp('')
    setInstagram('')
    setFacebook('')
    setTwitter('')
    setMaps('')
    setReview('')
    setOffer('')
    setPin('1234')
  }

  return (
    <main className="min-h-screen bg-[#050711] p-5 text-white">
      <div className="mx-auto max-w-md py-8">
      <Link
  href="/"
  className="mb-6 inline-block rounded-2xl bg-white px-4 py-3 text-sm font-black text-black"
>
  Back to Home
</Link>
        <h1 className="text-3xl font-black">Create Your Smart Shop</h1>
        <p className="mt-2 text-sm text-white/60">
          Create your Smart Shop QR account. After registration, login to your dashboard to view and print your QR.
        </p>

        <div className="mt-8 space-y-4">
          <input className="input" placeholder="Shop name" value={shopName} onChange={(e) => setShopName(e.target.value)} />
          <input className="input" placeholder="Owner phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input className="input" placeholder="WhatsApp number" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
          <input className="input" placeholder="Instagram URL" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
          <input className="input" placeholder="Facebook URL" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
          <input className="input" placeholder="X / Twitter URL" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
          <input className="input" placeholder="Google Maps URL" value={maps} onChange={(e) => setMaps(e.target.value)} />
          <input className="input" placeholder="Google Review URL" value={review} onChange={(e) => setReview(e.target.value)} />
          <input className="input" placeholder="Today offer" value={offer} onChange={(e) => setOffer(e.target.value)} />
          <input className="input" placeholder="Login PIN and Cashier PIN" value={pin} onChange={(e) => setPin(e.target.value)} />

          <button
            onClick={createShop}
            disabled={loading}
            className="w-full rounded-3xl bg-lime-300 p-4 font-black text-black disabled:opacity-60"
          >
            {loading ? 'Creating Shop...' : 'Register Shop'}
          </button>

          {message && (
            <div className="rounded-2xl bg-white/10 p-4 text-sm">
              {message}
            </div>
          )}

          {createdShopName && (
            <div className="rounded-[32px] border border-white/10 bg-white/10 p-5 shadow-2xl">
              <p className="text-sm text-lime-300">Registration Complete</p>

              <h2 className="mt-2 text-2xl font-black">
                {createdShopName}
              </h2>

              <div className="mt-4 rounded-3xl bg-black/30 p-4">
                <p className="text-sm text-white/60">Login Phone</p>
                <p className="mt-1 font-black">{createdPhone}</p>

                <p className="mt-4 text-sm text-white/60">Login PIN</p>
                <p className="mt-1 font-black">{createdPin}</p>
              </div>

              <p className="mt-4 text-sm text-white/60">
                Use these details to login and manage your shop QR, offers, customers, and rewards.
              </p>

              <Link
                href="/owner/login"
                className="mt-5 block rounded-3xl bg-white p-4 text-center font-black text-black"
              >
                Login to Dashboard
              </Link>
            </div>
          )}
        </div>
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
      `}</style>
    </main>
  )
}