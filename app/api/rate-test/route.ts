import rateLimit from '@/lib/rate-limit'
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500 // Max 500 users per second
})

export async function GET(_req: NextApiRequest, res: NextApiResponse) {
  const exceeded = limiter.check(res, 10, 'CACHE_TOKEN') // 10 requests per minute
  if (exceeded) {
    return NextResponse.json({ erro: 'Rate Limit Exceeded' })
  }
  return NextResponse.json({ data: 'Access Granted' })
}
