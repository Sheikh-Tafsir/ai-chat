import { prisma } from '@/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const data = await prisma.pdfStore.findMany()
  return NextResponse.json({ data }, { status: 200 })
}

export async function POST(req: Request) {
  const data = await req.json()
  const { title, content } = data
  await prisma.pdfStore.create({
    data: {
      title,
      //@ts-ignore
      content
    }
  })

  return NextResponse.json({ msg: 'added successfully' })
}
