import { AboutInfo, getAboutInfo } from "../actions/about/get";

export default async function AboutPage() {
	const aboutInfo: AboutInfo | null = await getAboutInfo();

	return (
		<main className="px-4 sm:px-8 lg:px-16 py-8 min-h-screen grid grid-cols-1 md:grid-cols-2 gap-16">
			<div className="w-full flex">
				<div className="space-y-8">
					{aboutInfo?.sections.map((section) => (
						<div key={section.id} className="space-y-4">
							<h1 className="font-insitutrial_bold text-4xl">{section.title}</h1>
							<p className="font-insitutrial text-lg whitespace-pre-line">
								{section.description}
							</p>
						</div>
					))}
				</div>
			</div>
			<div className="flex flex-col items-start md:items-end space-y-4 w-full">
				<div className="grid grid-cols-2 md:grid-cols-1  lg:grid-cols-2 gap-4 w-full">
					{aboutInfo?.photos?.slice(0, 4).map((photo, idx) => (
						<div key={idx} className="w-full aspect-square overflow-hidden shadow-sm -z-10">
							<img
								src={photo}
								alt={`About photo ${idx + 1}`}
								className="w-full h-full object-cover object-center transition-transform duration-300 -z-10 hover:scale-105"
							/>
						</div>
					))}
				</div>
			</div>
		</main>
	)
}