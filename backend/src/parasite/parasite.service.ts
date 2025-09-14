import { Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ParasiteData {
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

@Injectable()
export class ParasiteService {
  private readonly logger = new Logger(ParasiteService.name);
  private readonly WIKIPEDIA_API_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary';
  private readonly WIKIPEDIA_SEARCH_URL = 'https://en.wikipedia.org/w/api.php';

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async searchParasites(query: string, category?: string): Promise<ParasiteData[]> {
    const cacheKey = `parasites:search:${query}:${category || 'all'}`;
    const cached = await this.cacheManager.get<ParasiteData[]>(cacheKey);
    
    if (cached) {
      this.logger.log(`Returning cached results for query: ${query}`);
      return cached;
    }

    try {
      // Search Wikipedia for parasite-related articles
      const searchResults = await this.searchWikipedia(query);
      const parasites: ParasiteData[] = [];

      for (const result of searchResults.slice(0, 10)) { // Limit to 10 results
        try {
          const parasiteData = await this.getParasiteDetails(result.title);
          if (parasiteData && (!category || parasiteData.category === category)) {
            parasites.push(parasiteData);
          }
        } catch (error) {
          this.logger.warn(`Failed to fetch details for ${result.title}: ${error.message}`);
        }
      }

      // Cache results for 1 hour
      await this.cacheManager.set(cacheKey, parasites, 3600000);
      
      this.logger.log(`Found ${parasites.length} parasites for query: ${query}`);
      return parasites;
    } catch (error) {
      this.logger.error(`Error searching parasites: ${error.message}`);
      return this.getMockParasites(query, category);
    }
  }

  async getParasiteById(id: string): Promise<ParasiteData | null> {
    const cacheKey = `parasite:${id}`;
    const cached = await this.cacheManager.get<ParasiteData>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const parasiteData = await this.getParasiteDetails(id);
      if (parasiteData) {
        await this.cacheManager.set(cacheKey, parasiteData, 3600000);
      }
      return parasiteData;
    } catch (error) {
      this.logger.error(`Error fetching parasite ${id}: ${error.message}`);
      return null;
    }
  }

  async getCategories(): Promise<string[]> {
    const cacheKey = 'parasite:categories';
    const cached = await this.cacheManager.get<string[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const categories = ['Protozoa', 'Nematode', 'Bacteria', 'Virus', 'Fungus', 'Helminth'];
    await this.cacheManager.set(cacheKey, categories, 3600000);
    return categories;
  }

  private async searchWikipedia(query: string): Promise<any[]> {
    try {
      const response = await axios.get(this.WIKIPEDIA_SEARCH_URL, {
        params: {
          action: 'query',
          format: 'json',
          list: 'search',
          srsearch: `${query} parasite bacteria microorganism`,
          srlimit: 20,
          srnamespace: 0,
        },
      });

      return response.data.query?.search || [];
    } catch (error) {
      this.logger.error(`Wikipedia search error: ${error.message}`);
      return [];
    }
  }

  private async getParasiteDetails(title: string): Promise<ParasiteData | null> {
    try {
      const response = await axios.get(`${this.WIKIPEDIA_API_URL}/${encodeURIComponent(title)}`);
      const data = response.data;

      if (!data || data.type !== 'standard') {
        return null;
      }

      // Extract basic information
      const parasite: ParasiteData = {
        id: title.toLowerCase().replace(/\s+/g, '-'),
        name: data.title,
        category: this.categorizeParasite(data.extract, title),
        description: data.extract,
        image: data.thumbnail?.source || this.getDefaultImage(data.title),
        symptoms: this.extractSymptoms(data.extract),
        habitat: this.extractHabitat(data.extract),
        lifecycle: this.extractLifecycle(data.extract),
        scientificName: this.extractScientificName(data.extract, title),
        prevalence: this.extractPrevalence(data.extract),
      };

      return parasite;
    } catch (error) {
      this.logger.warn(`Failed to fetch Wikipedia data for ${title}: ${error.message}`);
      return null;
    }
  }

  private categorizeParasite(extract: string, title: string): string {
    const text = (extract + ' ' + title).toLowerCase();
    
    if (text.includes('bacteria') || text.includes('bacterial')) return 'Bacteria';
    if (text.includes('virus') || text.includes('viral')) return 'Virus';
    if (text.includes('protozoa') || text.includes('protozoan')) return 'Protozoa';
    if (text.includes('nematode') || text.includes('roundworm')) return 'Nematode';
    if (text.includes('fungus') || text.includes('fungal')) return 'Fungus';
    if (text.includes('helminth') || text.includes('tapeworm') || text.includes('fluke')) return 'Helminth';
    
    return 'Microorganism';
  }

  private extractSymptoms(extract: string): string[] {
    const symptoms: string[] = [];
    const symptomKeywords = [
      'fever', 'diarrhea', 'nausea', 'vomiting', 'abdominal pain', 'headache',
      'muscle aches', 'fatigue', 'rash', 'swelling', 'inflammation', 'cough',
      'difficulty breathing', 'chills', 'sweating', 'weight loss', 'anemia'
    ];

    symptomKeywords.forEach(symptom => {
      if (extract.toLowerCase().includes(symptom)) {
        symptoms.push(symptom);
      }
    });

    return symptoms.slice(0, 5); // Limit to 5 symptoms
  }

  private extractHabitat(extract: string): string {
    const habitatKeywords = [
      'tropical', 'subtropical', 'temperate', 'worldwide', 'developing countries',
      'poor sanitation', 'contaminated water', 'soil', 'food', 'animals'
    ];

    for (const keyword of habitatKeywords) {
      if (extract.toLowerCase().includes(keyword)) {
        return `Found in ${keyword} regions`;
      }
    }

    return 'Distribution varies by species';
  }

  private extractLifecycle(extract: string): string {
    if (extract.toLowerCase().includes('mosquito')) return 'Transmitted by mosquitoes';
    if (extract.toLowerCase().includes('contaminated')) return 'Transmitted through contaminated sources';
    if (extract.toLowerCase().includes('direct')) return 'Direct life cycle';
    if (extract.toLowerCase().includes('complex')) return 'Complex life cycle';
    
    return 'Life cycle varies by species';
  }

  private extractScientificName(extract: string, title: string): string {
    // Look for italicized scientific names in the extract
    const scientificMatch = extract.match(/([A-Z][a-z]+ [a-z]+)/);
    return scientificMatch ? scientificMatch[1] : title;
  }

  private extractPrevalence(extract: string): string {
    if (extract.toLowerCase().includes('common')) return 'Common';
    if (extract.toLowerCase().includes('rare')) return 'Rare';
    if (extract.toLowerCase().includes('endemic')) return 'Endemic';
    return 'Variable';
  }

  private getDefaultImage(title: string): string {
    // Return a placeholder image based on category
    return `https://via.placeholder.com/300x200/1a1a1a/00ff88?text=${encodeURIComponent(title)}`;
  }

  private getMockParasites(query: string, category?: string): ParasiteData[] {
    const mockParasites: ParasiteData[] = [
      {
        id: 'toxoplasma-gondii',
        name: 'Toxoplasma gondii',
        category: 'Protozoa',
        description: 'A parasitic protozoan that causes toxoplasmosis, one of the most common parasitic infections in humans.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Toxoplasma_gondii_tachyzoites.jpg/300px-Toxoplasma_gondii_tachyzoites.jpg',
        symptoms: ['Fever', 'Muscle aches', 'Swollen lymph nodes'],
        habitat: 'Found worldwide, particularly in warm climates',
        lifecycle: 'Complex lifecycle involving cats as definitive hosts',
        scientificName: 'Toxoplasma gondii',
        prevalence: 'Common'
      },
      {
        id: 'plasmodium-falciparum',
        name: 'Plasmodium falciparum',
        category: 'Protozoa',
        description: 'The deadliest species of malaria parasite, responsible for the most severe form of malaria.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Plasmodium_falciparum_01.png/300px-Plasmodium_falciparum_01.png',
        symptoms: ['High fever', 'Chills', 'Sweating', 'Headache', 'Nausea'],
        habitat: 'Tropical and subtropical regions',
        lifecycle: 'Transmitted by Anopheles mosquitoes',
        scientificName: 'Plasmodium falciparum',
        prevalence: 'Endemic'
      },
      {
        id: 'ascaris-lumbricoides',
        name: 'Ascaris lumbricoides',
        category: 'Nematode',
        description: 'The giant roundworm, one of the most common human parasites worldwide.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Ascaris_lumbricoides.jpg/300px-Ascaris_lumbricoides.jpg',
        symptoms: ['Abdominal pain', 'Nausea', 'Vomiting', 'Diarrhea'],
        habitat: 'Found worldwide, especially in areas with poor sanitation',
        lifecycle: 'Direct life cycle, eggs ingested from contaminated soil',
        scientificName: 'Ascaris lumbricoides',
        prevalence: 'Common'
      },
      {
        id: 'escherichia-coli-o157h7',
        name: 'Escherichia coli O157:H7',
        category: 'Bacteria',
        description: 'A pathogenic strain of E. coli that can cause severe foodborne illness.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Ecoli_colonies.png/300px-Ecoli_colonies.png',
        symptoms: ['Severe diarrhea', 'Abdominal cramps', 'Vomiting', 'Fever'],
        habitat: 'Intestines of cattle and other ruminants',
        lifecycle: 'Reproduces rapidly in contaminated food and water',
        scientificName: 'Escherichia coli O157:H7',
        prevalence: 'Common'
      }
    ];

    let filtered = mockParasites;
    
    if (query) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    return filtered;
  }
}
