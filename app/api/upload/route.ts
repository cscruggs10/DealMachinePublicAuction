import { NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

// Generate a signed upload signature for direct client-to-Cloudinary upload
export async function GET() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000)

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: 'deal-machine',
      },
      process.env.CLOUDINARY_API_SECRET!
    )

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: 'deal-machine',
    })
  } catch (error) {
    console.error('Signature error:', error)
    return NextResponse.json(
      { error: 'Failed to generate upload signature' },
      { status: 500 }
    )
  }
}
