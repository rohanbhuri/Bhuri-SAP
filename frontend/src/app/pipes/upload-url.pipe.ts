import { Pipe, PipeTransform, inject } from '@angular/core';
import { BrandConfigService } from '../services/brand-config.service';

@Pipe({
  name: 'uploadUrl',
  standalone: true
})
export class UploadUrlPipe implements PipeTransform {
  private brandConfig = inject(BrandConfigService);

  transform(path: string | undefined | null): string {
    if (!path) return '';
    
    // Trim any whitespace
    const trimmedPath = path.trim();
    if (!trimmedPath) return '';
    
    // Handle external URLs, protocol-relative URLs, and data URLs
    if (trimmedPath.startsWith('http://') || 
        trimmedPath.startsWith('https://') || 
        trimmedPath.startsWith('//') || 
        trimmedPath.startsWith('data:image/')) {
      return trimmedPath;
    }
    
    const apiUrl = this.brandConfig.getApiUrl();
    const baseUrl = apiUrl.replace('/api', '');
    const normalizedPath = trimmedPath.startsWith('/') ? trimmedPath : `/${trimmedPath}`;
    
    return `${baseUrl}${normalizedPath}`;
  }
}
