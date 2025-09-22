import { ContactInfo, getContactInfo } from "@/app/actions/contact/getContactInfo";

export default async function AboutPage() {
	const contactInfo: ContactInfo | null = await getContactInfo();

	return (
		<main className="grid grid-cols-1 md:grid-cols-2 px-16 py-8 gap-12 min-h-screen">
			<div className="space-y-8">
				<div className="space-y-4">
					<h1 className="font-insitutrial_bold text-4xl">Qui on est ?</h1>
					<p className="font-insitutrial text-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
				</div>

				<div className="space-y-4">
					<h1 className="font-insitutrial_bold text-4xl">Ce que fait l'agence</h1>
					<p className="font-insitutrial text-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
				</div>

				<div className="space-y-4">
					<h1 className="font-insitutrial_bold text-4xl">Nos réflexions</h1>
					<p className="font-insitutrial text-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
				</div>
			</div>
			{contactInfo?.photo_url && (
				<div className="flex items-start justify-center">
					<div className="aspect-square w-full max-w-full">
						<img
							src={contactInfo.photo_url}
							alt="Contact"
							className="h-full w-full object-cover"
						/>
					</div>
				</div>
			)}
		</main>
	)
}