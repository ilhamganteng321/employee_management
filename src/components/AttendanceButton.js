'use client'

import { useState } from 'react'
import { ATTENDANCE_TYPES } from '@/utils/constants'
import { useToast } from '@/hooks/useToast'

export default function AttendanceButton({ 
  type, 
  employeeId, 
  location, 
  onSuccess,
  disabled 
}) {
  const [loading, setLoading] = useState(false)
  const [lastAttendance, setLastAttendance] = useState(null)
  const { success, error } = useToast();

  const config = {
    [ATTENDANCE_TYPES.CHECKIN]: {
      label: 'Check In',
      endpoint: '/api/attendance/checkin',
      successMsg: 'Berhasil check-in',
      errorMsg: 'Gagal check-in',
      color: 'bg-blue-600 hover:bg-blue-700',
      icon: '🟢'
    },
    [ATTENDANCE_TYPES.CHECKOUT]: {
      label: 'Check Out',
      endpoint: '/api/attendance/checkout',
      successMsg: 'Berhasil check-out',
      errorMsg: 'Gagal check-out',
      color: 'bg-green-600 hover:bg-green-700',
      icon: '🔴'
    }
  }

  const currentConfig = config[type]

  const handleAttendance = async () => {
    if (!location) {
      error('Lokasi belum terdeteksi')
      return
    }

    if (!employeeId) {
      error('Employee ID tidak ditemukan')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(currentConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          employeeId,
          latitude: location.latitude,
          longitude: location.longitude
          // Note: coordinates dikirim tapi tidak disimpan ke DB sesuai permintaan
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || currentConfig.errorMsg)
      }

      setLastAttendance({
        time: new Date(),
        type,
        isLate: data.isLate,
        workMinutes: data.workMinutes
      })

      success(currentConfig.successMsg)
      
      if (onSuccess) {
        onSuccess(data)
      }
    } catch (error) {
      console.error('Attendance error:', error)
      error(error.message || currentConfig.errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <button
        onClick={handleAttendance}
        disabled={disabled || loading || !location}
        className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg
          ${currentConfig.color}
          ${(disabled || !location) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] transition-transform'}
          flex items-center justify-center gap-3`}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            <span>Memproses...</span>
          </>
        ) : (
          <>
            <span className="text-2xl">{currentConfig.icon}</span>
            <span>{currentConfig.label}</span>
          </>
        )}
      </button>

      {lastAttendance && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Terakhir {type === ATTENDANCE_TYPES.CHECKIN ? 'check-in' : 'check-out'}:
          </p>
          <p className="font-semibold">
            {lastAttendance.time.toLocaleTimeString('id-ID')}
          </p>
          {lastAttendance.isLate !== undefined && lastAttendance.isLate && (
            <p className="text-amber-600 text-sm">⏰ Telat</p>
          )}
          {lastAttendance.workMinutes && (
            <p className="text-green-600 text-sm">
              ⏱️ {Math.floor(lastAttendance.workMinutes / 60)} jam {lastAttendance.workMinutes % 60} menit
            </p>
          )}
        </div>
      )}
    </div>
  )
}