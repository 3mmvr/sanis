
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { PetProfile, MealAnalysis } from "./types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async validateImage(imageB64: string): Promise<{ isValid: boolean; reason?: string }> {
    try {
      const validationPrompt = `
        You are an image validation system for a pet food analysis app.
        Analyze this image and determine if it contains pet food that can be analyzed.
        
        VALID IMAGES:
        - Clear photos of pet food in bowls, plates, or containers
        - Kibble, wet food, raw food, treats, or home-cooked meals
        - Canned food (opened cans showing food contents)
        - Pet food packaging with clearly visible nutritional labels
        - Food that is clearly visible and in focus
        - Multiple angles of the same food
        
        INVALID IMAGES:
        - Blurry or out-of-focus images where food cannot be identified
        - Images of empty bowls or containers
        - Closed/unopened cans or packages without visible food or labels
        - Images of pets/animals without visible food
        - Images of humans, furniture, or non-food objects
        - Screenshots, memes, or text documents
        - Very dark or overexposed images where food is not visible
        - Non-food items (toys, accessories, etc.)
        
        OUTPUT JSON:
        {
          "isValid": boolean (true if image contains identifiable pet food or readable packaging),
          "reason": string (if invalid, explain why: "blurry", "no_food", "empty_bowl", "not_food", "too_dark", etc.)
        }
      `;

      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: imageB64 } },
            { text: validationPrompt }
          ]
        },
        config: {
          temperature: 0.1,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isValid: { type: Type.BOOLEAN },
              reason: { type: Type.STRING }
            },
            required: ['isValid']
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      return result;
    } catch (error) {
      console.error("Image validation failed", error);
      // If validation fails, allow the image through (fail-open)
      return { isValid: true };
    }
  }

  async analyzeMeal(imageB64: string, pet: PetProfile): Promise<MealAnalysis> {
    // First, validate the image
    const validation = await this.validateImage(imageB64);
    if (!validation.isValid) {
      const errorMessages: Record<string, string> = {
        'blurry': 'Image is too blurry. Please retake with better focus.',
        'no_food': 'No pet food detected in image. Please ensure food is visible.',
        'empty_bowl': 'Bowl appears empty. Please take photo with food in it.',
        'not_food': 'Image does not contain pet food. Please photograph your pet\'s meal.',
        'too_dark': 'Image is too dark. Please retake with better lighting.',
        'default': 'Unable to analyze this image. Please ensure pet food is clearly visible and in focus.'
      };
      
      const message = errorMessages[validation.reason || 'default'] || errorMessages['default'];
      throw new Error(message);
    }
    
    // Calculate age category and life stage
    const ageCategory = pet.age ? (pet.age < 1 ? 'Puppy/Kitten' : pet.age > 7 ? 'Senior' : 'Adult') : 'Unknown';
    const dailyCalorieNeed = pet.age && pet.age < 1 
      ? Math.round(pet.weight * 85) // Growing pets need more
      : pet.age && pet.age > 7
      ? Math.round(pet.weight * 55) // Senior pets need less
      : Math.round(pet.weight * 65); // Adult maintenance
    
    const prompt = `
      You are a certified veterinary nutritionist with 15+ years of experience in pet food analysis.
      Analyze this pet meal photo with SCIENTIFIC PRECISION and ACCURACY tailored to THIS SPECIFIC PET.
      
      COMPLETE PET PROFILE:
      - Name: ${pet.name}
      - Species: ${pet.type}
      - Breed: ${pet.breed}
      - Age: ${pet.age ? `${pet.age} years (${ageCategory})` : 'Not specified'}
      - Current Weight: ${pet.weight}kg
      - Life Stage Calorie Needs: ~${dailyCalorieNeed} cal/day (maintenance)
      - Bowl Size Reference: ${pet.bowlSize} bowl
      - Daily Water Target: ${pet.dailyWaterTarget} cups/day
      - Active Health Goals: ${pet.healthGoals.length > 0 ? pet.healthGoals.join(", ") : "General health maintenance"}
      
      BREED-SPECIFIC CONSIDERATIONS FOR ${pet.breed}:
      - Consider known breed sensitivities (e.g., large breeds need joint support, small breeds need smaller portions)
      - Account for breed-typical activity levels
      - Note any breed-prone conditions (obesity, diabetes, kidney issues, allergies)
      
      AGE-ADJUSTED NUTRITION REQUIREMENTS:
      ${pet.age && pet.age < 1 ? '- GROWING: Higher protein (28-32%), higher calories, DHA for development, more frequent meals' : ''}
      ${pet.age && pet.age > 7 ? '- SENIOR: Lower calories, higher fiber, joint support (glucosamine), easier to digest proteins' : ''}
      ${!pet.age || (pet.age >= 1 && pet.age <= 7) ? '- ADULT: Balanced maintenance diet, 23-26% protein, controlled portions' : ''}
      
      HEALTH GOAL OPTIMIZATION:
      ${pet.healthGoals.includes('Weight Loss') ? '- WEIGHT LOSS: Target deficit of 15-20%, increase protein %, reduce carbs, high fiber for satiety' : ''}
      ${pet.healthGoals.includes('Weight Gain') ? '- WEIGHT GAIN: Increase calories by 20-30%, add healthy fats, more frequent meals' : ''}
      ${pet.healthGoals.includes('Muscle Building') ? '- MUSCLE BUILDING: High protein (30%+), leucine-rich sources, post-exercise timing' : ''}
      ${pet.healthGoals.includes('Better Coat') ? '- COAT HEALTH: Omega-3/6 balance, biotin, quality protein, zinc' : ''}
      ${pet.healthGoals.includes('Joint Health') ? '- JOINT SUPPORT: Glucosamine, chondroitin, anti-inflammatory omega-3s, maintain ideal weight' : ''}
      ${pet.healthGoals.includes('Digestive Health') ? '- DIGESTIVE HEALTH: Probiotics, prebiotics, highly digestible proteins, avoid common allergens' : ''}
      ${pet.healthGoals.includes('Dental Care') ? '- DENTAL CARE: Crunchy kibble, avoid sticky/sugary foods, raw bones (if applicable)' : ''}
      ${pet.healthGoals.includes('Energy Boost') ? '- ENERGY: Complex carbs, B vitamins, quality proteins, avoid fillers' : ''}
      ${pet.healthGoals.includes('Kidney Support') ? '- KIDNEY SUPPORT: Lower phosphorus, controlled protein quality, increased hydration' : ''}
      ${pet.healthGoals.includes('Urinary Health') ? '- URINARY HEALTH: Controlled minerals, increased water intake, balanced pH' : ''}
      ${pet.healthGoals.includes('Skin Allergies') ? '- ALLERGY MANAGEMENT: Limited ingredients, novel proteins, eliminate common allergens (chicken, beef, wheat, corn, soy)' : ''}
      ${pet.healthGoals.includes('Heart Health') ? '- CARDIAC HEALTH: Taurine (cats), L-carnitine, omega-3s, controlled sodium, avoid grain-free risks' : ''}
      
      ANALYSIS PROTOCOL:
      
      1. VOLUME ESTIMATION (Critical for Accuracy):
         - Use the ${pet.bowlSize} bowl as size reference
         - Small bowl = ~200ml (0.8 cups), Medium = ~350ml (1.5 cups), Large = ~600ml (2.5 cups)
         - Estimate fill percentage (e.g., "60% full medium bowl = 210ml")
         - Account for food density (kibble: 0.3g/ml, wet food: 1.0g/ml, raw meat: 1.1g/ml)
         - Calculate total weight in grams
      
      2. INGREDIENT IDENTIFICATION:
         - Identify each visible component (chicken, beef, kibble brand, vegetables, etc.)
         - Estimate proportion of each ingredient by volume
         - Be specific: "cooked chicken breast" not just "chicken"
      
      3. CALORIE CALCULATION (Use USDA/AAFCO Standards):
         - For each ingredient, use standard values:
           * Dry dog food (kibble): 350-400 cal/100g
           * Wet dog food: 80-120 cal/100g
           * Cooked chicken breast: 165 cal/100g
           * Cooked beef: 250 cal/100g
           * Cooked fish: 140 cal/100g
           * Rice (cooked): 130 cal/100g
           * Sweet potato: 90 cal/100g
           * Carrots: 35 cal/100g
         - Calculate: (ingredient_weight_g * cal_per_100g) / 100
         - Sum all ingredients for TOTAL CALORIES
      
      4. MACRONUTRIENT BREAKDOWN:
         - Calculate from ingredient database values
         - VERIFY: (protein_g × 4) + (carbs_g × 4) + (fat_g × 9) should equal total calories ±10%
         - Typical dog food ratios: 25-30% protein, 40-50% carbs, 10-15% fat (by calories)
         - Typical cat food ratios: 35-45% protein, 30-40% fat, 10-20% carbs (by calories)
         - If verification fails, recalculate proportionally
      
      5. PERSONALIZED ASSESSMENT:
         - Cross-reference all calculations with ${pet.name}'s profile
         - For ${ageCategory} ${pet.type}s (${pet.breed}) weighing ${pet.weight}kg:
         - Daily calorie needs: ${dailyCalorieNeed} cal (age-adjusted maintenance)
         - Per-meal target: ${Math.round(dailyCalorieNeed / 2)} cal (assuming 2 meals/day)
         - If calculation deviates >25%, flag in insights
         - Evaluate meal against active health goals: ${pet.healthGoals.join(", ") || "general wellness"}
         - Consider if ingredients support or conflict with goals
      
      OUTPUT JSON FORMAT:
      {
        "mealName": "Specific descriptive name (e.g., 'Chicken & Rice Bowl')",
        "calories": number (integer, no decimals, scientifically calculated),
        "protein": number (grams, 1 decimal),
        "fat": number (grams, 1 decimal),
        "carbs": number (grams, 1 decimal),
        "ingredients": ["specific ingredient list with quantities"],
        "advice": "Brief personalized nutritional assessment for ${pet.name} (${pet.breed}, ${ageCategory}, ${pet.healthGoals.join('/')}) - reference their specific health goals and life stage",
        "insights": ["3 specific observations about meal balance FOR THIS PET - mention breed, age, or health goals"],
        "fridgeAdvice": ["2 specific additions to optimize meal FOR ${pet.name}'s goals: ${pet.healthGoals.join(', ')}"]
      }
      
      QUALITY STANDARDS:
      - Be conservative in portion estimates (better to underestimate than overestimate)
      - Round calories to nearest 5-10 for portions under 500 cal
      - Show your work: Include calculation reasoning in insights
      - Consistency: Same image should yield same results (±3% variance)
    `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: imageB64 } },
          { text: prompt }
        ]
      },
      config: {
        temperature: 0.2,
        topP: 0.8,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mealName: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            fat: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            advice: { type: Type.STRING },
            insights: { type: Type.ARRAY, items: { type: Type.STRING } },
            fridgeAdvice: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['mealName', 'calories', 'protein', 'fat', 'carbs', 'ingredients', 'advice', 'insights', 'fridgeAdvice']
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      ...data,
      imageUrl: `data:image/jpeg;base64,${imageB64}`
    };
  }

  async generateSpeech(text: string): Promise<Uint8Array | null> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Clinical nutrition report: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) return null;

      return this.decodeBase64(base64Audio);
    } catch (error) {
      console.error("TTS failed", error);
      return null;
    }
  }

  private decodeBase64(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
}

export const gemini = new GeminiService();
