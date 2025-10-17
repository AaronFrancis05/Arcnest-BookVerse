// components/LoadingButton.jsx
'use client'
export default function LoadingButton({
    loading = false,
    children,
    className = '',
    ...props
}) {
    return (
        <button
            {...props}
            disabled={loading}
            className={`
                relative bg-indigo-600 text-white py-3 px-6 rounded-lg 
                hover:bg-indigo-700 disabled:bg-indigo-400 
                disabled:cursor-not-allowed transition-colors
                ${className}
            `}
        >
            {loading && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            <span className={loading ? 'opacity-0' : 'opacity-100'}>
                {children}
            </span>
            {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                    Loading...
                </span>
            )}
        </button>
    );
}