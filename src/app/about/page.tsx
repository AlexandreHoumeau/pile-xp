import { AboutInfo, getAboutInfo } from "../actions/about/get";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
	const aboutInfo: AboutInfo | null = await getAboutInfo();
	const hasSections = Boolean(aboutInfo?.sections.length);
	const hasPhotos = Boolean(aboutInfo?.photos.length);

	return (
		<main className="px-4 sm:px-8 lg:px-16 py-8 min-h-screen md:grid md:grid-cols-2 gap-16">
			<div className="w-full flex flex-col space-y-8">
				{hasSections ? aboutInfo?.sections.map((section, index) => (
					<div key={section.id}>
						<div className="space-y-4">
							<h1 className="font-insitutrial_bold text-4xl">{section.title}</h1>
							<p className="font-insitutrial text-lg whitespace-pre-line">
								{section.description}
							</p>
						</div>
						{index === 0 && (
							<div className="md:hidden grid grid-cols-2 gap-4 w-full">
								{hasPhotos ? aboutInfo?.photos?.slice(0, 4).map((photo, idx) => (
									<div key={idx} className="w-full aspect-square overflow-hidden shadow-sm -z-10">
										<img
											src={photo}
											alt={`About photo ${idx + 1}`}
											className="w-full h-full object-cover object-center transition-transform duration-300 -z-10 hover:scale-105"
										/>
									</div>
								)) : (
									<div className="col-span-2 w-full aspect-square border border-dashed border-gray-300 bg-gray-50 text-gray-500 flex items-center justify-center">
										<p className="font-insitutrial">Aucune image disponible</p>
									</div>
								)}
							</div>
						)}
					</div>
				)) : (
					<div className="border border-gray-200 px-6 py-12 text-gray-500">
						<h1 className="font-insitutrial_bold text-4xl text-pink">A propos</h1>
						<p className="mt-4 font-insitutrial text-lg">
							Aucun contenu n&apos;est disponible pour le moment.
						</p>
					</div>
				)}
			</div>
			<div className="hidden md:flex flex-col items-start md:items-end space-y-4 w-full">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
					{hasPhotos ? aboutInfo?.photos?.slice(0, 4).map((photo, idx) => (
						<div key={idx} className="w-full aspect-square overflow-hidden shadow-sm -z-10">
							<img
								src={photo}
								alt={`About photo ${idx + 1}`}
								className="w-full h-full object-cover object-center transition-transform duration-300 -z-10 hover:scale-105"
							/>
						</div>
					)) : (
						<div className="w-full aspect-square border border-dashed border-gray-300 bg-gray-50 text-gray-500 flex items-center justify-center">
							<p className="font-insitutrial">Aucune image disponible</p>
						</div>
					)}
				</div>
			</div>
		</main>
	)
}
