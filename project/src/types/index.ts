export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: string;
  city: string;
  description: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface Story {
  id: string;
  pet_id: string | null;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
}

export interface AdoptionRequest {
  id: string;
  user_id: string;
  pet_id: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  created_at: string;
  updated_at: string;
  pet?: Pet;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  content: string;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  pet_id: string;
  created_at: string;
  pet?: Pet;
}

export interface User {
  id: string;
  email: string;
}
