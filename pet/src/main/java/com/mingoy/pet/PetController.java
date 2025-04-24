package com.mingoy.pet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping(path = "/mingoy")
@CrossOrigin(origins = "*") // Global CORS for all endpoints in this controller
public class PetController {

    @Autowired
    private PetRepository petRepository;

    @GetMapping(path = "/pets")
    public @ResponseBody Iterable<Pet> getAllPets() {
        return petRepository.findAll();
    }

    @PostMapping(path = "/pets")
    public ResponseEntity<Pet> addPet(
            @RequestBody(required = false) Pet pet,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String species,
            @RequestParam(required = false) String breed,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String image,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Double price) {

        if (pet != null) {
            Pet savedPet = petRepository.save(pet);
            return ResponseEntity.status(201).body(savedPet);
        }

        if (name != null && species != null) {
            Pet newPet = new Pet();
            newPet.setName(name);
            newPet.setSpecies(species);
            newPet.setBreed(breed);
            newPet.setGender(gender);
            newPet.setImage(image);
            newPet.setDescription(description);
            newPet.setPrice(price);

            Pet savedPet = petRepository.save(newPet);
            return ResponseEntity.status(201).body(savedPet);
        }

        return ResponseEntity.badRequest().build();
    }

    @PutMapping(path = "/pets/{id}")
    public ResponseEntity<String> updatePet(@PathVariable Integer id, @RequestBody Pet petDetails) {
        Pet existingPet = petRepository.findById(id).orElse(null);
        if (existingPet == null) {
            return ResponseEntity.status(404).body("Pet with ID " + id + " not found.");
        }

        existingPet.setName(petDetails.getName());
        existingPet.setSpecies(petDetails.getSpecies());
        existingPet.setBreed(petDetails.getBreed());
        existingPet.setGender(petDetails.getGender());
        existingPet.setImage(petDetails.getImage());
        existingPet.setDescription(petDetails.getDescription());
        existingPet.setPrice(petDetails.getPrice());

        petRepository.save(existingPet);
        return ResponseEntity.ok("Pet with id " + id + " updated.");
    }

    @DeleteMapping(path = "/pets/{id}")
    public ResponseEntity<String> deletePet(@PathVariable Integer id) {
        Pet existingPet = petRepository.findById(id).orElse(null);
        if (existingPet == null) {
            return ResponseEntity.status(404).body("Pet with ID " + id + " not found.");
        }

        petRepository.delete(existingPet);
        return ResponseEntity.ok("Pet with id " + id + " deleted.");
    }

    @GetMapping(path = "/pets/{id}")
    public ResponseEntity<Pet> getPetById(@PathVariable Integer id) {
        Pet pet = petRepository.findById(id).orElse(null);
        if (pet == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.ok(pet);
    }

    @GetMapping(path = "/pets/search/{key}")
    public ResponseEntity<List<Pet>> searchPets(@PathVariable String key) {
        List<Pet> result = ((List<Pet>) petRepository.findAll()).stream()
                .filter(pet -> pet.getName().toLowerCase().contains(key.toLowerCase()) ||
                        pet.getSpecies().toLowerCase().contains(key.toLowerCase()) ||
                        pet.getBreed().toLowerCase().contains(key.toLowerCase()) ||
                        pet.getGender().toLowerCase().contains(key.toLowerCase()) ||
                        pet.getDescription().toLowerCase().contains(key.toLowerCase()))
                .toList();

        if (result.isEmpty()) {
            return ResponseEntity.status(404).body(result);
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping(path = "/pets/search/price/{price}")
    public ResponseEntity<List<Pet>> getPetsByPrice(@PathVariable Double price) {
        List<Pet> result = ((List<Pet>) petRepository.findAll()).stream()
                .filter(pet -> pet.getPrice() <= price)
                .toList();

        if (result.isEmpty()) {
            return ResponseEntity.status(404).body(result);
        }

        return ResponseEntity.ok(result);
    }

    // Add this method to your PetController
    @PostMapping(path = "/pets/bulk")
    public ResponseEntity<List<Pet>> addPetsBulk(@RequestBody List<Pet> pets) {
        try {
            if (pets == null || pets.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            List<Pet> savedPets = new ArrayList<>();
            for (Pet pet : pets) {
                // Validate required fields
                if (pet.getName() == null || pet.getSpecies() == null) {
                    continue; // Skip invalid pets or you could return an error
                }

                Pet savedPet = petRepository.save(pet);
                savedPets.add(savedPet);
            }

            return ResponseEntity.status(201).body(savedPets);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}