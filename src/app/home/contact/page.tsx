import { ContactInfo, getContactInfo } from "@/app/actions/contact/getContactInfo";
import { FAQItem } from "@/app/ui/FAQItem";
import { BsThreads } from "react-icons/bs";
import { FaPhoneAlt } from "react-icons/fa";

export default async function ContactPage() {
	const contactInfo: ContactInfo | null = await getContactInfo();

	return (
		<main className="grid grid-cols-1 md:grid-cols-2 px-16 py-8 gap-12 min-h-screen">
			<div className="space-y-8">
				<div className="space-y-4">
					<h1 className="font-insitutrial_bold text-4xl">Pile XP</h1>
					<p className="font-insitutrial text-lg">{contactInfo?.description}</p>
				</div>

				<div className="space-y-4">
					<h2 className="font-insitutrial_bold text-4xl">Vous avez une question ?</h2>
					{contactInfo?.faq.map((faq, index) => (
						<FAQItem key={index} question={faq.question} answer={faq.answer} />
					))}
				</div>

				<div className="space-y-4">
					<h1 className="font-insitutrial_bold text-4xl">Contact</h1>
					<div className="flex">
						<div className="flex underline">
							<BsThreads className="inline text-3xl mr-2" />
							<p className="font-insitutrial text-lg">{contactInfo?.email}</p>
						</div>
						<div className="flex">
							<FaPhoneAlt className="inline text-xl mr-2 ml-6 mt-1" />
							<p className="font-insitutrial text-lg">{contactInfo?.phone_number}</p>
						</div>

					</div>
				</div>
					<p className="font-insitutrial text-center text-xl mt-8">On sera ravis de vous rencontrer ou de discuter de votre projet !</p>
			</div>

			{contactInfo?.photo_url && (
				<div className="flex items-start justify-center">
					<div className="aspect-square w-full max-w-full">
						<img
							src={contactInfo.photo_url}
							alt="Contact"
							className="h-screen w-full object-cover"
						/>
					</div>
				</div>
			)}
		</main>
	);
}