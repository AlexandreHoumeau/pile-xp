import { supabase } from "@/utils/supabaseClient";

export async function syncTags(tags: string[]) {
	try {
		const { data: projects } = await supabase
			.from("projects")
			.select("program")
			.not("program", "is", null);

		const existingTagsSet = new Set(
			(projects ?? [])
				.flatMap(p => p.program ?? [])
				.filter(Boolean)
		);

		console.log(existingTagsSet)
		const newTags = tags.filter((tag) => existingTagsSet.has(tag));
		console.log("New tags to insert:", newTags);
		if (newTags.length > 0) {
			const insertData = newTags.map((tag) => ({ name: tag }));
			const { error } = await supabase.from("tags").insert(insertData);
			if (error) {
				throw error;
			}
			console.log("Inserted new tags:", newTags);
		} else {
			console.log("No new tags to insert.");
		}
	} catch (error) {
		throw error;
	}
}
