import Link from 'next/link'

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#050711] p-6 text-white">
      <div className="mx-auto max-w-md pt-20">
        <h1 className="text-3xl font-black">Smart Shop Admin</h1>
        <p className="mt-2 text-white/60">Manage shops and QR links</p>

        <Link
          href="/admin/shops/new"
          className="mt-8 block rounded-3xl bg-lime-300 p-4 text-center font-black text-black"
        >
          Add New Shop
        </Link>
      </div>
    </main>
  )
}