import { supabase } from "@/utils/supabaseClient";

export async function syncTags() {
	try {
		// 1. Get all programs (array of tags per project)
		const { data: projects, error: projectsError } = await supabase
			.from("projects")
			.select("program")
			.not("program", "is", null);

		if (projectsError) throw projectsError;

		// Flatten all tags used across projects
		const allProjectTags = [
			...new Set(
				(projects ?? [])
					.flatMap(p => p.program ?? [])
					.filter(Boolean)
			),
		];

		// 2. Get all existing tags from "tags" table
		const { data: existingTags, error: existingTagsError } = await supabase
			.from("tags")
			.select("name");

		if (existingTagsError) throw existingTagsError;

		const existingTagNames = existingTags?.map(t => t.name) ?? [];

		// 3. Determine tags to add and remove
		const tagsToAdd = allProjectTags.filter(tag => !existingTagNames.includes(tag));
		const tagsToRemove = existingTagNames.filter(tag => !allProjectTags.includes(tag));

		// 4. Insert missing tags
		if (tagsToAdd.length > 0) {
			const { error: insertError } = await supabase
				.from("tags")
				.insert(tagsToAdd.map(name => ({ name })));

			if (insertError) throw insertError;
			console.log("Inserted new tags:", tagsToAdd);
		} else {
			console.log("No new tags to insert.");
		}

		// 5. Delete tags no longer in use
		if (tagsToRemove.length > 0) {
			const { error: deleteError } = await supabase
				.from("tags")
				.delete()
				.in("name", tagsToRemove);

			if (deleteError) throw deleteError;
			console.log("Removed unused tags:", tagsToRemove);
		} else {
			console.log("No tags to remove.");
		}

		return { added: tagsToAdd, removed: tagsToRemove };
	} catch (error) {
		console.error("Error syncing tags:", error);
		throw error;
	}
}
