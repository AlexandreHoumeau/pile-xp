export const MAX_FILE_SIZE = 2 * 1024 * 1024;
export const URL_SUFFIX = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/projects/`;
const STORAGE_PUBLIC_SEGMENT = "/storage/v1/object/public/projects/";

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const normalizeStoragePath = (path?: string | null) => {
  if (!path) {
    return null;
  }

  const trimmedPath = path.trim();
  if (!trimmedPath) {
    return null;
  }

  const segmentIndex = trimmedPath.lastIndexOf(STORAGE_PUBLIC_SEGMENT);
  if (segmentIndex >= 0) {
    const normalizedPath = trimmedPath.slice(segmentIndex + STORAGE_PUBLIC_SEGMENT.length);
    return normalizedPath || null;
  }

  return trimmedPath;
};

export const getPublicUrl = (paths: Array<string | null | undefined>) => {
  return paths
    .map(normalizeStoragePath)
    .filter((path): path is string => Boolean(path))
    .map((path) => URL_SUFFIX + path);
};

export const getFullPathPhoto = (publicUrl: string) => {
  return normalizeStoragePath(publicUrl) ?? publicUrl;
};
