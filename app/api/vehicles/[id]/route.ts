import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { id } = params

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    const updateData: Record<string, unknown> = {}

    // Handle status update
    if (body.status) {
      updateData.status = body.status
    }

    // Handle sale event assignment
    if (body.saleEventId !== undefined) {
      updateData.saleEventId = body.saleEventId || null
    }

    // Handle final sale price (for marking as sold)
    if (body.finalSalePrice !== undefined) {
      updateData.finalSalePrice = body.finalSalePrice
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data: updateData,
      include: { saleEvent: true },
    })

    return NextResponse.json(updatedVehicle)
  } catch (error) {
    console.error('Error updating vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to update vehicle' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
      include: { saleEvent: true },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle' },
      { status: 500 }
    )
  }
}
