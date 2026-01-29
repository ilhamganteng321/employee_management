"use client";

import {
  ArrowRightOnRectangleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function Dialog({
  title,
  subtitle,
  open,
  onClose,
  action,
  type = "warning", // 'warning', 'info', 'success', 'danger'
}) {
  if (!open) return null;
  const onAction = () => {
    action();
    onClose();
  };

  // Config untuk tipe dialog
  const typeConfig = {
    warning: {
      icon: ExclamationTriangleIcon,
      iconColor: "text-amber-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      buttonColor: "bg-amber-600 hover:bg-amber-700",
    },
    info: {
      icon: InformationCircleIcon,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    success: {
      icon: CheckCircleIcon,
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700",
    },
    danger: {
      icon: ArrowRightOnRectangleIcon,
      iconColor: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      buttonColor: "bg-red-600 hover:bg-red-700",
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop dengan animasi */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Dialog dengan animasi */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          className={`
            ${config.bgColor} ${config.borderColor}
            relative w-full max-w-md rounded-2xl border shadow-2xl
            transform transition-all duration-300 scale-100 opacity-100
            animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-10
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/50 transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Content */}
          <div className="p-8 max-h-[70vh] overflow-y-auto">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div
                className={`p-4 rounded-2xl bg-white border ${config.borderColor} shadow-sm`}
              >
                <Icon className={`w-12 h-12 ${config.iconColor}`} />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-center text-gray-900 mb-3">
              {title ||
                (type === "danger" ? "Konfirmasi Logout" : "Konfirmasi")}
            </h3>

            {/* Subtitle */}
            <div className="text-gray-600 text-center mb-8 leading-relaxed">
              {typeof subtitle === "string" ? <p>{subtitle}</p> : subtitle}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3.5 px-4 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 shadow-sm"
              >
                Batal
              </button>
              <button
                onClick={onAction}
                className={`
                  ${config.buttonColor}
                  flex-1 py-3.5 px-4 text-white rounded-xl font-semibold
                  active:scale-[0.98] transition-all duration-200 shadow-sm
                  flex items-center justify-center gap-2
                `}
              >
                {type === "danger" ? (
                  <>
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    Ya
                  </>
                ) : (
                  "Ya, Lanjutkan"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
