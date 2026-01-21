import { NextRequest, NextResponse } from 'next/server'

interface NHTSAResult {
  Variable: string
  Value: string | null
}

interface NHTSAResponse {
  Results: NHTSAResult[]
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const vin = searchParams.get('vin')

  if (!vin) {
    return NextResponse.json({ error: 'VIN is required' }, { status: 400 })
  }

  if (vin.length !== 17) {
    return NextResponse.json({ error: 'VIN must be 17 characters' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch from NHTSA API')
    }

    const data: NHTSAResponse = await response.json()

    const getValue = (variableName: string): string | null => {
      const result = data.Results.find((r) => r.Variable === variableName)
      return result?.Value || null
    }

    const year = getValue('Model Year')
    const make = getValue('Make')
    const model = getValue('Model')
    const trim = getValue('Trim')

    if (!year || !make || !model) {
      return NextResponse.json(
        { error: 'Could not decode VIN. Please check if the VIN is valid.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      year: parseInt(year),
      make,
      model,
      trim,
    })
  } catch (error) {
    console.error('VIN decode error:', error)
    return NextResponse.json(
      { error: 'Failed to decode VIN' },
      { status: 500 }
    )
  }
}
