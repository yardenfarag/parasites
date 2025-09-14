import { Controller, Get, Query, Param, ValidationPipe, UsePipes } from '@nestjs/common';
import { ParasiteService, ParasiteData } from './parasite.service';

@Controller('parasites')
export class ParasiteController {
  constructor(private readonly parasiteService: ParasiteService) {}

  @Get('search')
  @UsePipes(new ValidationPipe({ transform: true }))
  async searchParasites(
    @Query('q') query: string = '',
    @Query('category') category?: string,
  ): Promise<ParasiteData[]> {
    return this.parasiteService.searchParasites(query, category);
  }

  @Get('categories')
  async getCategories(): Promise<string[]> {
    return this.parasiteService.getCategories();
  }

  @Get(':id')
  async getParasiteById(@Param('id') id: string): Promise<ParasiteData | null> {
    return this.parasiteService.getParasiteById(id);
  }

  @Get()
  async getAllParasites(
    @Query('category') category?: string,
  ): Promise<ParasiteData[]> {
    return this.parasiteService.searchParasites('', category);
  }
}
