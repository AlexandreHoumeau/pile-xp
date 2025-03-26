import { createSession, deleteSession } from "@/app/lib/session";

import { FormState, SignupFormSchema } from "../lib/definitions";
import { supabase } from "@/utils/supabaseClient";
import { redirect, RedirectType } from "next/navigation";

export async function logout() {
  deleteSession();
  redirect("/login");
}

export async function login(state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  await delay(2000);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log(JSON.stringify(error, null, 3))
    return { message: error.message };
  }

  await createSession(data.user.id);
  return redirect("/admin", RedirectType.replace);
}
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
