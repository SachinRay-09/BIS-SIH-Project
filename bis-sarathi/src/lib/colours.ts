// BIS Sarathi colour token set
// Mirrors values from globals.css CSS variables
export const colours = {
  primary:         '#1B2A4A',   // Deep navy — BIS blue
  accent:          '#FF671F',   // Saffron — Indian flag saffron
  background:      '#F8F9FA',   // Off-white
  surface:         '#FFFFFF',   // White
  border:          '#E2E8F0',
  textPrimary:     '#1A1A2E',
  textSecondary:   '#64748B',
  success:         '#15803D',   // Green — official records only
  warning:         '#B45309',   // Amber — demo/mock records
  abstain:         '#7C3AED',   // Purple-neutral — abstention (not error)
  bisLims:         '#1D4ED8',   // Blue — PUBLIC_BIS_LIMS badge
  synthetic:       '#64748B',   // Grey — SYNTHETIC badge
} as const

export type ColourToken = typeof colours
export type ColourKey = keyof ColourToken
