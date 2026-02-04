"use client"
import { useToast } from "@/hooks/useToast"
import { useState, useEffect } from "react"

export default function SalaryForm({
  employees,
  fetchdata,
  editingSalary,
  onSubmit,
  onCancel
}) {
    const { success } = useToast();
  const [formData, setFormData] = useState({
    employeeId: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    basicSalary: 0,
    allowance: 0,
    bonus: 0,
    deduction: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (editingSalary) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        employeeId: editingSalary.employeeId,
        month: editingSalary.month,
        year: editingSalary.year,
        basicSalary: editingSalary.basicSalary,
        allowance: editingSalary.allowance,
        bonus: editingSalary.bonus,
        deduction: editingSalary.deduction
      })
    }
  }, [editingSalary])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === "employeeId" ? value : Number(value)
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validation
    if (!formData.employeeId) {
      setError("Pilih karyawan terlebih dahulu")
      setLoading(false)
      return
    }

    if (formData.month < 1 || formData.month > 12) {
      setError("Bulan harus antara 1-12")
      setLoading(false)
      return
    }

    const result = await onSubmit(formData)
    if (!result.success) {
        setError(result.error || "Terjadi kesalahan")
    } else {
        fetchdata()
        success(editingSalary ? 'edit data berhasil' : 'tambah data berhasil')
      // Reset form if not editing
      if (!editingSalary) {
        setFormData({
          employeeId: "",
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          basicSalary: 0,
          allowance: 0,
          bonus: 0,
          deduction: 0
        })
      }
    }
    setLoading(false)
  }

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Karyawan *
        </label>
        <select
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Pilih Karyawan</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.employeeName}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bulan *
          </label>
          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            {months.map((month, index) => (
              <option key={index} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tahun *
          </label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            min="2000"
            max="2100"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gaji Pokok (Rp)
          </label>
          <input
            type="number"
            name="basicSalary"
            value={formData.basicSalary}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tunjangan (Rp)
          </label>
          <input
            type="number"
            name="allowance"
            value={formData.allowance}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            min="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bonus (Rp)
          </label>
          <input
            type="number"
            name="bonus"
            value={formData.bonus}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Potongan (Rp)
          </label>
          <input
            type="number"
            name="deduction"
            value={formData.deduction}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            min="0"
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-700">Total Gaji:</span>
          <span className="text-xl font-bold text-green-600">
            Rp{" "}
            {(
              formData.basicSalary +
              formData.allowance +
              formData.bonus -
              formData.deduction
            ).toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : editingSalary ? "Update" : "Simpan"}
        </button>

        {editingSalary && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Batal
          </button>
        )}
      </div>
    </form>
  )
}
