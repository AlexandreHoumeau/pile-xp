export default function SkeletonCard() {
    return (
        <div className="animate-pulse border border-gray-200 rounded p-4 min-h-[481px] space-y-4">
            <div className="h-[337px] bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="flex gap-2 mt-2">
                <div className="h-8 bg-gray-300 w-20 rounded"></div>
                <div className="h-8 bg-gray-300 w-20 rounded"></div>
            </div>
        </div>
    );
}
