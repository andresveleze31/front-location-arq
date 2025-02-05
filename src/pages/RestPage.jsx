import React from 'react'
import SensorTracker from '../components/SensorTracker'
import GiroscopioTracker from '../components/GiroscopioTracker'
import GeolocationTracker from '../components/GeolocationTracker'
import AcelerometroTracker from '../components/AcelerometroTracker'

const RestPage = () => {
  return (
    <div class="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
      <SensorTracker />
    </div>
  )
}

export default RestPage
