export type JournalEntry = {
    id: string;
    title: string;
    description: string;
    date: Date;
    photo: File | string;
}