'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type CustomerRow = {
  id: string
  points: number
  visits: number
  customers: {
    name: string
    phone: string
  }
}

export default function OwnerCustomersPage() {
  const router = useRouter()

  const [customers, setCustomers] = useState<CustomerRow[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    const shopId = localStorage.getItem('owner_shop_id')

    if (!shopId) {
      router.push('/owner/login')
      return
    }

    const { data, error } = await supabase
      .from('shop_customers')
      .select(`
        id,
        points,
        visits,
        customers (
          name,
          phone
        )
      `)
      .eq('shop_id', shopId)

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setCustomers((data || []) as CustomerRow[])
    setLoading(false)
  }

  async function redeemPoints(rowId: string, currentPoints: number) {
    if (currentPoints < 500) {
      setMessage('Minimum 500 points required to redeem')
      return
    }

    const newPoints = currentPoints - 500

    const { error } = await supabase
      .from('shop_customers')
      .update({
        points: newPoints,
      })
      .eq('id', rowId)

    if (error) {
      setMessage(error.message)
      return
    }

    setCustomers((prev) =>
      prev.map((item) =>
        item.id === rowId ? { ...item, points: newPoints } : item
      )
    )

    setMessage('500 points redeemed successfully')
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050711] text-white">
        Loading customers...
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#050711] p-5 text-white">
      <div className="mx-auto max-w-4xl py-8">
        <button
          onClick={() => router.push('/owner/dashboard')}
          className="mb-6 rounded-2xl bg-white px-4 py-3 text-sm font-black text-black"
        >
          Back
        </button>

        <div>
          <p className="text-sm text-white/50">Customer Management</p>
          <h1 className="text-3xl font-black">Customers</h1>
          <p className="mt-2 text-sm text-white/60">
            View customer visits, reward points, and redeem rewards
          </p>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm text-white">
            {message}
          </div>
        )}

        <div className="mt-8 grid gap-4">
          {customers.map((row) => (
            <div
              key={row.id}
              className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-black">
                    {row.customers?.name || 'Unknown Customer'}
                  </h2>
                  <p className="mt-1 text-sm text-white/60">
                    {row.customers?.phone || 'No phone'}
                  </p>

                  {row.points < 500 && (
                    <p className="mt-2 text-xs text-yellow-300">
                      Minimum 500 points required to redeem
                    </p>
                  )}

                  {row.points >= 500 && (
                    <p className="mt-2 text-xs text-lime-300">
                      Eligible for reward redemption
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  <div className="rounded-2xl bg-lime-300 px-5 py-3 text-center text-black">
                    <p className="text-xs font-bold text-black/60">Points</p>
                    <p className="text-xl font-black">{row.points}</p>
                  </div>

                  <div className="rounded-2xl bg-white px-5 py-3 text-center text-black">
                    <p className="text-xs font-bold text-black/60">Visits</p>
                    <p className="text-xl font-black">{row.visits}</p>
                  </div>

                  <button
                    onClick={() => redeemPoints(row.id, row.points)}
                    disabled={row.points < 500}
                    className={`rounded-2xl px-5 py-3 text-center text-sm font-black ${
                      row.points >= 500
                        ? 'bg-purple-500 text-white'
                        : 'cursor-not-allowed bg-white/10 text-white/30'
                    }`}
                  >
                    Redeem 500
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {customers.length === 0 && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-6 text-center">
            <p className="font-black">No customers yet</p>
            <p className="mt-2 text-sm text-white/60">
              Customers will appear here after they scan QR and login.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}