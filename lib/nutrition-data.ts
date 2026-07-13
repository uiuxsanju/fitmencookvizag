// ============================================================
// FITMEN COOK — Meal Nutrition Database
// Full nutrition profiles used by the Personalized Nutrition
// Dashboard recommendation engine.
// Replace names / images / prices with your real menu items.
// ============================================================

export type Diet = "veg" | "nonveg" | "vegan" | "egg";

export type MealNutrition = {
  calories: number; // kcal
  protein: number;  // g
  carbs: number;    // g
  fat: number;      // g
  fiber: number;    // g
  sugar: number;    // g
  sodium: number;   // mg
  cholesterol: number; // mg
  calcium: number;  // mg
  iron: number;     // mg
  potassium: number; // mg
  vitA: number;     // mcg RAE
  vitC: number;     // mg
  vitD: number;     // mcg
  vitB12: number;   // mcg
  magnesium: number; // mg
  omega3: number;   // g
};

export type Review = { name: string; stars: number; text: string };

export type Meal = {
  id: string;
  name: string;
  emoji: string;
  image?: string; // e.g. "/meals/grilled-chicken-bowl.jpg"
  tint: string;   // card image tint when no photo
  category: "Breakfast" | "Lunch" | "Dinner" | "Snack" | "Drink";
  diet: Diet;
  price: number;       // ₹
  serving: string;
  prepTime: string;
  spice: 0 | 1 | 2 | 3; // 0 none → 3 hot
  ingredients: string[];
  allergens: string[];  // from ALLERGY_OPTIONS ids
  nutrition: MealNutrition;
  bestFor: string[];
  avoidIf: string[];
  benefits: string[];
  pairWith: string[];
  similar: string[];    // meal ids
  bestTime: string;
  storage: string;
  rating: number;
  reviewCount: number;
  reviews: Review[];
};

export const ALLERGY_OPTIONS = [
  { id: "seafood", label: "Seafood" },
  { id: "dairy", label: "Lactose / Dairy" },
  { id: "gluten", label: "Gluten" },
  { id: "nuts", label: "Nuts" },
  { id: "egg", label: "Egg" },
  { id: "soy", label: "Soy" },
] as const;

export const CONDITION_OPTIONS = [
  { id: "diabetes", label: "Diabetes" },
  { id: "hypertension", label: "High BP / Low-sodium diet" },
  { id: "kidney", label: "Kidney disease" },
  { id: "heart", label: "Heart condition" },
  { id: "thyroid", label: "Thyroid" },
] as const;

