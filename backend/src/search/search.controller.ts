import { Controller, Get, Query, UseGuards, Request, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { SearchService, SearchFilters } from './search.service';

@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async globalSearch(
    @Query('q') query: string,
    @Query('organizationId') organizationId?: string,
    @Query('modules') modules?: string,
    @Query('types') types?: string,
    @Query('limit') limit?: string,
    @Request() req?: any
  ) {
    try {
      if (!query || query.trim().length < 2) {
        return { results: [], total: 0, query: query || '' };
      }

      // Validate limit
      const parsedLimit = limit ? parseInt(limit) : 50;
      if (parsedLimit < 1 || parsedLimit > 100) {
        throw new BadRequestException('Limit must be between 1 and 100');
      }

      const filters: SearchFilters = {};
      if (modules) {
        filters.modules = modules.split(',').filter(m => m.trim().length > 0);
      }
      if (types) {
        filters.types = types.split(',').filter(t => t.trim().length > 0);
      }

      const results = await this.searchService.globalSearch(
        query.trim(),
        req.user.userId,
        organizationId,
        filters,
        parsedLimit
      );

      return {
        results,
        total: results.length,
        query: query.trim()
      };
    } catch (error) {
      console.error('Search error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Search failed');
    }
  }

  @Get('suggestions')
  async getSearchSuggestions(
    @Query('q') query: string,
    @Query('organizationId') organizationId?: string,
    @Request() req?: any
  ) {
    try {
      if (!query || query.trim().length < 2) {
        return { suggestions: [] };
      }

      const suggestions = await this.searchService.getSearchSuggestions(
        query.trim(),
        req.user.userId,
        organizationId
      );

      return { suggestions };
    } catch (error) {
      console.error('Suggestions error:', error);
      return { suggestions: [] };
    }
  }
}