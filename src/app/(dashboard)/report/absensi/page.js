"use client"
import { useState, useEffect } from "react"
import {
    Search,
    Download,
    Eye,
    Edit,
    Trash2,
    Users,
    UserCheck,
    Clock,
    UserX
} from "lucide-react"
import Form from "@/components/form/Form"
import { attendanceFields } from "@/utils/constants"

export default function AttendancePage() {
    const [attendanceData, setAttendanceData] = useState([])
    const [loading, setLoading] = useState(true)
    const [employee, setEmployee] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("Semua Status")
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    )
    const [form, setForm] = useState({ fields: attendanceFields });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);


    const handleEdit = (attendance) => {
        setSelectedAttendance(attendance);
        setIsEditMode(true);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            try {
                const res = await fetch(`/api/attendance/${id}`, {
                    method: 'DELETE'
                });

                if (!res.ok) throw new Error('Gagal menghapus data');

                fetchAttendanceData();
            } catch (error) {
                console.error('DELETE ERROR:', error);
                alert('Gagal menghapus data');
            }
        }
    };

    const handleView = (attendance) => {
        // Tampilkan detail atau buka modal view
        alert(`Detail: ${attendance.employeeName} - ${attendance.status}`);
    };

    const handleAdd = () => {
        setSelectedAttendance(null);
        setIsEditMode(false);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (data) => {
        try {
            const url = isEditMode
                ? `/api/attendance/${selectedAttendance.attendanceId}`
                : '/api/attendance';

            const method = isEditMode ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            console.log("data", data)
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Gagal menyimpan data absensi');
            }

            fetchAttendanceData();
            setIsFormOpen(false);
            setSelectedAttendance(null);
            setIsEditMode(false);
        } catch (error) {
            console.error('SUBMIT ATTENDANCE FORM ERROR:', error);
            alert(error.message);
        }
    }

    // page.js - tambahkan useEffect untuk update fields
    useEffect(() => {
        if (employee.length > 0) {
            // Update attendanceFields dengan data karyawan
            const updatedFields = attendanceFields.map(field => {
                if (field.name === 'employeeId') {
                    return {
                        ...field,
                        options: employee.map(emp => ({
                            value: emp.id, // atau emp.employeeId sesuai struktur data
                            label: emp.name || `${emp.firstName} ${emp.lastName}` || emp.userId
                        }))
                    };
                }
                return field;
            });

            // Set form fields dengan data yang sudah diupdate
            setForm({ fields: updatedFields });
        }
    }, [employee]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchAttendanceData()
        fetchEmployeeData();
    }, [])

    const fetchEmployeeData = async () => {
        try {
            const res = await fetch("/api/users");
            if (!res.ok) {
                throw new Error("gagal memuat data")
            }
            const result = await res.json();
            setEmployee(result); // Sesuaikan dengan struktur response
        } catch (err) {
            console.log("error", err)
        }
    }
    const fetchAttendanceData = async () => {
        try {
            const response = await fetch("/api/attendance")
            const result = await response.json()
            setAttendanceData(result.data)
            setLoading(false)
        } catch (error) {
            console.error("Error fetching attendance data:", error)
            setLoading(false)
        }
    }

    // Calculate statistics
    const totalEmployees = attendanceData.length
    const presentToday = attendanceData.filter(
        att =>
            att.status === "present" &&
            att.date === new Date().toISOString().split("T")[0]
    ).length
    const lateToday = attendanceData.filter(
        att => att.isLate && att.date === new Date().toISOString().split("T")[0]
    ).length
    const absentToday = attendanceData.filter(
        att =>
            att.status === "absent" &&
            att.date === new Date().toISOString().split("T")[0]
    ).length

    // Format time
    const formatTime = dateString => {
        if (!dateString) return "-"
        const date = new Date(dateString)
        return date.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    // Format duration
    const formatDuration = minutes => {
        if (!minutes) return "-"
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return `${hours}j${mins}m`
    }

    // Get status badge
    const getStatusBadge = (status, isLate) => {
        if (status === "present" && !isLate) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    • Hadir
                </span>
            )
        }
        if (status === "present" && isLate) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    • Terlambat
                </span>
            )
        }
        if (status === "absent") {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    • Tidak Hadir
                </span>
            )
        }
        return null
    }

    // Get avatar color
    const getAvatarColor = name => {
        const colors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-purple-500",
            "bg-pink-500",
            "bg-indigo-500",
            "bg-cyan-500"
        ]
        const index = name.charCodeAt(0) % colors.length
        return colors[index]
    }

    // Get initials
    const getInitials = name => {
        const parts = name.split(" ")
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase()
        }
        return name.substring(0, 2).toUpperCase()
    }

    // Filter data
    const filteredData = attendanceData.filter(item => {
        const matchesSearch =
            item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.employeeId.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus =
            statusFilter === "Semua Status" ||
            (statusFilter === "Hadir" && item.status === "present" && !item.isLate) ||
            (statusFilter === "Terlambat" && item.isLate) ||
            (statusFilter === "Tidak Hadir" && item.status === "absent")

        return matchesSearch && matchesStatus
    })

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-lg text-gray-600">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Kelola Kehadiran
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Pantau dan kelola absensi karyawan dengan mudah
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                Live Update
                            </button>
                            {/* <button
                                onClick={handleAdd}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                                + Tambah Data
                            </button> */}
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Karyawan</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {totalEmployees}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Hadir Hari Ini</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {presentToday}
                                </p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <UserCheck className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Terlambat</p>
                                <p className="text-3xl font-bold text-yellow-600">
                                    {lateToday}
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-50 rounded-lg">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Tidak Hadir</p>
                                <p className="text-3xl font-bold text-red-600">{absentToday}</p>
                            </div>
                            <div className="p-3 bg-red-50 rounded-lg">
                                <UserX className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan nama atau ID karyawan..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option>Semua Status</option>
                            <option>Hadir</option>
                            <option>Terlambat</option>
                            <option>Tidak Hadir</option>
                        </select>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Karyawan
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Check In
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Check Out
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Durasi Kerja
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Catatan
                                    </th>
                                    {/* <th className="px-6 py-4 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Aksi
                                    </th> */}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredData.map(item => (
                                    <tr
                                        key={item.attendanceId}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-10 h-10 rounded-full ${getAvatarColor(
                                                        item.employeeName
                                                    )} flex items-center justify-center text-white font-medium text-sm`}
                                                >
                                                    {getInitials(item.employeeName)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 w-32 overflow-hidden text-ellipsis whitespace-nowrap">
                                                        {item.employeeName}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {item.positionName}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {new Date(item.date).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric"
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {formatTime(item.checkIn)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {formatTime(item.checkOut)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {formatDuration(item.workMinutes)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(item.status, item.isLate)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {item.isLate && item.status === "present"
                                                ? "Terlambat"
                                                : "-"}
                                        </td>
                                        {/* <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleView(item)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.attendanceId)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Menampilkan 1-10 dari {filteredData.length} data
                            </p>
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                                    &lt;
                                </button>
                                <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg">
                                    1
                                </button>
                                <button className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                                    2
                                </button>
                                <button className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                                    3
                                </button>
                                <span className="px-2 text-gray-600">...</span>
                                <button className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                                    16
                                </button>
                                <button className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                                    &gt;
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isFormOpen && (
                <Form
                    key={selectedAttendance ? selectedAttendance.attendanceId : 'create'}
                    initialData={selectedAttendance || {}}
                    onClose={() => {
                        setIsFormOpen(false);
                        setSelectedAttendance(null);
                        setIsEditMode(false);
                    }}
                    fields={form.fields}
                    title={isEditMode ? "Edit Data Absensi" : "Tambah Data Absensi"}
                    submitText={isEditMode ? "Update" : "Simpan"}
                    cancelText="Batal"
                    onSubmit={handleFormSubmit}
                />
            )}
        </div>
    )
}
