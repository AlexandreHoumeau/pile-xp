"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { decrypt } from "@/app/lib/session";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { z } from "zod";

const idsSchema = z.array(z.string().min(1).max(128)).max(10000);

export async function reorderProjects(orderedIds: string[], expectedIds: string[]) {
  const session = await decrypt((await cookies()).get("session")?.value);
  if (typeof session?.userId !== "string" || !session.userId) {
    return { error: "Votre session a expiré. Reconnectez-vous." };
  }
  const ordered = idsSchema.safeParse(orderedIds);
  const expected = idsSchema.safeParse(expectedIds);
  if (!ordered.success || !expected.success) {
    return { error: "Liste de projets invalide." };
  }

  const { error } = await supabaseAdmin.rpc("reorder_projects", {
    ordered_ids: ordered.data,
    expected_ids: expected.data,
  });
  if (error) {
    return {
      error: error.code === "40001"
        ? "La liste a changé. Elle a été rechargée ; recommencez le déplacement."
        : "Impossible d’enregistrer l’ordre. Réessayez dans un instant.",
    };
  }
  revalidatePath("/");
  revalidatePath("/admin/projects");
  revalidatePath("/projects/[slug]", "page");
  return { success: true };
}
