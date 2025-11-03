import fs from 'fs';
import path from 'path';

export interface CityIntro {
  slug: string;
  name: string;
  intro: string;
}

let citiesCache: Record<string, CityIntro> | null = null;

export function getCities(): Record<string, CityIntro> {
  if (citiesCache) {
    return citiesCache;
  }

  const citiesPath = path.join(process.cwd(), 'data', 'cities.json');
  const citiesData = fs.readFileSync(citiesPath, 'utf-8');
  citiesCache = JSON.parse(citiesData);
  
  return citiesCache!;
}

export function getCityIntro(slug: string): CityIntro | null {
  const cities = getCities();
  return cities[slug] || null;
}
