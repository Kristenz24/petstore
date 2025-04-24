import { useState, useEffect, useRef } from 'react';
import { fetchPets, createPet, updatePet, deletePet, Pet } from '../api/petService';
import PetCard from './PetCard';
import '../App.css';

export default function PetGallery() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);
  const notificationId = useRef(0);

  useEffect(() => {
    loadPets();
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 5000);
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

  const handleUpdatePet = async () => {
    if (!currentPet?.id) return;
    
    try {
      await updatePet(currentPet.id, currentPet);
      setPets(prevPets =>
        prevPets.map(pet => (pet.id === currentPet.id ? currentPet : pet))
      );
      setShowEditModal(false);
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
    notificationId.current += 1;
    setNotifications(prev => [...prev, { message, type, id: notificationId.current }]);
  };

  const handleNewPetChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setNewPet(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentPet(prev => prev ? {
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    } : null);
  };

  const openEditModal = (pet: Pet) => {
    setCurrentPet({...pet});
    setShowEditModal(true);
  };

  const openDeleteModal = (pet: Pet) => {
    setPetToDelete(pet);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (petToDelete?.id !== undefined) {
      handleDeletePet(petToDelete.id);
      setShowDeleteModal(false);
      setPetToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (loading) return <div className="loading-state">Loading...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="pet-gallery">
      <h1>PET GALLERY</h1>
      <p>Kristenz Mingoy - BSIT-3A</p>

      <button className="btn add-btn" onClick={() => setShowAddModal(true)}>
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
              onEdit={() => openEditModal(pet)}
              onDelete={() => openDeleteModal(pet)}
            />
          ))
        )}
      </div>

      {/* Add Pet Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-preview">
              <h2>Card Preview</h2>
              <div className="pet-card">
                <div className="pet-media">
                  <img
                    src={newPet.image || '/images/placeholder.jpg'}
                    alt={`Preview of ${newPet.name || 'new pet'}`}
                    onError={(e) => (e.currentTarget.src = '/images/placeholder.jpg')}
                  />
                </div>
                <div className="pet-content">
                  <h2>{newPet.name || 'Pet Name'}</h2>
                  <h3>Species: {newPet.species || 'Unknown'}</h3>
                  <h3>Breed: {newPet.breed || 'Unknown'}</h3>
                  <h3>Gender: {newPet.gender || 'Unknown'}</h3>
                  <h3>Price: ${newPet.price?.toFixed(2) || '0.00'}</h3>
                  <div className="pet-description expanded">
                    {newPet.description || 'No description provided'}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-form">
              <h2>Add New Pet</h2>
              <input name="name" value={newPet.name} onChange={handleNewPetChange} placeholder="Name" required />
              <input name="species" value={newPet.species} onChange={handleNewPetChange} placeholder="Species" required />
              <input name="breed" value={newPet.breed} onChange={handleNewPetChange} placeholder="Breed" />
              <input name="gender" value={newPet.gender} onChange={handleNewPetChange} placeholder="Gender" />
              <input name="image" value={newPet.image} onChange={handleNewPetChange} placeholder="Image URL" type="url" />
              <input name="price" type="number" value={newPet.price || ''} onChange={handleNewPetChange} placeholder="Price" min="0" step="0.01" />
              <textarea name="description" value={newPet.description} onChange={handleNewPetChange} placeholder="Description" />
              <div className="form-actions">
                <button className="btn add-btn" onClick={handleAddPet} disabled={!newPet.name || !newPet.species}>
                  Add Pet
                </button>
                <button className="btn cancel-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Pet Modal */}
      {showEditModal && currentPet && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-preview">
              <h2>Card Preview</h2>
              <div className="pet-card">
                <div className="pet-media">
                  <img
                    src={currentPet.image || '/images/placeholder.jpg'}
                    alt={`Preview of ${currentPet.name}`}
                    onError={(e) => (e.currentTarget.src = '/images/placeholder.jpg')}
                  />
                </div>
                <div className="pet-content">
                  <h2>{currentPet.name}</h2>
                  <h3>Species: {currentPet.species}</h3>
                  <h3>Breed: {currentPet.breed}</h3>
                  <h3>Gender: {currentPet.gender}</h3>
                  <h3>Price: ${currentPet.price?.toFixed(2)}</h3>
                  <div className="pet-description expanded">
                    {currentPet.description}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-form">
              <h2>Edit Pet</h2>
              <input name="name" value={currentPet.name} onChange={handleEditChange} placeholder="Name" required />
              <input name="species" value={currentPet.species} onChange={handleEditChange} placeholder="Species" required />
              <input name="breed" value={currentPet.breed} onChange={handleEditChange} placeholder="Breed" />
              <input name="gender" value={currentPet.gender} onChange={handleEditChange} placeholder="Gender" />
              <input name="image" value={currentPet.image} onChange={handleEditChange} placeholder="Image URL" type="url" />
              <input name="price" type="number" value={currentPet.price} onChange={handleEditChange} placeholder="Price" min="0" step="0.01" />
              <textarea name="description" value={currentPet.description} onChange={handleEditChange} placeholder="Description" />
              <div className="form-actions">
                <button className="btn save-btn" onClick={handleUpdatePet}>
                  Save Changes
                </button>
                <button className="btn cancel-btn" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Are you sure you want to delete this pet?</h2>
            <div className="form-actions">
              <button className="btn delete-btn" onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button className="btn cancel-btn" onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map(notification => (
          <div key={notification.id} className={`custom-notification ${notification.type}`}>
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
}