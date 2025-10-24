

export const MAX_FILE_SIZE = 2 * 1024 * 1024;
export const URL_SUFFIX = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/projects/`;

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getPublicUrl = (paths: string[]) => {
  return paths.map((path) => URL_SUFFIX + path);
};

export const getFullPathPhoto = (publicUrl: string) => {
  return publicUrl.replace(URL_SUFFIX, "");
};
