'use client'

import { useState } from 'react'

export default function CheckoutButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    setLoading(true)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
    >
      {loading ? 'Redirecting...' : 'Buy Now'}
    </button>
  )
}
