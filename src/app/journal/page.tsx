import { listJournals } from '@/app/actions/journal/list'
import { JournalEntry } from '@/app/actions/journal/type'
import dayjs from 'dayjs'

export const dynamic = "force-dynamic";

export default async function JournalPage() {
	const journalEntries: JournalEntry[] = (await listJournals()) || []

	return (
		<main className="px-4 sm:px-8 lg:px-16 py-10 mx-auto">
			<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
				{journalEntries.length === 0 && (
					<li className="sm:col-span-2 lg:col-span-3 xl:col-span-4 border border-gray-200 px-6 py-16 text-center text-gray-500">
						<p className="font-insitutrial_bold text-xl text-pink">Aucune entree de journal disponible</p>
						<p className="mt-2 font-insitutrial">Ajoutez une nouvelle entree quand vous aurez de nouveaux contenus.</p>
					</li>
				)}
				{journalEntries.map((journal) => (
					<li
						key={journal.id}
						className="flex flex-col"
					>
						{journal.photo ? (
							<div className="aspect-[4/3] w-full overflow-hiddens">
								<img
									src={journal.photo as string}
									alt="Journal Photo"
									className="object-cover object-center w-full h-full transition-transform duration-300 hover:scale-105"
								/>
							</div>
						) : (
							<div className="aspect-[4/3] w-full border border-dashed border-gray-300 bg-gray-50 text-gray-500 flex items-center justify-center">
								<p className="font-insitutrial">Aucune image disponible</p>
							</div>
						)}

						<div className="mt-4 space-y-2">
							<div className="flex flex-wrap items-center gap-2 font-insitutrial_bold text-lg sm:text-xl">
								<h1>{dayjs(journal.date).format('DD - MM - YYYY')}</h1>
								<span>•</span>
								<h1>{journal.title}</h1>
							</div>
							<p className="text-sm sm:text-base leading-relaxed text-gray-700">
								{journal.description}
							</p>
						</div>
					</li>
				))}
			</ul>
		</main>
	)
}
