import { ContactInfo, getContactInfo } from "@/app/actions/contact/getContactInfo"
import { FAQItem } from "@/app/ui/FAQItem"
import { BsThreads } from "react-icons/bs"
import { FaPhoneAlt } from "react-icons/fa"
import { getPublicUrl } from "@/utils/general"

export default async function ContactPage() {
	const contactInfo: ContactInfo | null = await getContactInfo()

	return (
		<main className="px-4 sm:px-8 lg:px-16 py-8 min-h-screen grid grid-cols-1 md:grid-cols-2 gap-12">
			{/* Text Section */}
			<div className="space-y-8">
				{/* Description */}
				<div className="space-y-4">
					<h1 className="font-insitutrial_bold text-3xl sm:text-4xl">Pile XP</h1>
					<p className="font-insitutrial text-base sm:text-lg whitespace-pre-line">
						{contactInfo?.description}
					</p>
				</div>

				{/* FAQ */}
				<div className="space-y-4">
					<h2 className="font-insitutrial_bold text-3xl sm:text-4xl">Vous avez une question ?</h2>
					{contactInfo?.faq.map((faq, index) => (
						<FAQItem key={index} question={faq.question} answer={faq.answer} />
					))}
				</div>

				{/* Contact Info */}
				<div className="space-y-4">
					<h1 className="font-insitutrial_bold text-3xl sm:text-4xl">Contact</h1>
					<div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
						<div className="flex items-center underline gap-2">
							<BsThreads className="text-2xl sm:text-3xl" />
							<p className="font-insitutrial text-base sm:text-lg">{contactInfo?.email}</p>
						</div>
						<div className="flex items-center gap-2">
							<FaPhoneAlt className="text-xl sm:text-xl" />
							<p className="font-insitutrial text-base sm:text-lg">{contactInfo?.phone_number}</p>
						</div>
					</div>
				</div>

				<p className="font-insitutrial text-center text-lg sm:text-xl mt-8">
					On sera ravis de vous rencontrer ou de discuter de votre projet !
				</p>
			</div>

			{/* Photo Section */}
			{contactInfo?.photo_url && (
				<div className="flex items-center justify-center mt-8 md:mt-0">
					<div className="w-full max-w-md md:max-w-full aspect-square overflow-hidden shadow-sm">
						<img
							src={getPublicUrl([contactInfo.photo_url])[0]}
							alt="Contact"
							className="w-full h-full object-cover object-center"
						/>
					</div>
				</div>
			)}
		</main>
	)
}
