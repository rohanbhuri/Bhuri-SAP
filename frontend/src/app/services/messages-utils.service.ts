import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MessagesUtilsService {
  
  getOrgInitials(orgName: string): string {
    if (!orgName) return 'ORG';
    return orgName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  getOrgGradient(orgName: string): string {
    const colors = ['#667eea,#764ba2', '#f093fb,#f5576c', '#4facfe,#00f2fe', '#43e97b,#38f9d7'];
    const index = orgName.length % colors.length;
    return `linear-gradient(135deg, ${colors[index]})`;
  }

  avatarUrl(email: string): string {
    const hash = encodeURIComponent(email || 'user');
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=40`;
  }

  filterMembers(members: any[], query: string) {
    if (!query.trim()) return members;
    const q = query.toLowerCase();
    return members.filter(m => 
      `${m.firstName} ${m.lastName} ${m.email}`.toLowerCase().includes(q)
    );
  }

  getAttachmentIcon(type: string): string {
    if (type.startsWith('image/')) return 'image';
    if (type.includes('pdf')) return 'picture_as_pdf';
    if (type.includes('document') || type.includes('word')) return 'description';
    return 'attach_file';
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'sending': return 'schedule';
      case 'sent': return 'check';
      case 'delivered': return 'done_all';
      case 'read': return 'done_all';
      default: return 'check';
    }
  }
}
