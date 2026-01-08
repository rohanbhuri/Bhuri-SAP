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
    
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    const apiUrl = this.brandConfig.getApiUrl();
    const baseUrl = apiUrl.replace('/api', '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    return `${baseUrl}${normalizedPath}`;
  }
}
