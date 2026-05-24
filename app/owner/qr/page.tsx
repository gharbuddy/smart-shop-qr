'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { QRCodeCanvas } from 'qrcode.react'
import { supabase } from '@/lib/supabase'

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

        <div className="rounded-[32px] border border-white/10 bg-white/10 p-6 text-center shadow-2xl print:border-0 print:bg-white print:text-black print:shadow-none">
          <p className="text-sm text-white/60 print:text-black/60">
            Shop QR Code
          </p>

          <h1 className="mt-2 text-3xl font-black print:text-black">
            {shop?.shop_name}
          </h1>

          <p className="mt-3 break-all text-xs text-white/60 print:text-black/60">
            {qrLink}
          </p>

          <div className="mt-6 inline-block rounded-3xl bg-white p-4">
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

          <p className="mt-5 text-lg font-black print:text-black">
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
            href={qrLink}
            target="_blank"
            className="mt-3 block rounded-3xl bg-white p-4 font-black text-black print:hidden"
          >
            Open Shop Page
          </a>
        </div>
      </div>
    </main>
  )
}