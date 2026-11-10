/**
 * Sauce Demo usernames. They are public test data (listed on the login page),
 * so they live in code. The password is a secret, so it comes from env.ts.
 */
export const USERS = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
  error: 'error_user',
  visual: 'visual_user',
} as const;

export type UserKey = keyof typeof USERS;