export type TimeOfUse = 'day' | 'night' | 'either';

export type IngredientStrengthTier = 1 | 2 | 3;

export type ConflictType =
  | 'irritation_risk'
  | 'efficacy_reduction'
  | 'avoid_same_routine';

export interface Ingredient {
  id: string;
  name: string;
  inci_name?: string | null;
  time_of_use: TimeOfUse;
  photosensitizing: boolean;
  strength_tier: IngredientStrengthTier;
  requires_prescription: boolean;
  requires_spf_pairing: boolean;
  description?: string | null;
  created_at?: string;
}

export interface IngredientConcern {
  ingredient_id: string;
  concern: string;
  relevance_weight: number;
}

export interface ProductIngredient {
  product_id: string;
  ingredient_id: string;
  is_key_ingredient: boolean;
}

export interface IngredientConflict {
  ingredient_a_id: string;
  ingredient_b_id: string;
  conflict_type: ConflictType;
  notes?: string | null;
}

export interface IngredientWithConcerns extends Ingredient {
  concerns: Array<{
    concern: string;
    relevance_weight: number;
  }>;
}

export interface ProductIngredientDetail {
  ingredient_id: string;
  is_key_ingredient: boolean;
  ingredient: Ingredient;
}

export interface IngredientConflictDetail extends IngredientConflict {
  ingredient_a?: Ingredient;
  ingredient_b?: Ingredient;
}
