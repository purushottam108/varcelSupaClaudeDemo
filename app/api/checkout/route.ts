import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const { productId } = await req.json()

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single()

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: product.name },
          unit_amount: product.price_cents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.nextUrl.origin}/buy/${productId}`,
    metadata: { productId: product.id },
  })

  return NextResponse.json({ url: session.url })
}
