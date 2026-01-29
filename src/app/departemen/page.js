'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiHome, FiBriefcase } from 'react-icons/fi';
import { useToast } from '@/hooks/useToast';
import Dialog from '@/components/dialog/Dialog';

export default function DepartemenPage() {
  const [activeTab, setActiveTab] = useState('departemen'); // 'departemen' atau 'position'
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  
  const { success, error } = useToast();

  // Fetch data saat tab berubah
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
        if (activeTab === 'departemen') {
            const response = await fetch('/api/departemen');
            const data = await response.json();
            setDepartments(data || []);
        }else{
            const response = await fetch('/api/position');
            const data = await response.json();
            setPositions(data || []);
        }     
    } catch (err) {
      error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!formData.name.trim()) {
      error('Nama tidak boleh kosong');
      return;
    }

    try {
      const endpoint = activeTab === 'departemen' 
        ? '/api/departemen' 
        : '/api/position';
      
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem ? `${endpoint}/${editingItem.id}` : endpoint;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: formData.name }),
      });

      if (response.ok) {
        success(editingItem 
          ? `${activeTab === 'departemen' ? 'Departemen' : 'Posisi'} berhasil diperbarui`
          : `${activeTab === 'departemen' ? 'Departemen' : 'Posisi'} berhasil ditambahkan`
        );
        setShowDialog(false);
        resetForm();
        fetchData();
      } else {
        throw new Error('Gagal menyimpan');
      }
    } catch (err) {
      error('Terjadi kesalahan saat menyimpan');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ name: item.name });
    setShowDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      const endpoint = activeTab === 'departemen' 
        ? '/api/departemen' 
        : '/api/position';
      
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        success(`${activeTab === 'departemen' ? 'Departemen' : 'Posisi'} berhasil dihapus`);
        fetchData();
      } else {
        throw new Error('Gagal menghapus');
      }
    } catch (err) {
      error('Terjadi kesalahan saat menghapus');
    }
  };

  const resetForm = () => {
    setFormData({ name: '' });
    setEditingItem(null);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    resetForm();
  };

  const currentData = activeTab === 'departemen' ? departments : positions;
  const title = activeTab === 'departemen' ? 'Departemen' : 'Posisi';
  const icon = activeTab === 'departemen' ? <FiHome /> : <FiBriefcase />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen {title}</h1>
          <p className="text-gray-600">
            Kelola {activeTab === 'departemen' ? 'departemen' : 'posisi'} dalam perusahaan
          </p>
        </div>
        
        <button
          onClick={() => setShowDialog(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <FiPlus className="w-5 h-5" />
          Tambah {title}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('departemen')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'departemen'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <FiHome className="w-4 h-4" />
              Departemen
              <span className="bg-gray-100 text-gray-600 text-xs font-normal px-2 py-1 rounded-full">
                {departments.length}
              </span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('position')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'position'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <FiBriefcase className="w-4 h-4" />
              Posisi
              <span className="bg-gray-100 text-gray-600 text-xs font-normal px-2 py-1 rounded-full">
                {positions.length}
              </span>
            </div>
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : currentData.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              {icon}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tidak ada {activeTab === 'departemen' ? 'departemen' : 'posisi'}
            </h3>
            <p className="text-gray-600 mb-6">
              Mulai dengan menambahkan {activeTab === 'departemen' ? 'departemen' : 'posisi'} baru
            </p>
            <button
              onClick={() => setShowDialog(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Tambah {title}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama {title}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah Karyawan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData ? currentData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          {icon}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">ID: {item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {item.employeeCount || 0} Karyawan
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <FiEdit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Apakah yakin ingin menghapus ${item.name}?`)) {
                              handleDelete(item.id);
                            }
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (<tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">Tidak ada data</td></tr>)}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dialog Form */}
      <Dialog
        open={showDialog}
        onClose={handleDialogClose}
        action={handleSubmit}
        title={editingItem ? `Edit ${title}` : `Tambah ${title}`}
        subtitle={
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama {title}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder={`Masukkan nama ${activeTab === 'departemen' ? 'departemen' : 'posisi'}`}
                autoFocus
              />
            </div>
          </form>
        }
        type="info"
        actionLabel={editingItem ? 'Simpan Perubahan' : 'Tambah'}
        cancelLabel="Batal"
      />
    </div>
  );
}