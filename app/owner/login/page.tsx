'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function OwnerLoginPage() {
  const router = useRouter()

  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [message, setMessage] = useState('')

  async function loginOwner() {
    setMessage('')

    if (!phone.trim() || !pin.trim()) {
      setMessage('Please enter phone number and PIN')
      return
    }

    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_phone', phone.trim())
      .eq('owner_pin', pin.trim())
      .maybeSingle()

    if (error) {
      setMessage(error.message)
      return
    }

    if (!data) {
      setMessage('Invalid phone number or PIN')
      return
    }

    localStorage.setItem('owner_shop_id', data.id)
    localStorage.setItem('owner_shop_name', data.shop_name)

    router.push('/owner/dashboard')
  }

  return (
    <main className="min-h-screen bg-[#050711] px-5 py-8 text-white">
      <div className="mx-auto flex min-h-[90vh] max-w-md items-center">
        <div className="w-full rounded-[36px] border border-white/10 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-2xl">
          <h1 className="text-3xl font-black">Shopkeeper Login</h1>
          <p className="mt-2 text-sm text-white/60">
            Login to manage your shop details and QR.
          </p>

          <div className="mt-8 space-y-4">
            <input
              className="input"
              placeholder="Owner phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              className="input"
              placeholder="Owner PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />

            <button
              onClick={loginOwner}
              className="w-full rounded-3xl bg-lime-300 p-4 font-black text-black"
            >
              Login
            </button>

            {message && (
              <p className="rounded-2xl bg-red-500/10 p-3 text-sm text-red-200">
                {message}
              </p>
            )}
          </div>
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