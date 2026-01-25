export interface MediaType {
  id: string;
  title: string;
  description: string;
  width: string;
  height: string;
  requirements: string;
  printRequired: boolean;
  languages: string[];
  notes: string;
  isVideo: boolean;
  videoLength: string;
  videoRatio: string;
}

export interface MediaPackage {
  _id?: string;
  name: string;
  description: string;
  mediaTypes: MediaType[];
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
