import { HTMLAttributes } from 'react'

export function LoadingSpinner({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`flex justify-center items-center ${className}`} {...props} role="status" aria-label="Loading">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
    )
}

export function ErrorMessage({ message }: { message: string }) {
    return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{message}</span>
        </div>
    )
}

export function SkeletonCard() {
    return (
        <div className="animate-pulse bg-gray-200 rounded-2xl aspect-square w-full" role="status" aria-label="Loading Pokemon"></div>
    )
}
