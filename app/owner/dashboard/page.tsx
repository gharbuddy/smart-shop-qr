'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Shop = {
  id: string
  shop_name: string
  slug: string
  phone: string
  whatsapp: string
  today_offer: string
}

export default function OwnerDashboardPage() {
  const router = useRouter()

  const [shop, setShop] = useState<Shop | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadOwnerShop()
  }, [])

  async function loadOwnerShop() {
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
      localStorage.removeItem('owner_shop_id')
      router.push('/owner/login')
      return
    }

    setShop(data)
    setLoading(false)
  }

  function logout() {
    localStorage.removeItem('owner_shop_id')
    localStorage.removeItem('owner_shop_name')
    router.push('/owner/login')
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050711] text-white">
        Loading dashboard...
      </main>
    )
  }

  if (!shop) {
    return (
      <main className="min-h-screen bg-[#050711] p-5 text-white">
        {message}
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#050711] p-5 text-white">
      <div className="mx-auto max-w-3xl py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-white/50">Shopkeeper Portal</p>
            <h1 className="text-3xl font-black">{shop.shop_name}</h1>
            <p className="mt-2 text-sm text-white/60">/shop/{shop.slug}</p>
          </div>

          <button
            onClick={logout}
            className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-black"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Link
            href={`/shop/${shop.slug}`}
            target="_blank"
            className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl"
          >
            <h2 className="text-xl font-black">Open Shop Page</h2>
            <p className="mt-2 text-sm text-white/60">
              View customer QR page
            </p>
          </Link>

          <Link
            href="/owner/edit"
            className="rounded-3xl border border-white/10 bg-blue-500 p-6 shadow-xl"
          >
            <h2 className="text-xl font-black">Edit Shop Details</h2>
            <p className="mt-2 text-sm text-white/80">
              Update phone, offer, links, and PIN
            </p>
          </Link>

          <Link
            href="/owner/qr"
            className="rounded-3xl border border-white/10 bg-lime-300 p-6 text-black shadow-xl"
          >
            <h2 className="text-xl font-black">View QR Code</h2>
            <p className="mt-2 text-sm text-black/70">
              Print or share your shop QR
            </p>
          </Link>

          <Link
            href="/owner/customers"
            className="rounded-3xl border border-white/10 bg-purple-500 p-6 shadow-xl"
          >
            <h2 className="text-xl font-black">Customers</h2>
            <p className="mt-2 text-sm text-white/80">
              View customer visits and points
            </p>
          </Link>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-5">
          <p className="text-sm text-white/50">Current Offer</p>
          <p className="mt-2 font-bold">
            {shop.today_offer || 'No offer added'}
          </p>
        </div>
      </div>
    </main>
  )
}