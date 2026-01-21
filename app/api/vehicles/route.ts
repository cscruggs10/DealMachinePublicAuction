import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(vehicles)
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { vin, year, make, model, trim, status, aiDisclosures, videoUrl, price } = body

    if (!vin || !year || !make || !model) {
      return NextResponse.json(
        { error: 'VIN, year, make, and model are required' },
        { status: 400 }
      )
    }

    const existingVehicle = await prisma.vehicle.findUnique({
      where: { vin },
    })

    if (existingVehicle) {
      return NextResponse.json(
        { error: 'A vehicle with this VIN already exists' },
        { status: 409 }
      )
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        vin,
        year: parseInt(year),
        make,
        model,
        trim: trim || null,
        status: status || 'DRAFT',
        aiDisclosures: aiDisclosures || null,
        videoUrl: videoUrl || null,
        price: price ? parseFloat(price) : null,
      },
    })

    return NextResponse.json(vehicle, { status: 201 })
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    )
  }
}
