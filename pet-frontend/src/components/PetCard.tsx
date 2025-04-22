// src/components/PetCard.tsx
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

  return (
    <div className="pet-card">
      <div className="pet-media">
        <img 
          src={pet.image} 
          alt={`Image of ${pet.name}`} 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
      </div>

      <div className="pet-content">
        {isEditing ? (
          <>
            <input
              name="name"
              value={editedPet.name}
              onChange={handleChange}
              className="edit-input"
            />
            <input
              name="species"
              value={editedPet.species}
              onChange={handleChange}
              className="edit-input"
            />
            <input
              name="breed"
              value={editedPet.breed}
              onChange={handleChange}
              className="edit-input"
            />
            <input
              name="gender"
              value={editedPet.gender}
              onChange={handleChange}
              className="edit-input"
            />
            <input
              name="price"
              type="number"
              value={editedPet.price}
              onChange={handleChange}
              className="edit-input"
            />
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
            <h3>{pet.species} ({pet.breed})</h3>
            <h4>Gender: {pet.gender}</h4>
            <h4>Price: ${pet.price.toFixed(2)}</h4>
            {expanded && <p className="pet-description">{pet.description}</p>}
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