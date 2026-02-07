import { PetProfile, PetType } from '../types';

export function calculateWaterRecommendation(pet: PetProfile): number {
  // Base calculation: 60-70ml per kg of body weight per day
  // Convert to cups (1 cup = 240ml)
  
  let mlPerKg = 65; // base amount
  
  // Adjust based on pet type
  if (pet.type === PetType.CAT) {
    mlPerKg = 60; // Cats naturally drink less
  }
  
  // Adjust based on age if available
  if (pet.age) {
    if (pet.age < 1) {
      mlPerKg += 10; // Puppies/kittens need more water
    } else if (pet.age > 8) {
      mlPerKg += 5; // Senior pets may need slightly more
    }
  }
  
  // Adjust based on health goals
  if (pet.healthGoals.includes('Kidney Health')) {
    mlPerKg += 10; // More water for kidney health
  }
  if (pet.healthGoals.includes('Urinary Tract Health')) {
    mlPerKg += 10; // More water for urinary health
  }
  if (pet.healthGoals.includes('Weight Management')) {
    mlPerKg += 5; // Slightly more for weight management
  }
  
  // Calculate total ml per day
  const totalMl = pet.weight * mlPerKg;
  
  // Convert to cups and round to nearest 0.5
  const cups = totalMl / 240;
  return Math.round(cups * 2) / 2; // Round to nearest 0.5 cup
}

export function getWaterRecommendationExplanation(pet: PetProfile): string {
  const recommendation = calculateWaterRecommendation(pet);
  
  let explanation = `Based on ${pet.name}'s weight (${pet.weight}kg)`;
  
  if (pet.type === PetType.CAT) {
    explanation += ' and being a cat';
  }
  
  if (pet.age) {
    if (pet.age < 1) {
      explanation += ', young age';
    } else if (pet.age > 8) {
      explanation += ', senior age';
    }
  }
  
  const healthFactors = [];
  if (pet.healthGoals.includes('Kidney Health')) {
    healthFactors.push('kidney health');
  }
  if (pet.healthGoals.includes('Urinary Tract Health')) {
    healthFactors.push('urinary health');
  }
  if (pet.healthGoals.includes('Weight Management')) {
    healthFactors.push('weight management');
  }
  
  if (healthFactors.length > 0) {
    explanation += `, and ${healthFactors.join(', ')} goals`;
  }
  
  explanation += `, we recommend ${recommendation} cups of water daily.`;
  
  return explanation;
}
