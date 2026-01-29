'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiBriefcase, 
  FiCalendar, 
  FiDollarSign, 
  FiTrendingUp, 
  FiUserPlus,
  FiMenu,
  FiBell,
  FiSearch,
  FiChevronRight,
  FiCheckCircle,
  FiClock,
  FiXCircle
} from 'react-icons/fi';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthStore();
  const router = useRouter();
  const name = user?.name.toUpperCase().split(' ')[0];
  const email = user?.email;

  useEffect(() => {
    if(!user) {
    router.push('/login');
  }
  }, [user, router]);
  // Data statistik
  const statsData = [
    { 
      id: 1, 
      title: 'Total Karyawan', 
      value: '48', 
      change: '+12%', 
      icon: <FiUsers className="h-6 w-6" />,
      color: 'bg-blue-500',
      detail: 'Dari target 50 karyawan'
    },
    { 
      id: 2, 
      title: 'Departemen', 
      value: '6', 
      change: '+2', 
      icon: <FiBriefcase className="h-6 w-6" />,
      color: 'bg-green-500',
      detail: 'IT, HR, Finance, Marketing, Operations, Sales'
    },
    { 
      id: 3, 
      title: 'Absensi Hari Ini', 
      value: '92%', 
      change: '+5%', 
      icon: <FiCalendar className="h-6 w-6" />,
      color: 'bg-purple-500',
      detail: '44 dari 48 karyawan hadir'
    },
    { 
      id: 4, 
      title: 'Total Gaji Bulan Ini', 
      value: 'Rp 450jt', 
      change: '+8%', 
      icon: <FiDollarSign className="h-6 w-6" />,
      color: 'bg-yellow-500',
      detail: 'Rata-rata Rp 9,3jt per karyawan'
    },
  ];

  // Data untuk chart absensi bulanan
  const attendanceData = [
    { month: 'Jan', hadir: 45, tidakHadir: 3 },
    { month: 'Feb', hadir: 42, tidakHadir: 6 },
    { month: 'Mar', hadir: 44, tidakHadir: 4 },
    { month: 'Apr', hadir: 46, tidakHadir: 2 },
    { month: 'Mei', hadir: 47, tidakHadir: 1 },
    { month: 'Jun', hadir: 45, tidakHadir: 3 },
  ];

  // Data untuk pie chart departemen
  const departmentData = [
    { name: 'IT', value: 12, color: '#3B82F6' },
    { name: 'HR', value: 8, color: '#10B981' },
    { name: 'Finance', value: 10, color: '#8B5CF6' },
    { name: 'Marketing', value: 9, color: '#F59E0B' },
    { name: 'Operations', value: 5, color: '#EF4444' },
    { name: 'Sales', value: 4, color: '#EC4899' },
  ];

  // Data karyawan terbaru
  const newEmployees = [
    {
      id: 1,
      name: 'Ahmad Santoso',
      position: 'Frontend Developer',
      department: 'IT',
      joinDate: '15 Jun 2024',
      avatarColor: 'bg-blue-100 text-blue-600'
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      position: 'HR Specialist',
      department: 'HR',
      joinDate: '10 Jun 2024',
      avatarColor: 'bg-green-100 text-green-600'
    },
    {
      id: 3,
      name: 'Budi Pratama',
      position: 'Account Manager',
      department: 'Finance',
      joinDate: '5 Jun 2024',
      avatarColor: 'bg-purple-100 text-purple-600'
    },
    {
      id: 4,
      name: 'Dewi Anggraini',
      position: 'Marketing Lead',
      department: 'Marketing',
      joinDate: '1 Jun 2024',
      avatarColor: 'bg-yellow-100 text-yellow-600'
    },
  ];

  // Data absensi hari ini
  const todayAttendance = [
    { id: 1, name: 'John Doe', status: 'Hadir', time: '08:00', department: 'IT' },
    { id: 2, name: 'Jane Smith', status: 'Terlambat', time: '09:15', department: 'HR' },
    { id: 3, name: 'Bob Johnson', status: 'Hadir', time: '08:05', department: 'Finance' },
    { id: 4, name: 'Alice Brown', status: 'Izin', time: '-', department: 'Marketing' },
    { id: 5, name: 'Charlie Wilson', status: 'Hadir', time: '07:55', department: 'IT' },
  ];

  // Data penggajian bulan ini
  const payrollData = [
    { id: 1, name: 'John Doe', department: 'IT', salary: 'Rp 12.500.000', status: 'Paid' },
    { id: 2, name: 'Jane Smith', department: 'HR', salary: 'Rp 9.800.000', status: 'Paid' },
    { id: 3, name: 'Bob Johnson', department: 'Finance', salary: 'Rp 11.200.000', status: 'Pending' },
    { id: 4, name: 'Alice Brown', department: 'Marketing', salary: 'Rp 10.500.000', status: 'Paid' },
  ];

  useEffect(() => {
    // Simulasi loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 lg:hidden">
                <FiMenu className="h-6 w-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600">Selamat datang kembali! Berikut ringkasan data perusahaan.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative hidden lg:block">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Cari karyawan, departemen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <FiBell className="h-6 w-6 text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-blue-600">A</span>
                </div>
                <div className="hidden md:block">
                  <p className="font-medium text-gray-800">{name || 'Admin'}</p>
                  <p className="text-sm text-gray-500">{email || 'email.com'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {['Overview', 'Karyawan', 'Departemen', 'Absensi', 'Penggajian'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`py-2 px-1 border-b-2 text-sm font-medium transition-colors ${
                    activeTab === tab.toLowerCase()
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat) => (
            <div 
              key={stat.id} 
              className="bg-white rounded-xl shadow-sm border p-6 transition-transform hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                  {stat.icon}
                </div>
                <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-sm">
                  <FiTrendingUp className="h-4 w-4" />
                  <span>{stat.change}</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600 mb-2">{stat.title}</p>
              <p className="text-sm text-gray-500">{stat.detail}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Attendance Chart */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Statistik Absensi Bulanan</h3>
              <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>6 Bulan Terakhir</option>
                <option>1 Tahun Terakhir</option>
              </select>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hadir" name="Hadir" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="tidakHadir" name="Tidak Hadir" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Distribution */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Distribusi Karyawan per Departemen</h3>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {departmentData.map((dept) => (
                <div key={dept.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: dept.color }}></div>
                  <span className="text-sm text-gray-600">{dept.name}</span>
                  <span className="text-sm font-medium ml-auto">{dept.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Karyawan Terbaru */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Karyawan Terbaru</h3>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                <span>Lihat Semua</span>
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>
            
            {newEmployees.length > 0 ? (
              <div className="space-y-4">
                {newEmployees.map((employee) => (
                  <div key={employee.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${employee.avatarColor}`}>
                      <span className="font-semibold">{employee.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{employee.name}</h4>
                      <p className="text-sm text-gray-600">{employee.position}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{employee.joinDate}</p>
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                        {employee.department}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2">Belum ada karyawan terdaftar</p>
                <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <FiUserPlus className="h-4 w-4" />
                  Tambah Karyawan Pertama
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            {/* Today Attendance */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Absensi Hari Ini</h3>
              <div className="space-y-3">
                {todayAttendance.map((att) => (
                  <div key={att.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <div className={`p-1 rounded ${
                        att.status === 'Hadir' ? 'bg-green-100 text-green-600' :
                        att.status === 'Terlambat' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {att.status === 'Hadir' ? <FiCheckCircle className="h-4 w-4" /> :
                         att.status === 'Terlambat' ? <FiClock className="h-4 w-4" /> :
                         <FiXCircle className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{att.name}</p>
                        <p className="text-xs text-gray-500">{att.department}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${
                      att.status === 'Hadir' ? 'text-green-600' :
                      att.status === 'Terlambat' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {att.time}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-center text-blue-600 hover:text-blue-700 text-sm font-medium py-2 border-t">
                Lihat Detail Absensi
              </button>
            </div>

            {/* Payroll Status */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Penggajian</h3>
              <div className="space-y-3">
                {payrollData.map((payroll) => (
                  <div key={payroll.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{payroll.name}</p>
                      <p className="text-xs text-gray-500">{payroll.department}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800 text-sm">{payroll.salary}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded ${
                        payroll.status === 'Paid' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {payroll.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Gaji Bulan Ini:</span>
                  <span className="font-semibold text-gray-800">Rp 450.000.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}