import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MessageCountService {
  messageCount = signal<number>(0);

  setMessageCount(count: number) {
    this.messageCount.set(count);
  }
}
