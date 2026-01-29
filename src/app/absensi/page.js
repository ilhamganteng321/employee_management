'use client'

import { useState, useEffect, useCallback } from 'react'
import { ATTENDANCE_TYPES, OFFICE_LOCATION, OFFICE_START } from '@/utils/constants'
import LocationChecker from '@/components/LocationChecker'
import AttendanceButton from '@/components/AttendanceButton'
import AttendanceStatus from '@/components/AttendanceStatus'
import { useToast } from '@/hooks/useToast'
import { useAuthStore } from '@/store/useAuthStore'

export default function AttendancePage() {
  const { success, error } = useToast()
  const { user } = useAuthStore()

  const [time, setTime] = useState('')
  const [currentLocation, setCurrentLocation] = useState(null)

  const [employee, setEmployee] = useState(null)
  const [hasCheckedIn, setHasCheckedIn] = useState(false)
  const [hasCheckedOut, setHasCheckedOut] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  /* =======================
     FETCH EMPLOYEE
  ======================== */
  const fetchEmployee = useCallback(async () => {
    if (!user?.id) return

    try {
      const res = await fetch(`/api/karyawan/${user.id}`)
      if (!res.ok) throw new Error('Gagal ambil data karyawan')

      const data = await res.json()
      setEmployee(data)
    } catch (err) {
      console.error(err)
      // error('Gagal mengambil data karyawan')
    }
  }, [user])

  /* =======================
     FETCH ATTENDANCE STATUS
  ======================== */
 const fetchAttendanceStatus = useCallback(async () => {
  if (!employee?.id) return

  try {
    const [checkInRes, checkOutRes] = await Promise.all([
      fetch(`/api/attendance/checkin?employeeId=${employee.id}&date=${today}`),
      fetch(`/api/attendance/checkout?employeeId=${employee.id}&date=${today}`)
    ])

    // CHECK-IN
    // 200 = belum check-in
    // 400 = sudah check-in
    setHasCheckedIn(!checkInRes.ok)

    // CHECK-OUT
    // 200 = belum check-out
    // 400 = sudah check-out
    setHasCheckedOut(!checkOutRes.ok)

  } catch (err) {
    console.error(err)
  }
}, [employee, today])


  /* =======================
     EFFECTS
  ======================== */
  useEffect(() => {
    fetchEmployee()
    setTime(new Date().toLocaleTimeString('id-ID'))
  }, [fetchEmployee])

  useEffect(() => {
    fetchAttendanceStatus()
  }, [fetchAttendanceStatus])

  /* =======================
     HANDLERS
  ======================== */
  const handleLocationVerified = (location) => {
    setCurrentLocation(location)
  }

  const handleCheckInSuccess = () => {
    success('Berhasil check-in')
    setHasCheckedIn(true)
  }

  const handleCheckOutSuccess = () => {
    success('Berhasil check-out')
    setHasCheckedOut(true)
  }

  if(!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Hanya karyawan yang dapat mengakses halaman ini. Kelola karyawan terlebih dahulu</p>
      </div>
    )
  }

  /* =======================
     RENDER
  ======================== */
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ABSENSI DIGITAL
          </h1>
          <p className="text-gray-600">
            Sistem absensi dengan validasi lokasi
          </p>

          {employee && (
            <div className="mt-4 p-3 bg-white rounded-lg shadow-sm inline-block">
              <p className="text-sm text-gray-500">Karyawan</p>
              <p className="font-bold text-lg">{user?.name}</p>
              <p className="text-xs text-gray-400">ID: {employee.id}</p>
            </div>
          )}
        </div>

        {/* Location */}
        <LocationChecker
          onLocationVerified={handleLocationVerified}
          disabled={hasCheckedOut}
        />

        {/* Status */}
        <div className="mb-6">
          <AttendanceStatus employeeId={employee?.id} />
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          {/* CHECK IN */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-center">Check In</h3>

            <AttendanceButton
              type={ATTENDANCE_TYPES.CHECKIN}
              employeeId={employee?.id}
              location={currentLocation}
              onSuccess={handleCheckInSuccess}
              disabled={hasCheckedIn || hasCheckedOut}
            />

            <p className="text-sm text-gray-500 text-center mt-3">
              {hasCheckedIn ? '✓ Sudah check-in hari ini' : 'Belum check-in'}
            </p>
          </div>

          {/* CHECK OUT */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-center">Check Out</h3>

            <AttendanceButton
              type={ATTENDANCE_TYPES.CHECKOUT}
              employeeId={employee?.id}
              location={currentLocation}
              onSuccess={handleCheckOutSuccess}
              disabled={!hasCheckedIn || hasCheckedOut}
            />

            <p className="text-sm text-gray-500 text-center mt-3">
              {hasCheckedOut
                ? '✓ Sudah check-out hari ini'
                : 'Harus check-in terlebih dahulu'}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Informasi:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Radius absensi {OFFICE_LOCATION.radius}m</li>
            <li>• GPS & Internet wajib aktif</li>
            <li>• Check-in 1x per hari</li>
            <li>• Check-out setelah check-in</li>
            <li>• Jam masuk: {OFFICE_START} WIB</li>
          </ul>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          Terakhir diperbarui: {time}
        </div>
      </div>
    </div>
  )
}
