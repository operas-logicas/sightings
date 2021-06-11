export default function formatCoords
  (latitude: number, longitude: number): [number, number] {
    latitude = +latitude.toFixed(6)
    longitude = +longitude.toFixed(6)
    return [latitude, longitude]
  }
