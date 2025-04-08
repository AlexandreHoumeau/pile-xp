export type PhotoItem = {
  id: string;
  url: string;
};

export type Inputs = {
  title: string;
  photos: FileList;
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