export const MEALS: Meal[] = [
  {
    id: "grilled-chicken-bowl",
    name: "Grilled Chicken Power Bowl",
    emoji: "🍗",
    tint: "#f5a50a",
    category: "Lunch",
    diet: "nonveg",
    price: 249,
    serving: "420 g bowl",
    prepTime: "20 min",
    spice: 2,
    ingredients: ["Chicken breast 180g", "Brown rice", "Broccoli", "Bell peppers", "Olive oil", "Peri-peri rub"],
    allergens: [],
    nutrition: { calories: 520, protein: 46, carbs: 44, fat: 16, fiber: 7, sugar: 4, sodium: 480, cholesterol: 110, calcium: 60, iron: 2.8, potassium: 820, vitA: 190, vitC: 85, vitD: 0.4, vitB12: 0.6, magnesium: 95, omega3: 0.3 },
    bestFor: ["Muscle Gain", "High Protein", "Lean Bulk", "Gym Athletes", "Fat Loss"],
    avoidIf: [],
    benefits: ["High Protein", "Muscle Recovery", "Keeps You Full Longer", "Energy Boost"],
    pairWith: ["ABC Detox Juice", "Green Salad", "Whey Shake (post-workout)"],
    similar: ["chicken-keema-rice", "egg-white-wrap"],
    bestTime: "Lunch or 60–90 min post-workout",
    storage: "Refrigerate up to 24 hrs. Reheat 2 min before eating.",
    rating: 4.8,
    reviewCount: 214,
    reviews: [
      { name: "Ravi Teja", stars: 5, text: "Perfect macros for my cut. Chicken is juicy, not dry." },
      { name: "Sandeep K", stars: 5, text: "My daily lunch during prep. 46g protein is unreal for this price." },
    ],
  },
  {
    id: "paneer-tikka-bowl",
    name: "Paneer Tikka Protein Bowl",
    emoji: "🧀",
    tint: "#e2574c",
    category: "Dinner",
    diet: "veg",
    price: 229,
    serving: "400 g bowl",
    prepTime: "18 min",
    spice: 2,
    ingredients: ["Paneer 150g", "Quinoa", "Charred onions", "Capsicum", "Mint dip", "Tandoori spices"],
    allergens: ["dairy"],
    nutrition: { calories: 540, protein: 32, carbs: 42, fat: 26, fiber: 6, sugar: 6, sodium: 520, cholesterol: 55, calcium: 480, iron: 3.2, potassium: 560, vitA: 210, vitC: 60, vitD: 0.3, vitB12: 0.8, magnesium: 110, omega3: 0.2 },
    bestFor: ["Muscle Gain", "High Protein", "Maintenance", "Office Workers"],
    avoidIf: ["Lactose Intolerance"],
    benefits: ["High Protein", "Muscle Recovery", "Rich in Calcium", "Keeps You Full Longer"],
    pairWith: ["Buttermilk (Majjiga)", "Kachumber Salad"],
    similar: ["quinoa-buddha-bowl", "sprouts-chaat"],
    bestTime: "Dinner, 2–3 hrs before sleep",
    storage: "Refrigerate up to 24 hrs. Best eaten fresh & hot.",
    rating: 4.7,
    reviewCount: 168,
    reviews: [
      { name: "Divya", stars: 5, text: "Finally a veg bowl that hits 30g+ protein. Tikka flavour is authentic." },
      { name: "Manohar", stars: 4, text: "Filling dinner, slightly spicy — exactly how I like it." },
    ],
  },
  {
    id: "egg-white-wrap",
    name: "Egg White Omelette Wrap",
    emoji: "🥚",
    tint: "#7fb544",
    category: "Breakfast",
    diet: "egg",
    price: 149,
    serving: "280 g wrap",
    prepTime: "12 min",
    spice: 1,
    ingredients: ["6 egg whites", "Whole-wheat roti", "Spinach", "Tomato", "Onion", "Black pepper"],
    allergens: ["egg", "gluten"],
    nutrition: { calories: 340, protein: 30, carbs: 32, fat: 8, fiber: 5, sugar: 3, sodium: 420, cholesterol: 5, calcium: 120, iron: 3.5, potassium: 480, vitA: 260, vitC: 25, vitD: 0.2, vitB12: 0.4, magnesium: 70, omega3: 0.1 },
    bestFor: ["Weight Loss", "Fat Loss", "High Protein", "Low Carb", "Heart Healthy", "Office Workers"],
    avoidIf: ["Gluten Allergy", "Egg Allergy"],
    benefits: ["High Protein", "Low Fat", "Energy Boost", "Better Digestion"],
    pairWith: ["Black Coffee", "Orange Juice (no sugar)"],
    similar: ["grilled-chicken-bowl", "protein-smoothie-bowl"],
    bestTime: "Breakfast, within 1 hr of waking",
    storage: "Eat fresh. Not recommended for storage.",
    rating: 4.6,
    reviewCount: 142,
    reviews: [
      { name: "Kiran", stars: 5, text: "My 8 AM staple before office. Light but keeps me full till lunch." },
      { name: "Pooja", stars: 4, text: "Great macros for cutting. Wish it had a spicy version!" },
    ],
  },
  {
    id: "fish-curry-bowl",
    name: "Vizag Fish Curry Bowl",
    emoji: "🐟",
    tint: "#2d8fc4",
    category: "Lunch",
    diet: "nonveg",
    price: 279,
    serving: "430 g bowl",
    prepTime: "22 min",
    spice: 3,
    ingredients: ["Vanjaram fish 160g", "Steamed red rice", "Coastal curry", "Curry leaves", "Tamarind", "Gongura"],
    allergens: ["seafood"],
    nutrition: { calories: 490, protein: 38, carbs: 46, fat: 15, fiber: 5, sugar: 4, sodium: 640, cholesterol: 85, calcium: 90, iron: 2.4, potassium: 740, vitA: 120, vitC: 30, vitD: 8.5, vitB12: 3.2, magnesium: 105, omega3: 1.8 },
    bestFor: ["Heart Healthy", "Muscle Gain", "High Protein", "Maintenance", "Gym Athletes"],
    avoidIf: ["Seafood Allergy", "High Sodium Diet", "Kidney Disease"],
    benefits: ["Rich in Omega-3", "High Protein", "Muscle Recovery", "Brain & Heart Health"],
    pairWith: ["Rasam Shot", "Cucumber Salad"],
    similar: ["grilled-chicken-bowl", "chicken-keema-rice"],
    bestTime: "Lunch — omega-3 absorbs best with a full meal",
    storage: "Refrigerate up to 12 hrs. Reheat thoroughly.",
    rating: 4.9,
    reviewCount: 256,
    reviews: [
      { name: "Srinivas", stars: 5, text: "Asalu Vizag taste! Healthy version of amma's fish curry." },
      { name: "Anusha", stars: 5, text: "Omega-3 + that gongura tang. Best seller for a reason." },
    ],
  },
  {
    id: "quinoa-buddha-bowl",
    name: "Quinoa Veg Buddha Bowl",
    emoji: "🥗",
    tint: "#5a9e6f",
    category: "Dinner",
    diet: "vegan",
    price: 199,
    serving: "380 g bowl",
    prepTime: "15 min",
    spice: 1,
    ingredients: ["Quinoa", "Chickpeas", "Roasted sweet potato", "Kale", "Avocado", "Tahini-lemon dressing"],
    allergens: [],
    nutrition: { calories: 460, protein: 18, carbs: 58, fat: 18, fiber: 13, sugar: 8, sodium: 320, cholesterol: 0, calcium: 140, iron: 4.6, potassium: 920, vitA: 480, vitC: 55, vitD: 0, vitB12: 0, magnesium: 130, omega3: 0.4 },
    bestFor: ["Weight Loss", "Heart Healthy", "Diabetic Friendly", "Maintenance", "Office Workers"],
    avoidIf: [],
    benefits: ["Rich in Fiber", "Better Digestion", "Plant Protein", "Keeps You Full Longer"],
    pairWith: ["ABC Detox Juice", "Lemon Mint Cooler"],
    similar: ["sprouts-chaat", "paneer-tikka-bowl"],
    bestTime: "Dinner — light, fiber-rich, easy to digest",
    storage: "Refrigerate up to 24 hrs. Dressing packed separately.",
    rating: 4.5,
    reviewCount: 121,
    reviews: [
      { name: "Meghana", stars: 5, text: "13g fiber! My gut has never been happier. Dressing is addictive." },
      { name: "Arjun", stars: 4, text: "Clean vegan dinner. Would love a bigger portion option." },
    ],
  },
  {
    id: "chicken-keema-rice",
    name: "Chicken Keema Brown Rice",
    emoji: "🍛",
    tint: "#c47a2d",
    category: "Lunch",
    diet: "nonveg",
    price: 259,
    serving: "450 g bowl",
    prepTime: "25 min",
    spice: 2,
    ingredients: ["Lean chicken keema 170g", "Brown rice", "Green peas", "Ginger-garlic", "Garam masala", "Coriander"],
    allergens: [],
    nutrition: { calories: 580, protein: 42, carbs: 56, fat: 18, fiber: 8, sugar: 5, sodium: 540, cholesterol: 95, calcium: 55, iron: 3.6, potassium: 760, vitA: 150, vitC: 35, vitD: 0.3, vitB12: 0.7, magnesium: 100, omega3: 0.2 },
    bestFor: ["Muscle Gain", "Lean Bulk", "High Protein", "Gym Athletes"],
    avoidIf: ["High Sodium Diet"],
    benefits: ["High Protein", "Muscle Recovery", "Energy Boost", "Keeps You Full Longer"],
    pairWith: ["Boiled Egg Add-on", "Whey Shake"],
    similar: ["grilled-chicken-bowl", "fish-curry-bowl"],
    bestTime: "Lunch or pre-workout (2 hrs before)",
    storage: "Refrigerate up to 24 hrs. Reheat 2–3 min.",
    rating: 4.7,
    reviewCount: 189,
    reviews: [
      { name: "Vamsi", stars: 5, text: "580 cal of pure bulking fuel. Keema is perfectly spiced." },
      { name: "Harsha", stars: 5, text: "My bulk-season lunch every single day. Never gets boring." },
    ],
  },
  {
    id: "protein-smoothie-bowl",
    name: "Whey Berry Smoothie Bowl",
    emoji: "🫐",
    tint: "#8e5ac4",
    category: "Snack",
    diet: "veg",
    price: 189,
    serving: "320 g bowl",
    prepTime: "8 min",
    spice: 0,
    ingredients: ["Whey isolate 1 scoop", "Frozen berries", "Banana", "Greek yogurt", "Chia seeds", "Granola"],
    allergens: ["dairy", "nuts", "gluten"],
    nutrition: { calories: 380, protein: 28, carbs: 44, fat: 10, fiber: 8, sugar: 18, sodium: 160, cholesterol: 30, calcium: 320, iron: 2.2, potassium: 620, vitA: 90, vitC: 45, vitD: 0.5, vitB12: 1.1, magnesium: 85, omega3: 1.2 },
    bestFor: ["Muscle Gain", "High Protein", "Gym Athletes", "Maintenance"],
    avoidIf: ["Lactose Intolerance", "Gluten Allergy", "Nut Allergy", "Diabetic — high natural sugar"],
    benefits: ["High Protein", "Muscle Recovery", "Antioxidant Rich", "Energy Boost"],
    pairWith: ["Post-workout — nothing else needed"],
    similar: ["egg-white-wrap", "sprouts-chaat"],
    bestTime: "Within 30 min post-workout",
    storage: "Eat immediately. Melts fast!",
    rating: 4.6,
    reviewCount: 97,
    reviews: [
      { name: "Nikhil", stars: 5, text: "Post-gym treat that's actually on-plan. Berries + whey = 🔥" },
      { name: "Swathi", stars: 4, text: "Tastes like dessert, macros like a supplement." },
    ],
  },
  {
    id: "sprouts-chaat",
    name: "Sprouts & Peanut Power Chaat",
    emoji: "🌱",
    tint: "#44a08d",
    category: "Snack",
    diet: "vegan",
    price: 119,
    serving: "250 g cup",
    prepTime: "10 min",
    spice: 2,
    ingredients: ["Moong sprouts", "Roasted peanuts", "Pomegranate", "Onion", "Lemon", "Chaat masala"],
    allergens: ["nuts"],
    nutrition: { calories: 260, protein: 14, carbs: 30, fat: 10, fiber: 9, sugar: 7, sodium: 280, cholesterol: 0, calcium: 80, iron: 2.8, potassium: 540, vitA: 40, vitC: 38, vitD: 0, vitB12: 0, magnesium: 90, omega3: 0.1 },
    bestFor: ["Weight Loss", "Fat Loss", "Diabetic Friendly", "Heart Healthy", "Office Workers", "Low Carb"],
    avoidIf: ["Nut Allergy"],
    benefits: ["Rich in Fiber", "Better Digestion", "Low Calorie", "Keeps You Full Longer"],
    pairWith: ["Green Tea", "Lemon Mint Cooler"],
    similar: ["quinoa-buddha-bowl", "egg-white-wrap"],
    bestTime: "4–6 PM evening snack — kills junk cravings",
    storage: "Refrigerate up to 8 hrs. Add lemon just before eating.",
    rating: 4.4,
    reviewCount: 84,
    reviews: [
      { name: "Lakshmi", stars: 5, text: "Evening snack sorted. 260 cal and I'm full till dinner." },
      { name: "Rahul", stars: 4, text: "Crunchy, tangy, guilt-free. Office snack game changed." },
    ],
  },
];