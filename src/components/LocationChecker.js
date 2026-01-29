'use client'

import { useState, useEffect } from 'react'
import { LocationService } from '@/utils/locations'
import { OFFICE_LOCATION } from '@/utils/constants'
import { useToast } from '@/hooks/useToast'

export default function LocationChecker({ onLocationVerified, disabled }) {
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorLoc, setError] = useState(null)
  const [distance, setDistance] = useState(null)
  const { success, error } = useToast();


  const locationService = new LocationService(OFFICE_LOCATION, OFFICE_LOCATION.radius)

  useEffect(() => {
    checkLocation()
  }, [])

  const checkLocation = async () => {
    try {
      setLoading(true)
      const currentLocation = await LocationService.getCurrentLocation()
      setLocation(currentLocation)

      const result = locationService.isWithinRadius(currentLocation)
      setDistance(result.distance)

      if (result.isWithin) {
        onLocationVerified(currentLocation)
        success(`Lokasi valid (${LocationService.formatDistance(result.distance)} dari kantor)`)
      } else {
        error(`Anda berada ${LocationService.formatDistance(result.distance)} dari kantor`)
        setError('Di luar area kantor')
      }
    } catch (err) {
      console.error('Location error:', err)
      setError(err.message)
      error('Gagal mendapatkan lokasi')
    } finally {
      setLoading(false)
    }
  }

  const refreshLocation = async () => {
    await checkLocation()
  }

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
          <p className="text-blue-700">Mendeteksi lokasi...</p>
        </div>
      </div>
    )
  }

  if (errorLoc) {
    return (
      <div className="p-4 bg-red-50 rounded-lg mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-700 font-semibold">Lokasi tidak valid</p>
            <p className="text-red-600 text-sm mt-1">{errorLoc}</p>
            {distance && (
              <p className="text-red-600 text-sm">
                Jarak: {LocationService.formatDistance(distance)}
              </p>
            )}
          </div>
          <button
            onClick={refreshLocation}
            className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
            disabled={disabled}
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-green-50 rounded-lg mb-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-green-700 font-semibold">Lokasi valid ✓</p>
          <p className="text-green-600 text-sm mt-1">
            Anda berada dalam radius {OFFICE_LOCATION.radius}m dari kantor
          </p>
          {distance && (
            <p className="text-green-600 text-sm">
              Jarak: {LocationService.formatDistance(distance)}
            </p>
          )}
        </div>
        <button
          onClick={refreshLocation}
          className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200"
          disabled={disabled}
        >
          Refresh
        </button>
      </div>
    </div>
  )
}