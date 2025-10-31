export type Project = {
    address: string;
    slug: string;
    blueprints: string[];
    budget: string;
    created_at: string;
    delivery: string;
    description: string;
    id: string;
    photos: string[];
    program: string[];
    project_management: string;
    project_owner: string;
    status: string;
    surface: string;
    title: string;
    updated_at: string;
    pdf_url?: string;
    youtube_url?: string;
    colaborators: string;
  };
  

  export type ProjectPreview = Pick<Project, "id" | "title" | "slug" | "colaborators" | "created_at" | "photos">;