import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function Home() {
  const { data: products } = await supabase.from('products').select('*')

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">TinyStore</h1>
      <p className="text-gray-500 mb-10">Premium Notion templates for builders.</p>

      <div className="grid gap-6">
        {products?.map((product) => (
          <div key={product.id} className="border rounded-xl p-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-500 text-sm mt-1">{product.description}</p>
            </div>
            <div className="ml-6 text-right shrink-0">
              <p className="text-xl font-bold">${(product.price_cents / 100).toFixed(2)}</p>
              <Link
                href={`/buy/${product.id}`}
                className="mt-2 inline-block bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800"
              >
                Buy
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
