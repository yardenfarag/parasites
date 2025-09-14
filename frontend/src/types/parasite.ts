export interface Parasite {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  symptoms: string[];
  habitat: string;
  lifecycle: string;
  scientificName?: string;
  transmission?: string;
  prevention?: string[];
  treatment?: string[];
  prevalence?: string;
  riskFactors?: string[];
}
