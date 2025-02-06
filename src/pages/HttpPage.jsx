import React from 'react'
import SensorTracker from '../components/SensorTracker'
import LocationHttp from '../components/LocationHttp'

const HttpPage = () => {
  return (
    <div class="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
      <LocationHttp />
    </div>
  )
}

export default HttpPage
