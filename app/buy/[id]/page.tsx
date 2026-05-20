import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import CheckoutButton from './CheckoutButton'

export default async function BuyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) notFound()

  return (
    <main className="max-w-xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-500 mb-6">{product.description}</p>
      <p className="text-3xl font-bold mb-8">${(product.price_cents / 100).toFixed(2)}</p>
      <CheckoutButton productId={product.id} />
    </main>
  )
}
