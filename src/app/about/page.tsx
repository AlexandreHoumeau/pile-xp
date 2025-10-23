import { AboutInfo, getAboutInfo } from "../actions/about/get";

export default async function AboutPage() {
	const aboutInfo: AboutInfo | null = await getAboutInfo();

	return (
		<main className="grid grid-cols-1 gap-16 md:grid-cols-2 px-16 py-8 min-h-screen">
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
			<div className="flex items-start justify-end">
				<div className="grid grid-cols-2 gap-4 w-full">
					{aboutInfo?.photos?.slice(0, 4).map((photo, idx) => (
						<div key={idx} className="aspect-square w-full overflow-hidden">
							<img
								src={photo}
								alt={`About photo ${idx + 1}`}
								className="h-full w-full object-cover"
							/>
						</div>
					))}
				</div>
			</div>
		</main>
	)
}