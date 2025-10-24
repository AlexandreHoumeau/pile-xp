"use server";

import { supabaseAdmin } from "@/utils/supabaseAdmin";


export async function syncTags() {
	try {
		const { data: projects, error: projectsError } = await supabaseAdmin
			.from("projects")
			.select("program")
			.not("program", "is", null);

		if (projectsError) throw projectsError;

		const allProjectTags = [
			...new Set(
				(projects ?? [])
					.flatMap(p => p.program ?? [])
					.filter(Boolean)
			),
		];

		const { data: existingTags, error: existingTagsError } = await supabaseAdmin
			.from("tags")
			.select("name");

		if (existingTagsError) throw existingTagsError;

		const existingTagNames = existingTags?.map(t => t.name) ?? [];

		const tagsToAdd = allProjectTags.filter(tag => !existingTagNames.includes(tag));
		const tagsToRemove = existingTagNames.filter(tag => !allProjectTags.includes(tag));

		if (tagsToAdd.length > 0) {
			const { error: insertError } = await supabaseAdmin
				.from("tags")
				.insert(tagsToAdd.map(name => ({ name })));

			if (insertError) throw insertError;
			console.log("Inserted new tags:", tagsToAdd);
		} else {
			console.log("No new tags to insert.");
		}

		if (tagsToRemove.length > 0) {
			const { error: deleteError } = await supabaseAdmin
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
