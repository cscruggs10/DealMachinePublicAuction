import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/**
 * Extract frame URLs from a Cloudinary video at different timestamps
 */
function getVideoFrames(videoUrl: string): string[] {
  if (!videoUrl || !videoUrl.includes('cloudinary.com')) {
    return []
  }

  // Extract frames at 0s, 3s, 6s, 9s, 12s for a comprehensive view
  const timestamps = [0, 3, 6, 9, 12]

  return timestamps.map((seconds) =>
    videoUrl.replace(
      '/video/upload/',
      `/video/upload/so_${seconds},w_800,h_600,c_fill,f_jpg,q_90/`
    )
  )
}

/**
 * Fetch image and convert to base64
 */
async function imageUrlToBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url)
    if (!response.ok) return null

    const arrayBuffer = await response.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    return base64
  } catch (error) {
    console.error('Error fetching image:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { videoUrl, vehicleInfo } = await request.json()

    if (!videoUrl) {
      return NextResponse.json({ error: 'Video URL is required' }, { status: 400 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'AI analysis is not configured' },
        { status: 500 }
      )
    }

    // Get frame URLs from the video
    const frameUrls = getVideoFrames(videoUrl)

    if (frameUrls.length === 0) {
      return NextResponse.json(
        { error: 'Invalid video URL' },
        { status: 400 }
      )
    }

    // Fetch and convert frames to base64
    const framePromises = frameUrls.map((url) => imageUrlToBase64(url))
    const base64Frames = await Promise.all(framePromises)
    const validFrames = base64Frames.filter((frame): frame is string => frame !== null)

    if (validFrames.length === 0) {
      return NextResponse.json(
        { error: 'Could not extract frames from video' },
        { status: 400 }
      )
    }

    // Build the message content with images
    const imageContent: Anthropic.ImageBlockParam[] = validFrames.map((base64) => ({
      type: 'image',
      source: {
        type: 'base64',
        media_type: 'image/jpeg',
        data: base64,
      },
    }))

    const vehicleDesc = vehicleInfo
      ? `Vehicle: ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}${vehicleInfo.trim ? ` ${vehicleInfo.trim}` : ''}`
      : 'Vehicle details not provided'

    // Call Claude Vision API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            ...imageContent,
            {
              type: 'text',
              text: `You are a professional vehicle inspector analyzing a video walkthrough of a vehicle for a wholesale auction listing.

${vehicleDesc}

Please analyze these frames from the vehicle video and provide a detailed condition disclosure. Focus on:

1. **Exterior Condition**: Note any visible damage, dents, scratches, rust, paint issues, or body imperfections
2. **Interior Condition**: Assess seat wear, dashboard condition, carpet/floor mats, headliner, and overall cleanliness
3. **Tires & Wheels**: Note tire tread depth (if visible), wheel condition, any curb rash or damage
4. **Glass**: Check for chips, cracks, or damage to windshield and windows
5. **Lights**: Note condition of headlights, taillights, and any lens cloudiness
6. **Overall Assessment**: Provide an honest overall condition rating (Excellent, Good, Fair, Poor)

Be specific about locations (front left fender, rear bumper, etc.) when noting issues. Be honest and thorough - this is for buyer disclosure purposes.

Format your response as a clear, professional disclosure statement suitable for an auction listing.`,
            },
          ],
        },
      ],
    })

    // Extract the text response
    const textContent = message.content.find((block) => block.type === 'text')
    const analysis = textContent && 'text' in textContent ? textContent.text : 'Unable to analyze video'

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('AI analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze video' },
      { status: 500 }
    )
  }
}
