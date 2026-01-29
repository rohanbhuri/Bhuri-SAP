import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    globalSearch(query: string, organizationId?: string, modules?: string, types?: string, limit?: string, req?: any): Promise<{
        results: import("./search.service").SearchResult[];
        total: number;
        query: string;
    }>;
    getSearchSuggestions(query: string, organizationId?: string, req?: any): Promise<{
        suggestions: string[];
    }>;
}
