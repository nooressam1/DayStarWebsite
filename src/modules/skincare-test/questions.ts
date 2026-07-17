import { SkincareQuestion } from "@/utils/types/componentType";

export const QUESTIONS: SkincareQuestion[] = [
  {
    id: 1,
    title: "What is your skin type?",
    subtitle: "Select only one",
    type: 'single',
    key: 'skinType',
    options: [
      { id: 'dry', label: 'Dry (Feels tight, flaky, or rough)' },
      { id: 'oily', label: 'Oily (Looks shiny, feels greasy all over)' },
      { id: 'combination', label: 'Combination (Shiny in T-zone, dry on cheeks)' },
      { id: 'normal', label: 'Normal (Balanced, neither too oily nor too dry)' },
      { id: 'sensitive', label: 'Sensitive (Red, irritated, itchy, or easily reacts to products)' }
    ]
  },
  {
    id: 2,
    title: "What are your primary skin concerns?",
    subtitle: "Select all that apply",
    type: 'multiple',
    key: 'concerns',
    options: [
      { id: 'acne', label: 'Acne, breakouts, or clogged pores' },
      { id: 'pigmentation', label: 'Dark spots, hyperpigmentation, or uneven skin tone' },
      { id: 'aging', label: 'Fine lines, wrinkles, or loss of firmness' },
      { id: 'redness', label: 'Redness, irritation, or visible blood vessels' },
      { id: 'dryness', label: 'Dullness, dry patches, or lack of radiance' }
    ]
  },
  {
    id: 3,
    title: "How does your skin typically react to new skincare products?",
    subtitle: "Select only one",
    key: 'sensitivity',
    type: 'single',
    options: [
      { id: 'highly_sensitive', label: 'Very sensitive (often turns red, burns, or breaks out immediately)' },
      { id: 'moderately_sensitive', label: 'Moderately sensitive (occasionally reacts, depending on ingredients)' },
      { id: 'resilient', label: 'Resilient (rarely reacts, handles active ingredients well)' },
      { id: 'unpredictable', label: 'Unpredictable (reactions seem random or hard to pin down)' }
    ]
  },
  {
    id: 4,
    title: "What are your primary skin goals? Choose the results you want to see most.",
    subtitle: "Select all that apply",
    key: 'goals',
    type: 'multiple',
    options: [
      { id: 'clear_acne', label: 'Clear acne and reduce future breakouts' },
      { id: 'smooth_lines', label: 'Smooth fine lines and firm sagging skin' },
      { id: 'fade_spots', label: 'Fade dark spots and achieve a glowing complexion' },
      { id: 'calm_irritation', label: 'Calm irritation and strengthen the skin barrier' },
      { id: 'intense_hydration', label: 'Intense hydration and plumpness' }
    ]
  },
  {
    id: 5,
    title: "What is your daily sun exposure level like?",
    subtitle: "Select only one",
    key: 'sunExposure',
    type: 'single',
    options: [
      { id: 'high', label: 'High (spend several hours outdoors in direct sunlight)' },
      { id: 'moderate', label: 'Moderate (spend some time outdoors, mostly commute or brief walks)' },
      { id: 'minimal', label: 'Minimal (spend most of the day indoors)' }
    ]
  }
];
