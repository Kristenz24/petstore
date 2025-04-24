import { useState } from 'react';
import { Pet } from '../api/petService';

interface PetCardProps {
  pet: Pet;
  onEdit: (pet: Pet) => void;
  onDelete: (id: number) => void;
}

export default function PetCard({ pet, onEdit, onDelete }: PetCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPet, setEditedPet] = useState<Pet>({ ...pet });
  const [imageError, setImageError] = useState(false); // Track if the image fails to load

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onEdit(editedPet);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditedPet({ ...pet });
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedPet(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  // Function to handle the image error (invalid or missing image)
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="pet-card">
      <div className="pet-media">
        <img 
          src={imageError || !pet.image ? '/images/placeholder.jpg' : pet.image} // Use public folder path for image
          alt={`Image of ${pet.name}`} 
          onError={handleImageError} // Handle invalid image
        />
      </div>

      <div className="pet-content">
      {isEditing ? (
  <>
    <label>Name</label>
    <input
      name="name"
      value={editedPet.name}
      onChange={handleChange}
      className="edit-input"
    />

    <label>Species</label>
    <input
      name="species"
      value={editedPet.species}
      onChange={handleChange}
      className="edit-input"
    />

    <label>Breed</label>
    <input
      name="breed"
      value={editedPet.breed}
      onChange={handleChange}
      className="edit-input"
    />

    <label>Gender</label>
    <input
      name="gender"
      value={editedPet.gender}
      onChange={handleChange}
      className="edit-input"
    />

    <label>Price</label>
    <input
      name="price"
      type="number"
      value={editedPet.price}
      onChange={handleChange}
      className="edit-input"
    />

    <label>Image URL</label>
    <input
      name="image"
      type="url"
      value={editedPet.image}
      onChange={handleChange}
      className="edit-input"
    />

    <label>Description</label>
    <textarea
      name="description"
      value={editedPet.description}
      onChange={handleChange}
      className="edit-textarea"
    />
  </>
) : (
  <>
    <h2>{pet.name}</h2>
    <h3>Species: {pet.species}</h3>
    <h3>Breed: {pet.breed}</h3>
    <h3>Gender: {pet.gender}</h3>
    <h3>Price: ${pet.price.toFixed(2)}</h3>
    <div className={`pet-description ${expanded ? 'expanded' : ''}`}>
      {pet.description}
    </div>
  </>
)}

      </div>

      <div className="pet-actions">
        {isEditing ? (
          <>
            <button className="btn save-btn" onClick={handleSaveClick}>Save</button>
            <button className="btn cancel-btn" onClick={handleCancelClick}>Cancel</button>
          </>
        ) : (
          <>
            <button className="btn edit-btn" onClick={handleEditClick}>Edit</button>
            <button className="btn delete-btn" onClick={() => onDelete(pet.id!)}>Delete</button>
            <button className="btn expand-btn" onClick={handleExpandClick}>
              {expanded ? 'Show Less' : 'Show More'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
