"use client"
import { useState, useEffect } from "react"
import { X, Save, XCircle } from "lucide-react"

const Form = ({
  title = "Form",
  fields,
  initialData = {},
  onSubmit,
  onClose,
  submitText = "Simpan",
  cancelText = "Batal",
  isLoading = false
}) => {
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  useEffect(() => {
    // Initialize form data with default values or initial data
    const initialFormData = {}
    fields.forEach(field => {
      if (initialData[field.name] !== undefined) {
        initialFormData[field.name] = initialData[field.name]
      } else if (field.defaultValue !== undefined) {
        initialFormData[field.name] = field.defaultValue
      } else if (field.type === "checkbox") {
        initialFormData[field.name] = false
      } else {
        initialFormData[field.name] = ""
      }
    })
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData(initialFormData)
  }, [fields, initialData])

  const validateField = (field, value) => {
    // Required validation
    if (field.required && !value && value !== 0 && value !== false) {
      return `${field.label} wajib diisi`
    }

    // Type-specific validations
    if (value && field.validation) {
      const { min, max, minLength, maxLength, pattern } = field.validation

      if (field.type === "number") {
        const numValue = Number(value)
        if (min !== undefined && numValue < min) {
          return `${field.label} minimal ${min}`
        }
        if (max !== undefined && numValue > max) {
          return `${field.label} maksimal ${max}`
        }
      }

      if (field.type === "text" || field.type === "textarea") {
        const strValue = String(value)
        if (minLength !== undefined && strValue.length < minLength) {
          return `${field.label} minimal ${minLength} karakter`
        }
        if (maxLength !== undefined && strValue.length > maxLength) {
          return `${field.label} maksimal ${maxLength} karakter`
        }
        if (pattern && !new RegExp(pattern).test(strValue)) {
          return `${field.label} format tidak valid`
        }
      }

      if (field.type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          return "Format email tidak valid"
        }
      }
    }

    return ""
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field.name]: value
    }))

    // Validate on change if field has been touched
    if (touched[field.name]) {
      const error = validateField(field, value)
      setErrors(prev => ({
        ...prev,
        [field.name]: error
      }))
    }
  }

  const handleBlur = field => {
    setTouched(prev => ({
      ...prev,
      [field.name]: true
    }))

    const error = validateField(field, formData[field.name])
    setErrors(prev => ({
      ...prev,
      [field.name]: error
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()

    // Validate all fields
    const newErrors = {}
    const newTouched = {}

    fields.forEach(field => {
      newTouched[field.name] = true
      const error = validateField(field, formData[field.name])
      if (error) {
        newErrors[field.name] = error
      }
    })

    setTouched(newTouched)
    setErrors(newErrors)

    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData)
    }
  }

  const renderField = field => {
    const hasError = touched[field.name] && errors[field.name]
    const commonClasses = `w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      hasError ? "border-red-500" : "border-gray-300"
    } ${field.disabled ? "bg-gray-100 cursor-not-allowed" : ""}`

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            id={field.name}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={e => handleChange(field, e.target.value)}
            onBlur={() => handleBlur(field)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            required={field.required}
            className={`${commonClasses} min-h-[100px] resize-y`}
          />
        )

      case "select":
        return (
          <select
            id={field.name}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={e => handleChange(field, e.target.value)}
            onBlur={() => handleBlur(field)}
            disabled={field.disabled}
            required={field.required}
            className={commonClasses}
          >
            <option value="">Pilih {field.label}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.name}
              name={field.name}
              checked={formData[field.name] || false}
              onChange={e => handleChange(field, e.target.checked)}
              onBlur={() => handleBlur(field)}
              disabled={field.disabled}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={field.name} className="ml-2 text-sm text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        )

      default:
        return (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={e => handleChange(field, e.target.value)}
            onBlur={() => handleBlur(field)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            required={field.required}
            className={commonClasses}
            min={field.validation?.min}
            max={field.validation?.max}
            minLength={field.validation?.minLength}
            maxLength={field.validation?.maxLength}
            pattern={field.validation?.pattern}
          />
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          <div className="px-6 py-4 space-y-4">
            {fields.map(field => (
              <div key={field.name}>
                {field.type !== "checkbox" && (
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                )}
                {renderField(field)}
                {touched[field.name] && errors[field.name] && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {submitText}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Form
