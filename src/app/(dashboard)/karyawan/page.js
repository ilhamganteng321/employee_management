'use client';

import { useState, useEffect } from 'react';
import { 
  Search, Plus, Users, Edit2, Trash2, Phone, MapPin, 
  Filter, Download, Eye, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import Dialog from '@/components/dialog/Dialog';
import { FiHome } from 'react-icons/fi';
import { useAuthStore } from '@/store/useAuthStore';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { user } = useAuthStore();
  
  const { success, error } = useToast();

  const [form, setForm] = useState({
    userId: '',
    departmentId: '',
    positionId: '',
    phone: '',
    address: '',
  });

  // Fetch semua data
  useEffect(() => {
    fetchAllData();
  }, []);

  

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Fetch users untuk dropdown
      const usersRes = await fetch('/api/users');
      const usersData = await usersRes.json();
      setUsers(usersData);

      // Fetch employees
      const employeesRes = await fetch('/api/karyawan');
      const employeesData = await employeesRes.json();
      setEmployees(employeesData);

      // Fetch departments untuk filter
      const deptRes = await fetch('/api/departemen');
      const deptData = await deptRes.json();
      setDepartments(deptData);

      // Fetch positions
      const posRes = await fetch('/api/position');
      const posData = await posRes.json();
      setPositions(posData);
    } catch (err) {
      error('Gagal memuat data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get user info by userId
  const getUserInfo = (userId) => {
    return users.find(user => user.id === userId) || {};
  };

  // Get department name by ID
  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => d.id === deptId);
    return dept?.name || 'Tidak ada';
  };

  // Get position name by ID
  const getPositionName = (posId) => {
    const pos = positions.find(p => p.id === posId);
    return pos?.name || 'Tidak ada';
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    // Validasi
    if (!form.userId) {
      error('Pilih user terlebih dahulu');
      return;
    }

    if (!form.phone.trim()) {
      error('Nomor telepon tidak boleh kosong');
      return;
    }

    try {
      const url = editingEmployee 
        ? `/api/karyawan/${editingEmployee.id}`
        : '/api/karyawan';
      
      const method = editingEmployee ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        success(
          editingEmployee 
            ? 'Data karyawan berhasil diperbarui'
            : 'Karyawan berhasil ditambahkan'
        );
        
        setShowAddModal(false);
        resetForm();
        fetchAllData();
      } else {
        throw new Error('Gagal menyimpan');
      }
    } catch (err) {
      error('Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setForm({
      userId: employee.userId,
      departmentId: employee.departmentId || '',
      positionId: employee.positionId || '',
      phone: employee.phone || '',
      address: employee.address || '',
    });
    setShowAddModal(true);
  };

  const handleDelete = async (employeeId) => {
    try {
      const response = await fetch(`/api/karyawan/${employeeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        success('Karyawan berhasil dihapus');
        fetchAllData();
        setShowDeleteModal(false);
      } else {
        throw new Error('Gagal menghapus');
      }
    } catch (err) {
      error('Terjadi kesalahan saat menghapus');
    }
  };

  const resetForm = () => {
    setForm({
      userId: '',
      departmentId: '',
      positionId: '',
      phone: '',
      address: '',
    });
    setEditingEmployee(null);
  };

  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const user = getUserInfo(employee.userId);
    const deptName = getDepartmentName(employee.departmentId);
    const posName = getPositionName(employee.positionId);
    
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.phone?.includes(searchQuery);

    const matchesDepartment = 
      departmentFilter === 'all' || 
      employee.departmentId === departmentFilter;

    const matchesStatus = 
      statusFilter === 'all' || 
      user.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  // Get available users (yang belum memiliki employee record)
  const getAvailableUsers = () => {
    const employeeUserIds = employees.map(emp => emp.userId);
    return users.filter(user => 
      !employeeUserIds.includes(user.id) || 
      (editingEmployee && user.id === editingEmployee.userId)
    );
  };

  if(user?.role === 'employe'){
      return (
        <div className="flex flex-col items-center justify-center h-full py-20">
          <FiHome className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Akses Ditolak</h2>
          <p className="text-gray-600">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Data Karyawan
              </h1>
              <p className="text-gray-600 mt-1">
                Kelola semua data karyawan perusahaan
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2.5 border border-gray-300 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
                <Download size={18} />
                Export
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
              >
                <Plus size={20} />
                Tambah Karyawan
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, email, atau telepon..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white cursor-pointer"
            >
              <option value="all">Semua Departemen</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Karyawan</p>
                <p className="text-2xl font-bold mt-1">{employees.length}</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Users className="text-indigo-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktif</p>
                <p className="text-2xl font-bold mt-1">
                  {employees.filter(emp => {
                    const user = getUserInfo(emp.userId);
                    return user.status === 'active';
                  }).length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Departemen</p>
                <p className="text-2xl font-bold mt-1">{departments.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Filter className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-12">
              <Users size={64} strokeWidth={1.5} className="mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-500 mb-2">
                {searchQuery ? 'Tidak ada hasil pencarian' : 'Belum ada data karyawan'}
              </p>
              <p className="text-gray-400">
                {searchQuery 
                  ? 'Coba dengan kata kunci lain' 
                  : 'Mulai dengan menambahkan karyawan baru'
                }
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Karyawan</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Kontak</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Departemen</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Jabatan</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEmployees.map(employee => {
                      const user = getUserInfo(employee.userId);
                      const deptName = getDepartmentName(employee.departmentId);
                      const posName = getPositionName(employee.positionId);
                      
                      return (
                        <tr
                          key={employee.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                <span className="text-indigo-600 font-semibold text-lg">
                                  {user.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="py-4 px-6">
                            <div className="space-y-1">
                              {employee.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone size={14} className="text-gray-400" />
                                  <span className="text-gray-700">{employee.phone}</span>
                                </div>
                              )}
                              {employee.address && (
                                <div className="flex items-start gap-2 text-sm">
                                  <MapPin size={14} className="text-gray-400 mt-0.5" />
                                  <span className="text-gray-500 line-clamp-1">{employee.address}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          
                          <td className="py-4 px-6">
                            <span className="inline-flex px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                              {deptName}
                            </span>
                          </td>
                          
                          <td className="py-4 px-6">
                            <span className="text-gray-700">{posName}</span>
                          </td>
                          
                          <td className="py-4 px-6">
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                              user.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {user.status === 'active' ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </td>
                          
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleEdit(employee)}
                                className="p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingEmployee(employee);
                                  setShowDeleteModal(true);
                                }}
                                className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                                title="Hapus"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                  <div className="text-sm text-gray-700">
                    Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredEmployees.length)} dari {filteredEmployees.length}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium ${
                            currentPage === pageNum
                              ? 'bg-indigo-600 text-white'
                              : 'border hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        action={handleSubmit}
        title={editingEmployee ? 'Edit Karyawan' : 'Tambah Karyawan'}
        subtitle={
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih User
              </label>
              <select
                value={form.userId}
                onChange={(e) => setForm({ ...form, userId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                required
                disabled={!!editingEmployee}
              >
                <option value="">Pilih user...</option>
                {getAvailableUsers().map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email}) - {user.role}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {editingEmployee 
                  ? 'User tidak dapat diubah setelah dibuat'
                  : 'Hanya user yang belum memiliki data karyawan'
                }
              </p>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departemen
              </label>
              <select
                value={form.departmentId}
                onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="">Pilih departemen...</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posisi
              </label>
              <select
                value={form.positionId}
                onChange={(e) => setForm({ ...form, positionId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="">Pilih posisi...</option>
                {positions.map(pos => (
                  <option key={pos.id} value={pos.id}>
                    {pos.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Telepon
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="081234567890"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat
              </label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Masukkan alamat lengkap"
                rows="3"
              />
            </div>
          </form>
        }
        type="info"
        actionLabel={editingEmployee ? 'Simpan Perubahan' : 'Tambah Karyawan'}
        cancelLabel="Batal"
        actionOnSubmit={false}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setEditingEmployee(null);
        }}
        action={() => handleDelete(editingEmployee?.id)}
        title="Konfirmasi Hapus"
        subtitle={`Apakah Anda yakin ingin menghapus data karyawan ini?`}
        type="danger"
        actionLabel="Ya, Hapus"
        cancelLabel="Batal"
      />
    </div>
  );
}