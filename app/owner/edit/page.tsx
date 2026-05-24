'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Shop = {
  id: string
  shop_name: string
  phone: string
  whatsapp: string
  instagram_url: string
  facebook_url: string
  twitter_url: string
  google_maps_url: string
  google_review_url: string
  today_offer: string
  cashier_pin: string
}

export default function OwnerEditPage() {
  const router = useRouter()

  const [shop, setShop] = useState<Shop | null>(null)

  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [instagram, setInstagram] = useState('')
  const [facebook, setFacebook] = useState('')
  const [twitter, setTwitter] = useState('')
  const [maps, setMaps] = useState('')
  const [review, setReview] = useState('')
  const [offer, setOffer] = useState('')
  const [cashierPin, setCashierPin] = useState('')

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadShop()
  }, [])

  async function loadShop() {
    const shopId = localStorage.getItem('owner_shop_id')

    if (!shopId) {
      router.push('/owner/login')
      return
    }

    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', shopId)
      .maybeSingle()

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    if (!data) {
      router.push('/owner/login')
      return
    }

    setShop(data)

    setPhone(data.phone || '')
    setWhatsapp(data.whatsapp || '')
    setInstagram(data.instagram_url || '')
    setFacebook(data.facebook_url || '')
    setTwitter(data.twitter_url || '')
    setMaps(data.google_maps_url || '')
    setReview(data.google_review_url || '')
    setOffer(data.today_offer || '')
    setCashierPin(data.cashier_pin || '')

    setLoading(false)
  }

  async function updateShop() {
    if (!shop) return

    const { error } = await supabase
      .from('shops')
      .update({
        phone: phone,
        whatsapp: whatsapp,
        instagram_url: instagram,
        facebook_url: facebook,
        twitter_url: twitter,
        google_maps_url: maps,
        google_review_url: review,
        today_offer: offer,
        cashier_pin: cashierPin,
      })
      .eq('id', shop.id)

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage('Shop updated successfully')
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050711] text-white">
        Loading...
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#050711] p-5 text-white">
      <div className="mx-auto max-w-2xl py-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/50">Edit Shop</p>
            <h1 className="text-3xl font-black">
              {shop?.shop_name}
            </h1>
          </div>

          <button
            onClick={() => router.push('/owner/dashboard')}
            className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-black"
          >
            Back
          </button>
        </div>

        <div className="mt-8 space-y-4 rounded-[32px] border border-white/10 bg-white/10 p-6 shadow-2xl">
          <input
            className="input"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            className="input"
            placeholder="WhatsApp Number"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />

          <input
            className="input"
            placeholder="Instagram URL"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />

          <input
            className="input"
            placeholder="Facebook URL"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
          />

          <input
            className="input"
            placeholder="X / Twitter URL"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
          />

          <input
            className="input"
            placeholder="Google Maps URL"
            value={maps}
            onChange={(e) => setMaps(e.target.value)}
          />

          <input
            className="input"
            placeholder="Google Review URL"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />

          <input
            className="input"
            placeholder="Today's Offer"
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
          />

          <input
            className="input"
            placeholder="Cashier PIN"
            value={cashierPin}
            onChange={(e) => setCashierPin(e.target.value)}
          />

          <button
            onClick={updateShop}
            className="w-full rounded-3xl bg-lime-300 p-4 font-black text-black"
          >
            Save Changes
          </button>

          {message && (
            <div className="rounded-2xl bg-white/10 p-4 text-sm">
              {message}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.08);
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