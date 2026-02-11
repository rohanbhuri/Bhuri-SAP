import { Injectable, inject } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { BrandConfigService } from './brand-config.service';
import { AuthService } from './auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class NotificationSoundService {
  private wsService = inject(WebSocketService);
  private brand = inject(BrandConfigService);
  private auth = inject(AuthService);
  private notificationSound?: HTMLAudioElement;
  private currentUserId?: string;

  constructor() {
    this.initializeNotificationSound();
    this.setupWebSocketListener();
  }

  private initializeNotificationSound() {
    try {
      const soundUrl = `${this.brand.getApiUrl().replace('/api', '')}/system-audio/mixkit-message-pop-alert-2354.mp3`;
      this.notificationSound = new Audio(soundUrl);
      this.notificationSound.volume = 0.5; // Set volume to 50%
      console.log('🔔 Global notification sound initialized:', soundUrl);
      
      // Preload the audio
      this.notificationSound.load();
      
      // Enable audio on first user interaction (Chrome autoplay policy)
      const enableAudio = () => {
        if (this.notificationSound) {
          // Play and immediately pause to "unlock" audio
          this.notificationSound.play().then(() => {
            this.notificationSound!.pause();
            this.notificationSound!.currentTime = 0;
            console.log('✅ Audio enabled after user interaction');
          }).catch(() => {
            console.log('⏳ Waiting for user interaction to enable audio...');
          });
        }
        // Remove listeners after first interaction
        document.removeEventListener('click', enableAudio);
        document.removeEventListener('keydown', enableAudio);
      };
      
      // Listen for any user interaction
      document.addEventListener('click', enableAudio, { once: true });
      document.addEventListener('keydown', enableAudio, { once: true });
      
    } catch (error) {
      console.error('❌ Failed to initialize notification sound:', error);
    }
  }

  private setupWebSocketListener() {
    // Get current user ID
    this.auth.currentUser$.pipe(takeUntilDestroyed()).subscribe(user => {
      this.currentUserId = (user as any)?._id || user?.id || null;
      console.log('👤 NotificationSoundService: Current user ID:', this.currentUserId);
    });

    // Listen for message:new events
    this.wsService.getMessages().pipe(takeUntilDestroyed()).subscribe(message => {
      if (message?.type === 'message:new') {
        console.log('📨 NotificationSoundService: Received message:new event', message.payload);
        this.handleNewMessage(message.payload);
      }
    });
  }

  private handleNewMessage(message: any) {
    try {
      // Extract senderId
      let senderId: string;
      const rawSenderId = message.senderId;
      if (typeof rawSenderId === 'object' && rawSenderId !== null) {
        senderId = rawSenderId._id?.toString() || rawSenderId.toString();
      } else {
        senderId = String(rawSenderId);
      }

      console.log('🔍 NotificationSoundService: Message from:', senderId, 'Current user:', this.currentUserId);

      // Check if message is from another user (not self)
      const isFromOtherUser = String(senderId) !== String(this.currentUserId);

      if (isFromOtherUser) {
        console.log('🔔 NotificationSoundService: Message from other user, playing sound');
        this.playSound();
      } else {
        console.log('🔇 NotificationSoundService: Message from self, skipping sound');
      }
    } catch (error) {
      console.error('❌ NotificationSoundService: Error handling message:', error);
    }
  }

  private playSound() {
    if (this.notificationSound) {
      this.notificationSound.currentTime = 0; // Reset to start
      this.notificationSound.play().catch(error => {
        console.error('❌ Failed to play notification sound:', error);
        // Browser might block autoplay - user needs to interact first
        console.warn('💡 Tip: Click anywhere on the page to enable sound notifications');
      });
      console.log('🔊 Notification sound played');
    } else {
      console.warn('⚠️ Notification sound not initialized');
    }
  }

  // Public method to manually test sound
  testSound() {
    console.log('🧪 Testing notification sound...');
    this.playSound();
  }
}
