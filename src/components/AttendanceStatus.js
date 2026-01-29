'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function AttendanceStatus({ employeeId }) {
  const [todayAttendance, setTodayAttendance] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodayAttendance()
    const interval = setInterval(fetchTodayAttendance, 30000) // Refresh setiap 30 detik
    return () => clearInterval(interval)
  }, [employeeId])

  const fetchTodayAttendance = async () => {
    if (!employeeId) return

    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const response = await fetch(`/api/attendance/today?employeeId=${employeeId}&date=${today}`)
      
      if (response.ok) {
        const data = await response.json()
        setTodayAttendance(data)
      }
    } catch (error) {
      console.error('Error fetching attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    )
  }

  if (!todayAttendance) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg">
        <p className="text-yellow-700">Belum ada absensi hari ini</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-bold text-lg mb-3">Status Absensi Hari Ini</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Tanggal:</span>
          <span className="font-semibold">
            {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id })}
          </span>
        </div>

        {todayAttendance.checkIn && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Check In:</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {format(new Date(todayAttendance.checkIn), 'HH:mm:ss')}
              </span>
              {todayAttendance.isLate && (
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">TELAT</span>
              )}
            </div>
          </div>
        )}

        {todayAttendance.checkOut && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Check Out:</span>
            <span className="font-semibold">
              {format(new Date(todayAttendance.checkOut), 'HH:mm:ss')}
            </span>
          </div>
        )}

        {todayAttendance.workMinutes && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Durasi Kerja:</span>
            <span className="font-semibold text-green-600">
              {Math.floor(todayAttendance.workMinutes / 60)} jam {todayAttendance.workMinutes % 60} menit
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Status:</span>
          <span className={`font-semibold ${
            todayAttendance.status === 'present' ? 'text-green-600' : 'text-gray-600'
          }`}>
            {todayAttendance.status === 'present' ? 'HADIR' : todayAttendance.status?.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  )
}