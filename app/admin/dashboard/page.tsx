'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Shop = {
  id: string
  shop_name: string
  slug: string
  phone: string
  whatsapp: string
  today_offer: string
}

export default function DashboardPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadShops()
  }, [])

  async function loadShops() {
    const { data, error } = await supabase
      .from('shops')
      .select('*')

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setShops(data || [])
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#050711] p-5 text-white">
      <div className="mx-auto max-w-5xl py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-white/60">
              Manage all shops and QR pages
            </p>
          </div>

          <Link
            href="/admin/shops/new"
            className="rounded-2xl bg-lime-300 px-5 py-3 font-black text-black"
          >
            Add Shop
          </Link>
        </div>

        {loading && (
          <p className="mt-8 text-white/60">Loading shops...</p>
        )}

        {message && (
          <div className="mt-8 rounded-2xl bg-red-500/10 p-4 text-red-200">
            {message}
          </div>
        )}

        <div className="mt-8 grid gap-4">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-black">
                    {shop.shop_name}
                  </h2>

                  <p className="mt-1 text-sm text-white/50">
                    /shop/{shop.slug}
                  </p>

                  <p className="mt-3 text-sm text-white/70">
                    {shop.today_offer || 'No offer added'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 md:flex">
                  <Link
                    href={`/shop/${shop.slug}`}
                    target="_blank"
                    className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-black text-black"
                  >
                    Open
                  </Link>

                  <Link
                    href={`/admin/shops/${shop.id}/edit`}
                    className="rounded-2xl bg-blue-500 px-4 py-3 text-center text-sm font-black text-white"
                  >
                    Edit
                  </Link>

                  <Link
                    href={`/admin/shops/${shop.id}/qr`}
                    className="rounded-2xl bg-lime-300 px-4 py-3 text-center text-sm font-black text-black"
                  >
                    QR
                  </Link>

                  <Link
                    href={`/admin/shops/${shop.id}/customers`}
                    className="rounded-2xl bg-purple-500 px-4 py-3 text-center text-sm font-black text-white"
                  >
                    Customers
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && shops.length === 0 && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-6 text-center">
            <p className="font-bold">No shops found</p>
          </div>
        )}
      </div>
    </main>
  )
}