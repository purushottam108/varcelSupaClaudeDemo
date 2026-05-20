import { supabaseServer } from '@/lib/supabase-server'
import Link from 'next/link'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }>
}) {
  const { session_id } = await searchParams
  const session = await stripe.checkout.sessions.retrieve(session_id)

  const { data: purchase } = await supabaseServer
    .from('purchases')
    .select('*, products(*)')
    .eq('stripe_session_id', session_id)
    .single()

  if (session.payment_status !== 'paid' || !purchase) {
    return (
      <main className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Payment not confirmed yet</h1>
        <p className="text-gray-500">Please wait a moment and refresh.</p>
      </main>
    )
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">You're in!</h1>
      <p className="text-gray-500 mb-8">
        Thanks for purchasing <strong>{purchase.products.name}</strong>.
      </p>
      <a
        href={purchase.products.download_url}
        className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
      >
        Access Your Template
      </a>
      <div className="mt-6">
        <Link href="/" className="text-sm text-gray-400 hover:underline">
          Back to store
        </Link>
      </div>
    </main>
  )
}
