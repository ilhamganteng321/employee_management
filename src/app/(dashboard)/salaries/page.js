"use client"
import { useState, useEffect } from "react"
import SalaryList from "@/components/form/SalaryList"
import SalaryForm from "@/components/form/SalaryForm"
import { useToast } from "@/hooks/useToast"

export default function SalariesPage() {
    const [salaries, setSalaries] = useState([])
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [error, setError] = useState(null)
    const [editingSalary, setEditingSalary] = useState(null)
    const { success } = useToast();

    const fetchSalaries = async () => {
        setLoading(true)
        try {
            const response = await fetch("/api/salaries")
            if (!response.ok) throw new Error("Failed to fetch salaries")
            const data = await response.json()
            setSalaries(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setLoading(false)
        }
    }

    const fetchEmployees = async () => {
        setLoading(true)
        try {
            const response = await fetch("/api/karyawan")
            if (!response.ok) throw new Error("Failed to fetch employees")
            const data = await response.json()
            setEmployees(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch employees")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSalaries()
        fetchEmployees()
    }, [])

    const handleCreate = async salaryData => {
        try {
            const response = await fetch("/api/salaries", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(salaryData)
            })

            if (!response.ok) throw new Error("Failed to create salary")

            const newSalary = await response.json()
            setSalaries([...salaries, newSalary])
            setShowForm(false)
            return { success: true }
        } catch (err) {
            return {
                success: false,
                error: err instanceof Error ? err.message : "Failed to create salary"
            }
        }
    }

    const handleUpdate = async (id, salaryData) => {
        try {
            const response = await fetch(`/api/salaries/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(salaryData)
            })

            if (!response.ok) throw new Error("Failed to update salary")

            const updatedSalary = await response.json()
            setSalaries(salaries.map(s => (s.id === id ? updatedSalary : s)))
            setEditingSalary(null)
            setShowForm(false)
            return { success: true }
        } catch (err) {
            return {
                success: false,
                error: err instanceof Error ? err.message : "Failed to update salary"
            }
        }
    }

    const handleDelete = async id => {
        if (!confirm("Are you sure you want to delete this salary record?")) return

        try {
            const response = await fetch(`/api/salaries/${id}`, {
                method: "DELETE"
            })

            if (!response.ok) throw new Error("Failed to delete salary")
            success('data berhasil di hapus')
            setSalaries(salaries.filter(s => s.id !== id))
            return { success: true }
        } catch (err) {
            return {
                success: false,
                error: err instanceof Error ? err.message : "Failed to delete salary"
            }
        }
    }

    const handleEdit = (salary) => {
        setEditingSalary(salary)
        setShowForm(true)
    }

    const handleCancelForm = () => {
        setEditingSalary(null)
        setShowForm(false)
    }

    const calculateTotalSalary = (basic, allowance, bonus, deduction) => {
        return basic + allowance + bonus - deduction
    }

    if (loading) return <div className="p-8 text-center">Loading...</div>
    if (error)
        return <div className="p-8 text-center text-red-600">Error: {error}</div>

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Gaji Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingSalary ? "Edit Gaji" : "Tambah Gaji Baru"}
                    </h2>

                    {!showForm ? (
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                        >
                            Tambah Data
                        </button>
                    ) : (
                        <SalaryForm
                            employees={employees}
                            editingSalary={editingSalary}
                            fetchdata={fetchSalaries}
                            onSubmit={async data => {
                                const total = calculateTotalSalary(
                                    data.basicSalary,
                                    data.allowance,
                                    data.bonus,
                                    data.deduction
                                )

                                const salaryData = {
                                    ...data,
                                    totalSalary: total
                                }

                                if (editingSalary) {
                                    return handleUpdate(editingSalary.id, salaryData)
                                } else {
                                    return handleCreate(salaryData)
                                }
                            }}
                            onCancel={handleCancelForm}
                        />
                    )}
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Daftar Gaji</h2>
                    <SalaryList
                        salaries={salaries}
                        employees={employees}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </div>
    )
}