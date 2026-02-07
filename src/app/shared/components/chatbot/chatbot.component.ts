import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatbotService, ChatMessage } from '../../../services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  isOpen = false;
  isLoading = false;
  userInput = '';
  messages: ChatMessage[] = [];
  hasNewMessage = false;
  showGreeting = true;

  // Cute yeti expressions
  yetiMood: 'happy' | 'thinking' | 'waving' = 'waving';

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit(): void {
    // Add welcome message
    this.messages.push({
      role: 'model',
      text: "Namaste! 🏔️ I'm Yeti, your friendly Nepal adventure guide! Ask me anything about treks, tours, or travel tips. I'm here to help! ❄️",
      timestamp: new Date()
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    this.hasNewMessage = false;
    this.showGreeting = false;
    if (this.isOpen) {
      this.yetiMood = 'happy';
      setTimeout(() => {
        const input = document.querySelector('.chat-input input') as HTMLInputElement;
        if (input) input.focus();
      }, 300);
    }
  }

  sendMessage(): void {
    const text = this.userInput.trim();
    if (!text || this.isLoading) return;

    // Add user message
    this.messages.push({
      role: 'user',
      text,
      timestamp: new Date()
    });

    this.userInput = '';
    this.isLoading = true;
    this.yetiMood = 'thinking';

    this.chatbotService.sendMessage(text).subscribe({
      next: (reply) => {
        this.messages.push({
          role: 'model',
          text: reply,
          timestamp: new Date()
        });
        this.isLoading = false;
        this.yetiMood = 'happy';
        if (!this.isOpen) {
          this.hasNewMessage = true;
        }
      },
      error: () => {
        this.messages.push({
          role: 'model',
          text: '🏔️ Oops, something went wrong! Please try again.',
          timestamp: new Date()
        });
        this.isLoading = false;
        this.yetiMood = 'happy';
      }
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat(): void {
    this.chatbotService.clearHistory();
    this.messages = [{
      role: 'model',
      text: "Fresh start! 🌄 What would you like to know about Nepal adventures?",
      timestamp: new Date()
    }];
    this.yetiMood = 'waving';
  }

  private scrollToBottom(): void {
    try {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop =
          this.messageContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }
}

