import { useState } from 'react';
import { Pet } from '../api/petService';

interface PetCardProps {
  pet: Pet;
  onEdit: (pet: Pet) => void;
  onDelete: (pet: Pet) => void;
}

export default function PetCard({ pet, onEdit, onDelete }: PetCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleExpandClick = () => setExpanded(!expanded);
  const handleImageError = () => setImageError(true);

  return (
    <div className="pet-card">
      <div className="pet-media">
        <img
          src={imageError || !pet.image ? '/images/placeholder.jpg' : pet.image}
          alt={`Image of ${pet.name}`}
          onError={handleImageError}
        />
      </div>
      <div className="pet-content">
        <h2>{pet.name}</h2>
        <h3>Species: {pet.species}</h3>
        <h3>Breed: {pet.breed}</h3>
        <h3>Gender: {pet.gender}</h3>
        <h3>Price: ${pet.price.toFixed(2)}</h3>
        <div className={`pet-description ${expanded ? 'expanded' : ''}`}>
          {pet.description}
        </div>
      </div>
      <div className="pet-actions">
        <button className="btn edit-btn" onClick={() => onEdit(pet)}>
        <i className="fa-solid fa-pen-to-square"></i>
          Edit
        </button>
        <button className="btn delete-btn" onClick={() => onDelete(pet)}>
        <i className="fa-solid fa-trash"></i>
          Delete
        </button>
        <button className="btn expand-btn" onClick={handleExpandClick}>
          {expanded ? <i className="fa-solid fa-chevron-up"></i> : <i className="fa-solid fa-chevron-down"></i> }
        </button>
      </div>
    </div>
  );
}