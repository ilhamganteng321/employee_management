'use client';

import { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import {
    Search, Plus, Users, Edit2, Trash2, Mail, User, Shield,
    CheckCircle, XCircle, Filter, Calendar, Key, ChevronLeft,
    ChevronRight, Eye, Download, MoreVertical, UserPlus,
    Activity, TrendingUp, Settings, Grid, List
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import Dialog from '@/components/dialog/Dialog';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);

    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const { success, error } = useToast();

    // Form state
    const [form, setForm] = useState({
        name: '',
        email: '',
        role: 'employee',
        status: 'active',
        password: '',
        confirmPassword: '',
    });

    // Fetch users
    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchQuery, roleFilter, statusFilter]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/users');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            error('Gagal memuat data pengguna');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = [...users];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
            );
        }

        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => user.role === roleFilter);
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(user => user.status === statusFilter);
        }

        setFilteredUsers(filtered);
        setCurrentPage(1);
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();

        if (!form.name.trim()) {
            error('Nama tidak boleh kosong');
            return;
        }

        if (!form.email.trim()) {
            error('Email tidak boleh kosong');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            error('Format email tidak valid');
            return;
        }

        if (!editingUser) {
            if (!form.password) {
                error('Password tidak boleh kosong');
                return;
            }

            if (form.password.length < 6) {
                error('Password minimal 6 karakter');
                return;
            }

            if (form.password !== form.confirmPassword) {
                error('Konfirmasi password tidak cocok');
                return;
            }
        }

        try {
            const url = editingUser
                ? `/api/users/${editingUser.id}`
                : '/api/users';

            const method = editingUser ? 'PUT' : 'POST';

            const payload = editingUser
                ? {
                    name: form.name,
                    email: form.email,
                    role: form.role,
                    status: form.status,
                }
                : {
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    role: form.role,
                    status: form.status,
                };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                success(
                    editingUser
                        ? 'Pengguna berhasil diperbarui'
                        : 'Pengguna berhasil ditambahkan'
                );

                setShowAddModal(false);
                resetForm();
                fetchUsers();
            } else {
                const data = await response.json();
                throw new Error(data.error || 'Gagal menyimpan');
            }
        } catch (err) {
            error(err.message || 'Terjadi kesalahan saat menyimpan data');
        }
    };

    const handlePasswordReset = async () => {
        if (!form.password) {
            error('Password baru tidak boleh kosong');
            return;
        }

        if (form.password.length < 6) {
            error('Password minimal 6 karakter');
            return;
        }

        if (form.password !== form.confirmPassword) {
            error('Konfirmasi password tidak cocok');
            return;
        }

        try {
            const response = await fetch(`/api/users/${editingUser.id}/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: form.password }),
            });

            if (response.ok) {
                success('Password berhasil direset');
                setShowPasswordModal(false);
                resetForm();
            } else {
                throw new Error('Gagal reset password');
            }
        } catch (err) {
            error('Terjadi kesalahan saat reset password');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/users/${editingUser.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                success('Pengguna berhasil dihapus');
                setShowDeleteModal(false);
                setEditingUser(null);
                fetchUsers();
            } else {
                throw new Error('Gagal menghapus');
            }
        } catch (err) {
            error('Terjadi kesalahan saat menghapus');
        }
    };

    const resetForm = () => {
        setForm({
            name: '',
            email: '',
            role: 'employee',
            status: 'active',
            password: '',
            confirmPassword: '',
        });
        setEditingUser(null);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getRoleDisplay = (role) => {
        const roles = {
            admin: 'Admin',
            hr: 'HR',
            employee: 'Karyawan',
        };
        return roles[role] || role;
    };

    const getRoleColor = (role) => {
        const colors = {
            admin: 'bg-gradient-to-r from-purple-500 to-pink-500',
            hr: 'bg-gradient-to-r from-blue-500 to-cyan-500',
            employee: 'bg-gradient-to-r from-green-500 to-emerald-500',
        };
        return colors[role] || 'bg-gradient-to-r from-gray-500 to-slate-500';
    };

    const getRoleBadgeColor = (role) => {
        const colors = {
            admin: 'bg-purple-50 text-purple-700 border-purple-200',
            hr: 'bg-blue-50 text-blue-700 border-blue-200',
            employee: 'bg-green-50 text-green-700 border-green-200',
        };
        return colors[role] || 'bg-gray-50 text-gray-700 border-gray-200';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Enhanced Header */}
                <div className="mb-8">
                    <div className="flex flex-col gap-6">
                        {/* Title Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-indigo-600 rounded-xl">
                                        <Users className="text-white" size={28} />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            Manajemen Pengguna
                                        </h1>
                                        <p className="text-gray-600 text-sm mt-1">
                                            Kelola semua pengguna sistem HRIS dengan mudah
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl font-medium flex items-center gap-2 hover:shadow-md transition-all duration-300 hover:border-indigo-300">
                                    <Download size={18} />
                                    <span className="hidden sm:inline">Export</span>
                                </button>
                                <button
                                    onClick={() => {
                                        resetForm();
                                        setShowAddModal(true);
                                    }}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    <UserPlus size={20} />
                                    Tambah User
                                </button>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-2xl p-5 border border-indigo-100 hover:shadow-lg transition-all duration-300 hover:border-indigo-300">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                                        <Users className="text-white" size={24} />
                                    </div>
                                    <TrendingUp className="text-green-500" size={20} />
                                </div>
                                <p className="text-sm text-gray-600 font-medium mb-1">Total Pengguna</p>
                                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                            </div>

                            <div className="bg-white rounded-2xl p-5 border border-purple-100 hover:shadow-lg transition-all duration-300 hover:border-purple-300">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                                        <Shield className="text-white" size={24} />
                                    </div>
                                    <Activity className="text-purple-500" size={20} />
                                </div>
                                <p className="text-sm text-gray-600 font-medium mb-1">Admin</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {users.filter(u => u.role === 'admin').length}
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-5 border border-green-100 hover:shadow-lg transition-all duration-300 hover:border-green-300">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                                        <CheckCircle className="text-white" size={24} />
                                    </div>
                                    <Activity className="text-green-500" size={20} />
                                </div>
                                <p className="text-sm text-gray-600 font-medium mb-1">Aktif</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {users.filter(u => u.status === 'active').length}
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-5 border border-red-100 hover:shadow-lg transition-all duration-300 hover:border-red-300">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl shadow-lg">
                                        <XCircle className="text-white" size={24} />
                                    </div>
                                    <Activity className="text-red-500" size={20} />
                                </div>
                                <p className="text-sm text-gray-600 font-medium mb-1">Tidak Aktif</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {users.filter(u => u.status === 'inactive').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        {/* Search */}
                        <div className="flex-1 w-full relative">
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Cari pengguna berdasarkan nama atau email..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex gap-3 w-full lg:w-auto">
                            <select
                                value={roleFilter}
                                onChange={e => setRoleFilter(e.target.value)}
                                className="flex-1 lg:flex-none px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white cursor-pointer transition-all"
                            >
                                <option value="all">Semua Role</option>
                                <option value="admin">Admin</option>
                                <option value="hr">HR</option>
                                <option value="employee">Karyawan</option>
                            </select>

                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="flex-1 lg:flex-none px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white cursor-pointer transition-all"
                            >
                                <option value="all">Semua Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>

                            {/* View Toggle */}
                            <div className="flex bg-gray-100 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all ${
                                        viewMode === 'grid' 
                                            ? 'bg-white shadow-sm text-indigo-600' 
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <Grid size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all ${
                                        viewMode === 'list' 
                                            ? 'bg-white shadow-sm text-indigo-600' 
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <List size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <Users className="text-indigo-600" size={28} />
                            </div>
                        </div>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                        <div className="inline-flex p-6 bg-gray-100 rounded-full mb-4">
                            <Users size={48} strokeWidth={1.5} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            {searchQuery ? 'Tidak ada hasil pencarian' : 'Belum ada data pengguna'}
                        </h3>
                        <p className="text-gray-500">
                            {searchQuery
                                ? 'Coba dengan kata kunci lain'
                                : 'Mulai dengan menambahkan pengguna baru'
                            }
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Grid View */}
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                {currentUsers.map(user => (
                                    <div
                                        key={user.id}
                                        className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 group"
                                    >
                                        {/* Card Header with Gradient */}
                                        <div className={`h-24 ${getRoleColor(user.role)} relative`}>
                                            <div className="absolute -bottom-12 left-6">
                                                <div className="w-24 h-24 rounded-2xl bg-white shadow-lg flex items-center justify-center border-4 border-white">
                                                    <span className="text-3xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                                        {user.name?.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Status Badge */}
                                            <div className="absolute top-4 right-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                                                    user.status === 'active'
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-red-500 text-white'
                                                }`}>
                                                    {user.status === 'active' ? (
                                                        <>
                                                            <CheckCircle size={12} />
                                                            Aktif
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle size={12} />
                                                            Nonaktif
                                                        </>
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="pt-16 px-6 pb-6">
                                            <div className="mb-4">
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                    {user.name}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                                    <Mail size={14} />
                                                    {user.email}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border ${getRoleBadgeColor(user.role)}`}>
                                                        {user.role === 'admin' && <Shield size={14} />}
                                                        {user.role === 'hr' && <User size={14} />}
                                                        {user.role === 'employee' && <Users size={14} />}
                                                        {getRoleDisplay(user.role)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                                                <Calendar size={14} />
                                                Bergabung {formatDate(user.createdAt)}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingUser(user);
                                                        setForm({
                                                            name: user.name,
                                                            email: user.email,
                                                            role: user.role,
                                                            status: user.status,
                                                            password: '',
                                                            confirmPassword: '',
                                                        });
                                                        setShowAddModal(true);
                                                    }}
                                                    className="flex-1 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                                                >
                                                    <Edit2 size={16} />
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setEditingUser(user);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all duration-300"
                                                >
                                                    <Trash2 size={18} />
                                                </button>

                                                <button
                                                    data-tooltip-id="my-tooltip"
                                                    data-tooltip-html={`
                                                        <div class="text-left">
                                                            <div class="font-semibold mb-2">${user.name}</div>
                                                            <div class="text-sm space-y-1">
                                                                <div>Email: ${user.email}</div>
                                                                <div>Role: ${getRoleDisplay(user.role)}</div>
                                                                <div>Status: ${user.status === 'active' ? 'Aktif' : 'Nonaktif'}</div>
                                                            </div>
                                                        </div>
                                                    `}
                                                    className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-all duration-300"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* List View */
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6 border border-gray-100">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Pengguna</th>
                                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Role</th>
                                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Bergabung</th>
                                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentUsers.map(user => (
                                                <tr
                                                    key={user.id}
                                                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300"
                                                >
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-12 h-12 rounded-xl ${getRoleColor(user.role)} flex items-center justify-center shadow-md`}>
                                                                <span className="text-white font-bold text-lg">
                                                                    {user.name?.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-gray-900">{user.name}</div>
                                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                    <Mail size={14} />
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="py-4 px-6">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border ${getRoleBadgeColor(user.role)}`}>
                                                            {user.role === 'admin' && <Shield size={14} />}
                                                            {user.role === 'hr' && <User size={14} />}
                                                            {user.role === 'employee' && <Users size={14} />}
                                                            {getRoleDisplay(user.role)}
                                                        </span>
                                                    </td>

                                                    <td className="py-4 px-6">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold ${
                                                            user.status === 'active'
                                                                ? 'bg-green-50 text-green-700 border border-green-200'
                                                                : 'bg-red-50 text-red-700 border border-red-200'
                                                        }`}>
                                                            {user.status === 'active' ? (
                                                                <>
                                                                    <CheckCircle size={14} />
                                                                    Aktif
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <XCircle size={14} />
                                                                    Nonaktif
                                                                </>
                                                            )}
                                                        </span>
                                                    </td>

                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                            <Calendar size={14} />
                                                            {formatDate(user.createdAt)}
                                                        </div>
                                                    </td>

                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingUser(user);
                                                                    setForm({
                                                                        name: user.name,
                                                                        email: user.email,
                                                                        role: user.role,
                                                                        status: user.status,
                                                                        password: '',
                                                                        confirmPassword: '',
                                                                    });
                                                                    setShowAddModal(true);
                                                                }}
                                                                className="p-2 hover:bg-indigo-50 rounded-xl text-indigo-600 transition-all duration-300"
                                                                title="Edit"
                                                            >
                                                                <Edit2 size={18} />
                                                            </button>

                                                            <button
                                                                onClick={() => {
                                                                    setEditingUser(user);
                                                                    setShowDeleteModal(true);
                                                                }}
                                                                className="p-2 hover:bg-red-50 rounded-xl text-red-600 transition-all duration-300"
                                                                title="Hapus"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>

                                                            <button
                                                                data-tooltip-id="my-tooltip"
                                                                data-tooltip-html={`
                                                                    <div class="text-left">
                                                                        <div class="font-semibold mb-2">${user.name}</div>
                                                                        <div class="text-sm space-y-1">
                                                                            <div>Email: ${user.email}</div>
                                                                            <div>Role: ${getRoleDisplay(user.role)}</div>
                                                                            <div>Status: ${user.status === 'active' ? 'Aktif' : 'Nonaktif'}</div>
                                                                        </div>
                                                                    </div>
                                                                `}
                                                                className="p-2 hover:bg-gray-100 rounded-xl text-gray-600 transition-all duration-300"
                                                                title="Lihat Detail"
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600 font-medium">
                                        Menampilkan <span className="font-bold text-gray-900">{indexOfFirstItem + 1}</span> - <span className="font-bold text-gray-900">{Math.min(indexOfLastItem, filteredUsers.length)}</span> dari <span className="font-bold text-gray-900">{filteredUsers.length}</span> pengguna
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-xl border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300"
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
                                                    className={`w-10 h-10 rounded-xl font-semibold transition-all duration-300 ${
                                                        currentPage === pageNum
                                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                                            : 'border border-gray-200 hover:bg-indigo-50 hover:border-indigo-300'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-xl border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Tooltip id="my-tooltip" />

            {/* Add/Edit Dialog */}
            <Dialog
                open={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    resetForm();
                }}
                action={handleSubmit}
                title={editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
                subtitle={
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="Masukkan nama lengkap"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="nama@contoh.com"
                                required
                                disabled={!!editingUser}
                            />
                            {editingUser && (
                                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                    <Mail size={12} />
                                    Email tidak dapat diubah
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Role
                            </label>
                            <select
                                value={form.role}
                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            >
                                <option value="employee">Karyawan</option>
                                <option value="hr">HR</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            >
                                <option value="active">Aktif</option>
                                <option value="inactive">Nonaktif</option>
                            </select>
                        </div>

                        {!editingUser && (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="Minimal 6 karakter"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Konfirmasi Password
                                    </label>
                                    <input
                                        type="password"
                                        value={form.confirmPassword}
                                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="Ulangi password"
                                        required
                                    />
                                </div>
                            </>
                        )}
                    </form>
                }
                type="info"
                actionLabel={editingUser ? 'Simpan Perubahan' : 'Tambah Pengguna'}
                cancelLabel="Batal"
                actionOnSubmit={false}
            />

            {/* Password Reset Dialog */}
            <Dialog
                open={showPasswordModal}
                onClose={() => {
                    setShowPasswordModal(false);
                    resetForm();
                }}
                action={handlePasswordReset}
                title="Reset Password"
                subtitle={
                    <form onSubmit={handlePasswordReset} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password Baru
                            </label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="Masukkan password baru"
                                required
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Konfirmasi Password
                            </label>
                            <input
                                type="password"
                                value={form.confirmPassword}
                                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="Ulangi password baru"
                                required
                            />
                        </div>
                    </form>
                }
                type="info"
                actionLabel="Reset Password"
                cancelLabel="Batal"
                actionOnSubmit={false}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setEditingUser(null);
                }}
                action={handleDelete}
                title="Konfirmasi Hapus Pengguna"
                subtitle={
                    <div className="text-center py-4">
                        <div className="inline-flex p-4 bg-red-100 rounded-full mb-4">
                            <Trash2 className="text-red-600" size={32} />
                        </div>
                        <p className="text-gray-700 mb-2">
                            Apakah Anda yakin ingin menghapus pengguna:
                        </p>
                        <p className="font-bold text-lg text-gray-900">
                            {editingUser?.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Tindakan ini tidak dapat dibatalkan
                        </p>
                    </div>
                }
                type="danger"
                actionLabel="Ya, Hapus Pengguna"
                cancelLabel="Batal"
            />
        </div>
    );
}