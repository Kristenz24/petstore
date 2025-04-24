// src/api/petService.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/mingoy';

export interface Pet {
  id?: number;
  name: string;
  species: string;
  breed: string;
  gender: string;
  image: string;
  description: string;
  price: number;
}

// CRUD Operations
export const fetchPets = async (): Promise<Pet[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pets`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pets:', error);
    throw error;
  }
};

export const getPetById = async (id: number): Promise<Pet> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pets/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching pet with id ${id}:`, error);
    throw error;
  }
};

export const createPet = async (pet: Omit<Pet, 'id'>): Promise<Pet> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/pets`, pet);
    return response.data;
  } catch (error) {
    console.error('Error creating pet:', error);
    throw error;
  }
};

export const updatePet = async (id: number, pet: Pet): Promise<Pet> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/pets/${id}`, pet);
    return response.data;
  } catch (error) {
    console.error(`Error updating pet with id ${id}:`, error);
    throw error;
  }
};

export const deletePet = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/pets/${id}`);
  } catch (error) {
    console.error(`Error deleting pet with id ${id}:`, error);
    throw error;
  }
};
