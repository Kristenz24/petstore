// src/components/PetGallery.tsx
import { useState, useEffect } from 'react';
import { fetchPets, createPet, updatePet, deletePet, Pet } from '../api/petService';
import PetCard from './PetCard';
import '../App.css';

export default function PetGallery() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPet, setNewPet] = useState<Omit<Pet, 'id'>>({ 
    name: '',
    species: '',
    breed: '',
    gender: '',
    image: '',
    description: '',
    price: 0
  });

  // Load initial data
  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPets();
      setPets(data);
    } catch (err) {
      setError('Failed to load pets. Please try again later.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPet = async () => {
    try {
      const createdPet = await createPet(newPet);
      setPets(prevPets => [...prevPets, createdPet]);
      setNewPet({ 
        name: '',
        species: '',
        breed: '',
        gender: '',
        image: '',
        description: '',
        price: 0
      });
    } catch (err) {
      console.error('Error adding pet:', err);
      loadPets();
    }
  };

  const handleUpdatePet = async (updatedPet: Pet) => {
    try {
      setPets(prevPets => 
        prevPets.map(pet => 
          pet.id === updatedPet.id ? { ...pet, ...updatedPet } : pet
        )
      );
      await updatePet(updatedPet.id!, updatedPet);
    } catch (err) {
      console.error('Error updating pet:', err);
      loadPets();
    }
  };

  const handleDeletePet = async (id: number) => {
    try {
      setPets(prevPets => prevPets.filter(pet => pet.id !== id));
      await deletePet(id);
    } catch (err) {
      console.error('Error deleting pet:', err);
      loadPets();
    }
  };

  const handleNewPetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setNewPet(prev => {
      if (name === 'price') {
        return {
          ...prev,
          [name]: value === '' ? 0 : parseFloat(value) || 0
        };
      }
      return {
        ...prev,
        [name]: value
      };
    });
  };

  if (loading) return <div className="loading-state">Loading...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="pet-gallery">
      <h1>PET GALLERY</h1>
      <p>Kristenz Mingoy - BSIT-3A</p>

      <div className="add-pet-form">
        <h2>Add New Pet</h2>
        <div className="form-grid">
          <input
            name="name"
            value={newPet.name}
            onChange={handleNewPetChange}
            placeholder="Name"
            required
          />
          <input
            name="species"
            value={newPet.species}
            onChange={handleNewPetChange}
            placeholder="Species"
            required
          />
          <input
            name="breed"
            value={newPet.breed}
            onChange={handleNewPetChange}
            placeholder="Breed"
          />
          <input
            name="gender"
            value={newPet.gender}
            onChange={handleNewPetChange}
            placeholder="Gender"
          />
          <input
            name="image"
            value={newPet.image}
            onChange={handleNewPetChange}
            placeholder="Image URL"
            type="url"
          />
          <input
            name="price"
            type="number"
            value={newPet.price === 0 ? '' : newPet.price}
            onChange={handleNewPetChange}
            placeholder="Price"
            min="0"
            step="0.01"
          />
          <input
            name="description"
            value={newPet.description}
            onChange={handleNewPetChange}
            placeholder="Description"
          />
        </div>
        <button 
          className="btn add-btn" 
          onClick={handleAddPet}
          disabled={!newPet.name || !newPet.species}
        >
          Add Pet
        </button>
      </div>

      <div className="pets-container">
        {pets.length === 0 ? (
          <div className="empty-state">No pets found. Add some pets!</div>
        ) : (
          pets.map(pet => (
            <PetCard
              key={pet.id}
              pet={pet}
              onEdit={handleUpdatePet}
              onDelete={handleDeletePet}
            />
          ))
        )}
      </div>
    </div>
  );
}