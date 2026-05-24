'use client'

import { use, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaStar,
  FaGift,
  FaShoppingBag,
  FaCheckCircle,
  FaUserAlt,
  FaRupeeSign,
} from 'react-icons/fa'
import { SiX } from 'react-icons/si'

type Shop = {
  id: string
  shop_name: string
  slug: string
  phone: string
  whatsapp: string
  facebook_url: string
  instagram_url: string
  twitter_url: string
  google_maps_url: string
  google_review_url: string
  today_offer: string
  cashier_pin: string
}

type Customer = {
  id: string
  name: string
  phone: string
}

export default function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)

  const [shop, setShop] = useState<Shop | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [purchaseAmount, setPurchaseAmount] = useState('')

  const [points, setPoints] = useState(0)
  const [visits, setVisits] = useState(0)

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadShop()
  }, [])

  useEffect(() => {
    if (shop) {
      autoLoginCustomer()
    }
  }, [shop])

  async function loadShop() {
    setLoading(true)

    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    if (!data) {
      setMessage('Shop not found')
      setLoading(false)
      return
    }

    setShop(data)
    setLoading(false)
  }

  async function autoLoginCustomer() {
    const savedName = localStorage.getItem('customer_name')
    const savedPhone = localStorage.getItem('customer_phone')

    if (!savedName || !savedPhone || !shop) return

    await loginCustomerWithDetails(savedName, savedPhone, false)
  }

  async function loginCustomer() {
    const cleanName = name.trim()
    const cleanPhone = phone.trim()

    if (!cleanName || !cleanPhone) {
      setMessage('Please enter name and mobile number')
      return
    }

    localStorage.setItem('customer_name', cleanName)
    localStorage.setItem('customer_phone', cleanPhone)

    await loginCustomerWithDetails(cleanName, cleanPhone, true)
  }

  async function loginCustomerWithDetails(
    cleanName: string,
    cleanPhone: string,
    showMessage: boolean
  ) {
    if (!shop) return

    let currentCustomer: Customer | null = null

    const { data: existingCustomer, error: existingError } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', cleanPhone)
      .maybeSingle()

    if (existingError) {
      setMessage(existingError.message)
      return
    }

    if (existingCustomer) {
      currentCustomer = existingCustomer
    } else {
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          name: cleanName,
          phone: cleanPhone,
        })
        .select()
        .single()

      if (customerError) {
        setMessage(customerError.message)
        return
      }

      currentCustomer = newCustomer
    }


    if (!currentCustomer) {
      setMessage('Customer login failed')
       return
    }

    const { data: existingRelation, error: relationCheckError } = await supabase
      .from('shop_customers')
      .select('*')
      .eq('shop_id', shop.id)
      .eq('customer_id', currentCustomer.id)
      .maybeSingle()

    if (relationCheckError) {
      setMessage(relationCheckError.message)
      return
    }

    if (!existingRelation) {
      const { error: insertRelationError } = await supabase
        .from('shop_customers')
        .insert({
          shop_id: shop.id,
          customer_id: currentCustomer.id,
          points: 0,
          visits: 0,
        })

      if (insertRelationError) {
        setMessage(insertRelationError.message)
        return
      }
    }

    const { data: shopCustomer, error: shopCustomerError } = await supabase
      .from('shop_customers')
      .select('*')
      .eq('shop_id', shop.id)
      .eq('customer_id', currentCustomer.id)
      .maybeSingle()

    if (shopCustomerError) {
      setMessage(shopCustomerError.message)
      return
    }

    setCustomer(currentCustomer)
    setPoints(shopCustomer?.points || 0)
    setVisits(shopCustomer?.visits || 0)
    setMessage(showMessage ? 'Login successful' : '')
  }

  function changeCustomer() {
    localStorage.removeItem('customer_name')
    localStorage.removeItem('customer_phone')

    setCustomer(null)
    setName('')
    setPhone('')
    setPoints(0)
    setVisits(0)
    setMessage('Customer changed. Please login again.')
  }

  async function claimPoints() {
    if (!shop || !customer) return

    const amount = Number(purchaseAmount)

    if (!amount || amount <= 0) {
      setMessage('Please enter valid purchase amount')
      return
    }

    if (pin !== shop.cashier_pin) {
      setMessage('Invalid cashier PIN')
      return
    }

    const earnedPoints = Math.floor(amount / 100)

    if (earnedPoints <= 0) {
      setMessage('Minimum purchase amount should be ₹100 to earn points')
      return
    }

    const newPoints = points + earnedPoints
    const newVisits = visits + 1

    const { error } = await supabase
      .from('shop_customers')
      .update({
        points: newPoints,
        visits: newVisits,
      })
      .eq('shop_id', shop.id)
      .eq('customer_id', customer.id)

    if (error) {
      setMessage(error.message)
      return
    }

    const { error: transactionError } = await supabase
      .from('reward_transactions')
      .insert({
        shop_id: shop.id,
        customer_id: customer.id,
        type: 'earn',
        amount: amount,
        points: earnedPoints,
        note: `Purchase of ₹${amount}`,
      })

    if (transactionError) {
      setMessage(transactionError.message)
      return
    }

    setPoints(newPoints)
    setVisits(newVisits)
    setPin('')
    setPurchaseAmount('')
    setMessage(`₹${amount} purchase added. ${earnedPoints} points earned.`)
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050711] text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-lime-300" />
      </main>
    )
  }

  if (!shop) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050711] p-6 text-white">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 text-center">
          <h1 className="text-xl font-bold">Shop not loading</h1>
          <p className="mt-2 text-sm text-white/60">{message}</p>
        </div>
      </main>
    )
  }

  const socialLinks = [
    {
      label: 'WhatsApp',
      icon: <FaWhatsapp />,
      url: `https://wa.me/91${shop.whatsapp}`,
      style: 'from-emerald-400 to-green-600',
    },
    {
      label: 'Call',
      icon: <FaPhoneAlt />,
      url: `tel:${shop.phone}`,
      style: 'from-sky-400 to-blue-600',
    },
    {
      label: 'Instagram',
      icon: <FaInstagram />,
      url: shop.instagram_url,
      style: 'from-fuchsia-500 via-pink-500 to-orange-400',
    },
    {
      label: 'Facebook',
      icon: <FaFacebookF />,
      url: shop.facebook_url,
      style: 'from-blue-500 to-indigo-700',
    },
    {
      label: 'Location',
      icon: <FaMapMarkerAlt />,
      url: shop.google_maps_url,
      style: 'from-slate-500 to-slate-800',
    },
    {
      label: 'Review',
      icon: <FaStar />,
      url: shop.google_review_url,
      style: 'from-yellow-300 to-amber-500 text-black',
    },
    {
      label: 'X',
      icon: <SiX />,
      url: shop.twitter_url,
      style: 'from-neutral-800 to-black',
    },
  ]

  if (!customer) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#050711] px-5 py-8 text-white">
        <div className="absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-lime-400/20 blur-3xl" />
        <div className="absolute bottom-[-140px] right-[-120px] h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />

        <div className="relative mx-auto flex min-h-[90vh] max-w-md items-center">
          <div className="w-full overflow-hidden rounded-[38px] border border-white/10 bg-white/[0.08] shadow-2xl backdrop-blur-2xl">
            <div className="bg-gradient-to-br from-lime-300 via-emerald-300 to-cyan-200 p-7 text-black">
              <div className="flex items-center justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-black text-2xl text-white shadow-xl">
                  <FaShoppingBag />
                </div>

                <div className="flex items-center gap-2 rounded-full bg-black/10 px-4 py-2 text-xs font-bold">
                  <FaCheckCircle />
                  Verified Shop
                </div>
              </div>

              <p className="mt-10 text-sm font-semibold text-black/60">Welcome to</p>
              <h1 className="mt-1 text-4xl font-black tracking-tight">{shop.shop_name}</h1>
              <p className="mt-4 text-sm leading-6 text-black/70">
                Sign in once. Your login will work across all Smart Shop QR stores.
              </p>
            </div>

            <div className="space-y-4 p-6">
              <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/10 px-4">
                <FaUserAlt className="text-white/40" />
                <input
                  className="w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-white/40"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/10 px-4">
                <FaPhoneAlt className="text-white/40" />
                <input
                  className="w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-white/40"
                  placeholder="Enter mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <button
                onClick={loginCustomer}
                className="w-full rounded-3xl bg-white py-4 text-sm font-black text-black shadow-xl transition hover:scale-[1.02]"
              >
                Enter Shop
              </button>

              {message && (
                <p className="rounded-2xl bg-red-500/10 p-3 text-sm text-red-200">
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050711] px-5 py-6 text-white">
      <div className="absolute left-[-140px] top-[-120px] h-96 w-96 rounded-full bg-lime-400/20 blur-3xl" />
      <div className="absolute bottom-[-160px] right-[-140px] h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-md">
        <div className="overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.08] shadow-2xl backdrop-blur-2xl">
          <div className="bg-gradient-to-br from-lime-300 via-emerald-300 to-cyan-200 p-6 text-black">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-black text-2xl text-white shadow-xl">
                <FaShoppingBag />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-black/50">
                  Smart Shop QR
                </p>
                <h1 className="mt-1 text-2xl font-black tracking-tight">{shop.shop_name}</h1>
                <p className="mt-1 text-sm font-medium text-black/60">Welcome, {customer.name}</p>
              </div>
            </div>

            <div className="mt-6 rounded-[30px] bg-black p-5 text-white shadow-2xl">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/60">Reward Balance</p>
                <FaGift className="text-2xl text-lime-300" />
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-6xl font-black">{points}</p>
                  <p className="text-sm text-white/50">points available</p>
                </div>

                <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
                  {visits} visits
                </div>
              </div>

              <p className="mt-4 text-xs text-white/50">
                Reward rule: ₹100 purchase = 1 point
              </p>
            </div>
          </div>

          <div className="p-5">
            <button
              onClick={changeCustomer}
              className="mb-5 w-full rounded-3xl border border-white/10 bg-white/10 p-3 text-sm font-bold text-white/80"
            >
              Change customer
            </button>

            <div className="rounded-[30px] border border-white/10 bg-white/10 p-5 shadow-lg">
              <div className="flex items-center gap-2 text-lime-300">
                <FaStar />
                <p className="text-xs font-black uppercase tracking-[0.25em]">
                  Today’s Offer
                </p>
              </div>

              <p className="mt-3 text-sm leading-6 text-white/80">
                {shop.today_offer}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-4">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.url || '#'}
                  target="_blank"
                  className="group"
                >
                  <div className={`flex aspect-square items-center justify-center rounded-[30px] bg-gradient-to-br ${item.style} text-2xl shadow-xl transition group-hover:scale-105`}>
                    {item.icon}
                  </div>
                  <p className="mt-2 text-center text-xs font-medium text-white/60">
                    {item.label}
                  </p>
                </a>
              ))}
            </div>

            <div className="mt-6 rounded-[32px] border border-white/10 bg-white/10 p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-black">Claim reward points</p>
                  <p className="mt-1 text-sm text-white/50">
                    Enter bill amount and cashier PIN
                  </p>
                </div>

                <div className="rounded-full bg-lime-300 px-4 py-2 text-sm font-black text-black">
                  ₹100 = 1 point
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-3xl border border-white/10 bg-black/30 px-4">
                <FaRupeeSign className="text-white/40" />
                <input
                  className="w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-white/40"
                  placeholder="Enter purchase amount"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                />
              </div>

              <input
                className="mt-4 w-full rounded-3xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-lime-300"
                placeholder="Enter cashier PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />

              <button
                onClick={claimPoints}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-3xl bg-white py-4 text-sm font-black text-black shadow-xl transition hover:scale-[1.02]"
              >
                Add Points
                <FaGift />
              </button>
            </div>

            {message && (
              <p className="mt-5 rounded-2xl bg-white/10 p-3 text-center text-sm font-medium text-white/80">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}