// Titik pusat lokasi kantor
export const OFFICE_LOCATION = {
  latitude: -7.227661,  // Ganti dengan latitude kantor
  longitude: 107.82385199999999, // Ganti dengan longitude kantor
  radius: 20, // Radius dalam meter (20m = dalam area)
  maxRadius: 50 // Maksimal radius untuk warning (50m)
}

export const OFFICE_START = "08:00" // Jam masuk kantor
export const ATTENDANCE_TYPES = {
  CHECKIN: 'checkin',
  CHECKOUT: 'checkout'
}

export const attendanceFields = [
  {
    name: 'employeeId',
    label: 'Karyawan',
    type: 'select',
    required: true,
    options: [] // Isi dengan data karyawan dari API
  },
  {
    name: 'date',
    label: 'Tanggal',
    type: 'date',
    required: true
  },
  {
    name: 'checkIn',
    label: 'Waktu Check In',
    type: 'time',
    required: true
  },
  {
    name: 'checkOut',
    label: 'Waktu Check Out',
    type: 'time',
    required: false
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: [
      { value: 'present', label: 'Hadir' },
      { value: 'absent', label: 'Tidak Hadir' }
    ]
  },
  {
    name: 'isLate',
    label: 'Terlambat',
    type: 'checkbox',
    required: false
  },
  {
    name: 'workMinutes',
    label: 'Durasi Kerja (menit)',
    type: 'number',
    required: true,
    validation: { min: 0, max: 1440 }
  }
];