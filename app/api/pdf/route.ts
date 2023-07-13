import { NextResponse } from 'next/server'
import cloudinary from 'cloudinary'

// @ts-ignore
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

export async function POST(req: Request) {
  const data = await req.formData()
  const image = data.get('image')
  let detectedText = 'Failed to detect text'
  await cloudinary.v2.uploader.upload(
    // @ts-ignore
    image,
    { ocr: 'adv_ocr' },
    (error, result) => {
      if (error) return NextResponse.json({ error: 'ERROR IN SERVER' })

      const { textAnnotations } = result!.info.ocr.adv_ocr.data[0]

      const extractedText = textAnnotations
        .map((anno, i) => i > 0 && anno.description.replace(/[^0-9a-z]/gi, ''))
        .filter(entry => typeof entry === 'string')
        .join(' ')

      detectedText = extractedText
    }
  )
  return NextResponse.json({ data: detectedText }, { status: 200 })
}
