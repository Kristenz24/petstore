import { useState, useEffect } from 'react';
import { fetchPets, createPet, updatePet, deletePet, Pet } from '../api/petService';
import PetCard from './PetCard';
import '../App.css';

export default function PetGallery() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPet, setNewPet] = useState<Omit<Pet, 'id'>>({
    name: '',
    species: '',
    breed: '',
    gender: '',
    image: '',
    description: '',
    price: 0
  });

  const [notifications, setNotifications] = useState<{ message: string, type: string, id: number }[]>([]);
  let notificationId = 0;

  useEffect(() => {
    loadPets();
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications(prev => prev.slice(1)); // Remove the oldest notification after it disappears
      }, 5000); // Keep the notification for 5 seconds

      return () => clearTimeout(timer);
    }
  }, [notifications]);

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
      setShowAddModal(false);
      addNotification('Pet added successfully!', 'add');
    } catch (err) {
      console.error('Error adding pet:', err);
      loadPets();
    }
  };

  const handleUpdatePet = async (updatedPet: Pet) => {
    if (!updatedPet.id) {
      console.error('Cannot update pet: missing ID.');
      return;
    }
    try {
      await updatePet(updatedPet.id, updatedPet);
      setPets(prevPets =>
        prevPets.map(pet => (pet.id === updatedPet.id ? updatedPet : pet))
      );
      addNotification('Pet edited successfully!', 'edit');
    } catch (err) {
      console.error('Error updating pet:', err);
    }
  };

  const handleDeletePet = async (id: number) => {
    try {
      await deletePet(id);
      setPets(prevPets => prevPets.filter(pet => pet.id !== id));
      addNotification('Pet deleted successfully!', 'delete');
    } catch (err) {
      console.error('Error deleting pet:', err);
    }
  };

  const addNotification = (message: string, type: string) => {
    notificationId += 1; // Increment the ID for each new notification
    setNotifications(prev => [...prev, { message, type, id: notificationId }]);
  };

  const handleNewPetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setNewPet(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  if (loading) return <div className="loading-state">Loading...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="pet-gallery">
      <h1>PET GALLERY</h1>
      <p>Kristenz Mingoy - BSIT-3A</p>

      <button
        className="btn add-btn"
        onClick={() => setShowAddModal(true)}
      >
        Add New Pet
      </button>

      <div className="pets-container">
        {pets.length === 0 ? (
          <div className="empty-state">No pets found.</div>
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

      {showAddModal && (
        <div className="modal-overlay">
          <div className="add-pet-form modal-content">
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
            <div className="form-actions">
              <button
                className="btn add-btn"
                onClick={handleAddPet}
                disabled={!newPet.name || !newPet.species}
              >
                Add Pet
              </button>
              <button
                className="btn cancel-btn"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display Notifications */}
      <div className="notifications-container">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`custom-notification ${notification.type}`}
          >
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
}
