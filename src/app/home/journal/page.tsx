import Image from 'next/image';
import Link from 'next/link';
import { listJournals } from '@/app/actions/journal/list';
import { JournalEntry } from '@/app/actions/journal/type';
import dayjs from 'dayjs';


export default async function JournalPage() {
	const journalEntries: JournalEntry[] = await listJournals() || [];
	return (
		<main className="p-16 mx-auto">
			<ul className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-6">
				{journalEntries.map((journal) =>
					<div className="min-h-[481px]" key={journal.id}>
						<img src={journal.photo as string} className="object-cover object-center w-full" />
						<div className="flex font-insitutrial_bold text-xl mt-4 space-x-2">
							<h1>{dayjs(journal.date).format("DD - MM - YYYY")}</h1>
							<h1>{journal.title}</h1>
						</div>
						<p>{journal.description}</p>
						{/* {journal.url && <a className="font-insitutrial_bold underline" href={journal.url} target="_blank">En savoir plus</a>} */}
					</div>

				)}
			</ul>
		</main>
	);
}
