'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { QRCodeCanvas } from 'qrcode.react'
import { supabase } from '@/lib/supabase'
import {
  FaGift,
  FaStar,
  FaHeart,
  FaSmile,
  FaShieldAlt,
  FaPrint,
  FaMobileAlt,
} from 'react-icons/fa'

type Shop = {
  id: string
  shop_name: string
  slug: string
}

export default function OwnerQrPage() {
  const router = useRouter()

  const [shop, setShop] = useState<Shop | null>(null)
  const [qrLink, setQrLink] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadShop()
  }, [])

  async function loadShop() {
    const shopId = localStorage.getItem('owner_shop_id')

    if (!shopId) {
      router.push('/owner/login')
      return
    }

    const { data } = await supabase
      .from('shops')
      .select('id, shop_name, slug')
      .eq('id', shopId)
      .maybeSingle()

    if (!data) {
      router.push('/owner/login')
      return
    }

    setShop(data)
    setQrLink(`${window.location.origin}/shop/${data.slug}`)
    setLoading(false)
  }

  function printQr() {
    window.print()
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050711] text-white">
        Loading QR...
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#050711] p-5 text-white">
      <div className="mx-auto max-w-md py-8">
        <button
          onClick={() => router.push('/owner/dashboard')}
          className="mb-6 rounded-2xl bg-white px-4 py-3 text-sm font-black text-black print:hidden"
        >
          Back
        </button>

        <div className="relative overflow-hidden rounded-[42px] border border-white/10 bg-[#080d18] p-6 text-center shadow-2xl print:border-0 print:bg-white print:text-black print:shadow-none">
          <div className="absolute left-[-90px] top-[-90px] h-52 w-52 rounded-full bg-lime-300/25 blur-3xl print:hidden" />
          <div className="absolute bottom-[-100px] right-[-90px] h-56 w-56 rounded-full bg-cyan-300/25 blur-3xl print:hidden" />

          <div className="relative">
            <h1
              className="text-5xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-cyan-300 print:text-black"
              style={{ fontFamily: 'cursive' }}
            >
              Smart Shop QR
            </h1>

            <p className="mt-4 text-sm font-bold uppercase tracking-[0.25em] text-white/70 print:text-black/70">
              Shop Smart • Earn Rewards • Save More
            </p>

            <div className="mt-8">
              <p className="text-3xl font-black uppercase tracking-tight text-white print:text-black">
                Scan to Get
              </p>
              <p className="text-5xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-cyan-300 print:text-black">
                Rewards
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-lime-300/30 bg-white/5 p-4 print:border-black/20 print:bg-white">
                <FaGift className="mx-auto text-3xl text-lime-300 print:text-black" />
                <p className="mt-2 text-xs font-black uppercase text-white/80 print:text-black">
                  Exciting Offers
                </p>
              </div>

              <div className="rounded-3xl border border-cyan-300/30 bg-white/5 p-4 print:border-black/20 print:bg-white">
                <FaStar className="mx-auto text-3xl text-cyan-300 print:text-black" />
                <p className="mt-2 text-xs font-black uppercase text-white/80 print:text-black">
                  Earn Points
                </p>
              </div>
            </div>

            <div className="mt-8 inline-block rounded-[34px] bg-white p-5 shadow-[0_0_35px_rgba(163,255,66,0.35)]">
              <QRCodeCanvas
                id="owner-shop-qr"
                value={qrLink}
                size={260}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin
              />
            </div>

            <div className="mx-auto mt-6 w-fit rounded-full bg-gradient-to-r from-lime-300 to-cyan-300 px-6 py-3 text-sm font-black uppercase text-black">
              Every Scan • Every Spend • Every Reward
            </div>

            <p
              className="mt-5 text-3xl text-lime-300 print:text-black"
              style={{ fontFamily: 'cursive' }}
            >
              Thank you for supporting local!
            </p>

            <p className="mt-3 text-lg font-black text-white print:text-black">
              {shop?.shop_name}
            </p>

            <div className="mt-7 grid grid-cols-4 gap-2 rounded-3xl border border-white/10 bg-white/5 p-3 print:border-black/20 print:bg-white">
              <div className="p-2">
                <FaSmile className="mx-auto text-2xl text-lime-300 print:text-black" />
                <p className="mt-2 text-[10px] font-black uppercase text-white/70 print:text-black">
                  Easy
                </p>
              </div>

              <div className="p-2">
                <FaGift className="mx-auto text-2xl text-yellow-300 print:text-black" />
                <p className="mt-2 text-[10px] font-black uppercase text-white/70 print:text-black">
                  Rewards
                </p>
              </div>

              <div className="p-2">
                <FaShieldAlt className="mx-auto text-2xl text-cyan-300 print:text-black" />
                <p className="mt-2 text-[10px] font-black uppercase text-white/70 print:text-black">
                  Trusted
                </p>
              </div>

              <div className="p-2">
                <FaHeart className="mx-auto text-2xl text-pink-400 print:text-black" />
                <p className="mt-2 text-[10px] font-black uppercase text-white/70 print:text-black">
                  Value
                </p>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-4 print:hidden">
              <button
                onClick={printQr}
                className="flex items-center justify-center gap-2 rounded-3xl bg-lime-300 p-4 font-black text-black"
              >
                <FaPrint />
                Print QR
              </button>

              <a
                href={qrLink}
                target="_blank"
                className="flex items-center justify-center gap-2 rounded-3xl bg-white p-4 font-black text-black"
              >
                <FaMobileAlt />
                Open Page
              </a>
            </div>

            <p className="mt-5 text-sm text-white/50 print:text-black/60">
              Scan • Earn • Redeem • Repeat
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}