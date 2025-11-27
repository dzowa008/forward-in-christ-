export enum UserTier {
  FREE = 'Digital Citizen',
  PAID = 'Sanctuary Pro'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  tier: UserTier;
  churchBranch: string; // e.g., "Harare Central", "Bulawayo North"
  sanctityPoints: number;
  streakDays: number;
}

export interface Sermon {
  id: string;
  title: string;
  preacher: string;
  series: string; // e.g., "Financial Stewardship"
  thumbnail: string;
  videoUrl: string; // Embed URL or stream
  date: string;
  views: number;
  isLive: boolean;
  transcript?: string; // For AI summarization
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  likes: number;
}

export interface ShortVideo {
  id: string;
  url: string; // Video URL
  description: string;
  creator: string;
  likes: number;
  shares: number;
  type: 'praise' | 'sermon_clip' | 'testimony';
}

export interface ChatGroup {
  id: string;
  name: string;
  type: 'ministry' | 'cell_group' | 'general';
  image: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  members?: string[];
}

export interface ChatMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  isMe: boolean;
  image?: string;
  audio?: string;
  video?: string;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  churchBranch: string;
}

export interface Note {
  id: string;
  sermonId?: string; // Optional link to a sermon
  title: string;
  content: string;
  createdAt: Date;
}

export interface PrayerRequest {
  id: string;
  content: string;
  isPrivate: boolean;
  author: string; // "Anonymous" or Name
  prayedCount: number;
  status: 'active' | 'answered';
  createdAt: Date;
}

export interface KidsStory {
  title: string;
  pages: { text: string; imageUrl: string }[];
}