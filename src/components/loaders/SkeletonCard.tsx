export default function SkeletonCard() {
	return (
		<div className="animate-pulse rounded min-h-[481px] space-y-4">
			<div className="h-[310px] bg-gray-300"></div>
			<div className="h-4 bg-gray-300 rounded w-2/3"></div>
			<div className="h-4 bg-gray-200 rounded w-1/3"></div>
		</div>
	);
}
