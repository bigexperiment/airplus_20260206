import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { SiteContentService } from './site-content.service';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  private conversationHistory: { role: string; parts: { text: string }[] }[] = [];

  constructor(
    private http: HttpClient,
    private siteContentService: SiteContentService
  ) {}

  private buildSystemInstruction(): string {
    const content = this.siteContentService.getContent();

    const faqsText = content.faqs
      .map(f => `Q: ${f.question}\nA: ${f.answer}`)
      .join('\n\n');

    const servicesText = content.services
      .map(s => `• ${s.title}: ${s.description}`)
      .join('\n');

    const toursText = content.culturalTours
      .map(t => `• ${t.name} (${t.days} days): ${t.description}`)
      .join('\n');

    const statsText = content.stats
      .map(s => `${s.value} ${s.label}`)
      .join(', ');

    const testimonialsText = content.testimonials
      .map(t => `"${t.quote}" — ${t.authorName}, ${t.tripName}`)
      .join('\n');

    return `You are "Yeti" 🏔️ — the adorable, friendly AI assistant for AirPlus Nepal (airplusnepal.com), a premier trekking and adventure company based in Nepal.

PERSONALITY:
- You are cheerful, warm, and helpful — like a cute little yeti who loves the mountains!
- Use occasional mountain/nature emojis (🏔️ ⛰️ 🌄 🥾 🌿 ❄️ 🏕️) but don't overdo it
- Keep responses concise and friendly (2-4 sentences usually)
- Be enthusiastic about Nepal and trekking, but stay informative
- If someone asks something unrelated to travel/Nepal/the company, gently redirect: "That's a fun question! But I'm best at helping with Nepal adventures 🏔️"

COMPANY INFO:
- Company: ${content.companyInfo.name}
- Director: ${content.companyInfo.directorName}
- Phone: ${content.companyInfo.phone}
- Email: ${content.companyInfo.email}
- WhatsApp: +${content.companyInfo.whatsapp}
- Address: ${content.companyInfo.address}
- Registration: ${content.companyInfo.registration}
- License: ${content.companyInfo.license}
- Rating: ${content.ratingScore}/5 from ${content.ratingCount} happy travelers

SERVICES:
${servicesText}

COMPANY STATS:
${statsText}

CULTURAL TOURS:
${toursText}

TESTIMONIALS:
${testimonialsText}

FREQUENTLY ASKED QUESTIONS:
${faqsText}

CTA/MOTTO:
${content.cta.title} — ${content.cta.message}

IMPORTANT RULES:
- Always recommend contacting the company via WhatsApp or email for bookings
- Never make up trek prices or availability — suggest they check the website or contact the team
- If asked about specific trek details you don't know, say "I'd recommend checking our Treks page or reaching out to our team for the latest details! 🥾"
- Be helpful about Nepal travel in general (visa, weather, packing, altitude tips)
- Keep the conversation warm and inviting`;
  }

  sendMessage(userMessage: string): Observable<string> {
    const apiKey = environment.geminiApiKey;

    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      return of('🏔️ Oops! My brain is still warming up. Please check back soon — the team is setting me up!');
    }

    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const requestBody = {
      system_instruction: {
        parts: [{ text: this.buildSystemInstruction() }]
      },
      contents: this.conversationHistory,
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 500
      }
    };

    const url = `${this.apiUrl}?key=${apiKey}`;

    return this.http.post<any>(url, requestBody, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      map(response => {
        const reply = response?.candidates?.[0]?.content?.parts?.[0]?.text
          || "Hmm, I couldn't think of a response 🤔 Try again!";

        // Add model response to history
        this.conversationHistory.push({
          role: 'model',
          parts: [{ text: reply }]
        });

        return reply;
      }),
      catchError(error => {
        console.error('Chatbot API error:', error);
        // Remove failed user message from history
        this.conversationHistory.pop();
        return of('🏔️ Oh no, I stumbled on a rocky path! Please try again in a moment.');
      })
    );
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }
}

