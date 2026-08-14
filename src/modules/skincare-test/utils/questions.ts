import { SkinType, SkinConcern, SkinSensitivity, SkinGoal, SunExposure } from '@/enums';

export interface SkincareOption {
  id: string;
  label: string;
  description?: string;
}

export interface SkincareQuestion {
  id: number;
  title: string;
  subtitle: string;
  type: 'single' | 'multiple';
  key: 'skinType' | 'concerns' | 'sensitivity' | 'goals' | 'sunExposure';
  options: SkincareOption[];
}

export const QUESTIONS: SkincareQuestion[] = [
  {
    id: 1,
    title: "What is your skin type?",
    subtitle: "Select only one",
    type: 'single',
    key: 'skinType',
    options: [
      { id: SkinType.DRY, label: 'Dry (Feels tight, flaky, or rough)' },
      { id: SkinType.OILY, label: 'Oily (Looks shiny, feels greasy all over)' },
      { id: SkinType.COMBINATION, label: 'Combination (Shiny in T-zone, dry on cheeks)' },
      { id: SkinType.NORMAL, label: 'Normal (Balanced, neither too oily nor too dry)' },
      { id: SkinType.SENSITIVE, label: 'Sensitive (Red, irritated, itchy, or easily reacts to products)' }
    ]
  },
  {
    id: 2,
    title: "What are your primary skin concerns?",
    subtitle: "Select all that apply",
    type: 'multiple',
    key: 'concerns',
    options: [
      { id: SkinConcern.ACNE, label: 'Acne, breakouts, or clogged pores' },
      { id: SkinConcern.PIGMENTATION, label: 'Dark spots, hyperpigmentation, or uneven skin tone' },
      { id: SkinConcern.AGING, label: 'Fine lines, wrinkles, or loss of firmness' },
      { id: SkinConcern.REDNESS, label: 'Redness, irritation, or visible blood vessels' },
      { id: SkinConcern.DRYNESS, label: 'Dullness, dry patches, or lack of radiance' }
    ]
  },
  {
    id: 3,
    title: "How does your skin typically react to new skincare products?",
    subtitle: "Select only one",
    key: 'sensitivity',
    type: 'single',
    options: [
      { id: SkinSensitivity.HIGHLY_SENSITIVE, label: 'Very sensitive (often turns red, burns, or breaks out immediately)' },
      { id: SkinSensitivity.MODERATELY_SENSITIVE, label: 'Moderately sensitive (occasionally reacts, depending on ingredients)' },
      { id: SkinSensitivity.RESILIENT, label: 'Resilient (rarely reacts, handles active ingredients well)' },
      { id: SkinSensitivity.UNPREDICTABLE, label: 'Unpredictable (reactions seem random or hard to pin down)' }
    ]
  },
  {
    id: 4,
    title: "What are your primary skin goals? Choose the results you want to see most.",
    subtitle: "Select all that apply",
    key: 'goals',
    type: 'multiple',
    options: [
      { id: SkinGoal.CLEAR_ACNE, label: 'Clear acne and reduce future breakouts' },
      { id: SkinGoal.SMOOTH_LINES, label: 'Smooth fine lines and firm sagging skin' },
      { id: SkinGoal.FADE_SPOTS, label: 'Fade dark spots and achieve a glowing complexion' },
      { id: SkinGoal.CALM_IRRITATION, label: 'Calm irritation and strengthen the skin barrier' },
      { id: SkinGoal.INTENSE_HYDRATION, label: 'Intense hydration and plumpness' }
    ]
  },
  {
    id: 5,
    title: "What is your daily sun exposure level like?",
    subtitle: "Select only one",
    key: 'sunExposure',
    type: 'single',
    options: [
      { id: SunExposure.HIGH, label: 'High (spend several hours outdoors in direct sunlight)' },
      { id: SunExposure.MODERATE, label: 'Moderate (spend some time outdoors, mostly commute or brief walks)' },
      { id: SunExposure.MINIMAL, label: 'Minimal (spend most of the day indoors)' }
    ]
  }
];
