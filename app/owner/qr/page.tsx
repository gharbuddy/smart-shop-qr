'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { QRCodeCanvas } from 'qrcode.react'
import {
  Gift,
  Star,
  Shield,
  Heart,
  Smile,
  Printer,
  ExternalLink,
} from 'lucide-react'

export default function OwnerQrPage() {
  const router = useRouter()

  const [shop, setShop] = useState<any>(null)
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
      .select('*')
      .eq('id', shopId)
      .single()

    if (!data) {
      router.push('/owner/login')
      return
    }

    setShop(data)
    setLoading(false)
  }

  function printQr() {
    window.print()
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030712] text-white">
        Loading...
      </main>
    )
  }

  const shopUrl = `${window.location.origin}/shop/${shop.slug}`

  return (
    <main className="min-h-screen bg-[#030712] p-5 text-white">
      <div className="mx-auto max-w-md">
        <button
          onClick={() => router.push('/owner/dashboard')}
          className="print:hidden mb-6 rounded-2xl bg-white px-4 py-3 text-sm font-black text-black"
        >
          Back
        </button>

        <div className="qr-poster relative overflow-hidden rounded-[42px] border border-white/10 bg-[#080d18] p-6 text-center shadow-2xl">
          <div className="absolute left-[-100px] top-[-100px] h-60 w-60 rounded-full bg-lime-300/20 blur-3xl" />

          <div className="absolute bottom-[-120px] right-[-120px] h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative z-10">
            <h1
              className="text-5xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-cyan-300"
              style={{ fontFamily: 'cursive' }}
            >
              Smart Shop QR
            </h1>

            <p className="mt-4 text-xs font-bold uppercase tracking-[0.35em] text-white/70">
              Shop Smart • Earn Rewards • Save More
            </p>

            <div className="mt-8">
              <p className="text-2xl font-black uppercase">
                Scan To Get
              </p>

              <p className="text-5xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-cyan-300">
                Rewards
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-3xl border border-lime-300/40 bg-white/5 p-4">
                <Gift className="mx-auto h-7 w-7 text-lime-300" />
                <p className="mt-3 text-xs font-black uppercase">
                  Exciting Offers
                </p>
              </div>

              <div className="rounded-3xl border border-cyan-300/40 bg-white/5 p-4">
                <Star className="mx-auto h-7 w-7 text-cyan-300" />
                <p className="mt-3 text-xs font-black uppercase">
                  Earn Points
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <div className="rounded-[38px] bg-white p-6 shadow-[0_0_60px_rgba(163,230,53,0.25)]">
                <QRCodeCanvas
                  value={shopUrl}
                  size={230}
                  includeMargin
                />
              </div>
            </div>

            <div className="mt-7 rounded-full bg-gradient-to-r from-lime-300 to-cyan-300 px-6 py-3 text-sm font-black uppercase text-black">
              Every Scan • Every Spend • Every Reward
            </div>

            <p
              className="mt-6 text-4xl text-lime-300"
              style={{ fontFamily: 'cursive' }}
            >
              Thank you for supporting local!
            </p>

            <p className="mt-4 text-2xl font-black">
              {shop.shop_name}
            </p>

            <div className="mt-8 grid grid-cols-4 gap-3 rounded-[32px] border border-white/10 bg-white/5 p-4">
              <div>
                <Smile className="mx-auto h-6 w-6 text-lime-300" />
                <p className="mt-2 text-[10px] font-black uppercase">
                  Easy
                </p>
              </div>

              <div>
                <Gift className="mx-auto h-6 w-6 text-yellow-300" />
                <p className="mt-2 text-[10px] font-black uppercase">
                  Rewards
                </p>
              </div>

              <div>
                <Shield className="mx-auto h-6 w-6 text-cyan-300" />
                <p className="mt-2 text-[10px] font-black uppercase">
                  Trusted
                </p>
              </div>

              <div>
                <Heart className="mx-auto h-6 w-6 text-pink-400" />
                <p className="mt-2 text-[10px] font-black uppercase">
                  Value
                </p>
              </div>
            </div>

            <div className="print:hidden mt-8 grid grid-cols-2 gap-3">
              <button
                onClick={printQr}
                className="rounded-3xl bg-lime-300 p-4 font-black text-black"
              >
                <div className="flex items-center justify-center gap-2">
                  <Printer className="h-5 w-5" />
                  Print QR
                </div>
              </button>

              <button
                onClick={() => window.open(shopUrl, '_blank')}
                className="rounded-3xl bg-white p-4 font-black text-black"
              >
                <div className="flex items-center justify-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Open Page
                </div>
              </button>
            </div>

            <p className="mt-6 text-xs text-white/40">
              Scan • Earn • Redeem • Repeat
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 6mm;
          }

          html,
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body * {
            visibility: hidden;
          }

          .qr-poster,
          .qr-poster * {
            visibility: visible;
          }

          .qr-poster {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 190mm;
            min-height: auto;
            margin: 0 auto;
            border: none !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            transform: scale(0.92);
            transform-origin: top center;
          }

          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </main>
  )
}