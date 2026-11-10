import fs from 'node:fs';
import path from 'node:path';

/**
 * Single source of truth for configuration.
 *
 * Locally, values come from the .env file in the project root.
 * In CI there is no .env file: values come from real environment variables
 * (GitHub Actions secrets), so we only load the file if it exists.
 */
const envFilePath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envFilePath)) {
  process.loadEnvFile(envFilePath);
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". ` +
        'Copy .env.example to .env and fill it in (or set it as a CI secret).',
    );
  }
  return value;
}

function optional(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

export const env = {
  saucedemo: {
    baseUrl: optional('SAUCEDEMO_BASE_URL', 'https://www.saucedemo.com'),
    password: required('SAUCEDEMO_PASSWORD'),
  },
  automationExercise: {
    baseUrl: optional('AUTOMATION_EXERCISE_BASE_URL', 'https://automationexercise.com'),
  },
  theInternet: {
    baseUrl: optional('THE_INTERNET_BASE_URL', 'https://the-internet.herokuapp.com'),
  },
} as const;