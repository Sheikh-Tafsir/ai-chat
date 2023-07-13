import rateLimit from '@/lib/rate-limit'
import { NextResponse } from 'next/server'

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500 // Max 500 users per second
})

export async function GET(_req: Request) {
  const exceeded = limiter.check(10, 'CACHE_TOKEN') // 10 requests per minute
  if (exceeded) {
    return NextResponse.json({ error: 'Rate Limit Exceeded' })
  }
  return NextResponse.json({ data: 'Access Granted' })
}
