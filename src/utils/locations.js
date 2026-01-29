import { getDistance } from 'geolib'

export class LocationService {
  constructor(targetLocation, allowedRadius = 20) {
    this.targetLocation = targetLocation
    this.allowedRadius = allowedRadius
  }

  // Get current location
  static async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation tidak didukung"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  }

  // Check if within radius
  isWithinRadius(currentLocation) {
    const distance = getDistance(this.targetLocation, currentLocation)
    return {
      isWithin: distance <= this.allowedRadius,
      distance,
      accuracy: currentLocation.accuracy || 0
    }
  }

  // Format distance
  static formatDistance(distance) {
    if (distance < 1000) {
      return `${Math.round(distance)}m`
    }
    return `${(distance / 1000).toFixed(1)}km`
  }
}