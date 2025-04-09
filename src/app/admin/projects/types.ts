export type PhotoItem = {
  id: string;
  url: string;
  file: File;
};

export type Inputs = {
  title: string;
  photos: PhotoItem[];
  blueprints: FileList;
  address: string;
  project_owner: string;
  project_management: string;
  program: string;
  status: string;
  delivery: string;
  surface: string;
  budget: string;
  description: string;
};

export type ProjectCard = {
  coverPhoto: string;
  title: string;
  created_at: Date;
};
