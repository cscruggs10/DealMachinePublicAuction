import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const saleEvents = await prisma.saleEvent.findMany({
      orderBy: { startDate: 'desc' },
    })
    return NextResponse.json(saleEvents)
  } catch (error) {
    console.error('Error fetching sale events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sale events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { title, startDate, endDate, externalLink, status } = body

    if (!title || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Title, start date, and end date are required' },
        { status: 400 }
      )
    }

    const saleEvent = await prisma.saleEvent.create({
      data: {
        title,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        externalLink: externalLink || null,
        status: status || 'UPCOMING',
      },
    })

    return NextResponse.json(saleEvent, { status: 201 })
  } catch (error) {
    console.error('Error creating sale event:', error)
    return NextResponse.json(
      { error: 'Failed to create sale event' },
      { status: 500 }
    )
  }
}
