import { User, UserTier, Sermon, ShortVideo, ChatGroup, ChatMessage, Note, PrayerRequest, Song, Contact } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Tinashe Moyo',
  avatar: 'https://i.pravatar.cc/150?u=u1',
  tier: UserTier.FREE,
  churchBranch: 'Harare Central',
  sanctityPoints: 1250,
  streakDays: 12
};

export const MOCK_SERMONS: Sermon[] = [
  {
    id: 's1',
    title: 'The Power of Faith in Hard Times',
    preacher: 'Pastor Chiwenga',
    series: 'Unshakable Foundations',
    thumbnail: 'https://picsum.photos/seed/sermon1/800/450',
    videoUrl: '#',
    date: '2023-10-22',
    views: 1205,
    isLive: true,
    transcript: "Faith is not the absence of trouble, but the presence of God in the midst of trouble. When we look at the life of Job..."
  },
  {
    id: 's2',
    title: 'Financial Stewardship 101',
    preacher: 'Elder Gwatidzo',
    series: 'Kingdom Finance',
    thumbnail: 'https://picsum.photos/seed/sermon2/800/450',
    videoUrl: '#',
    date: '2023-10-15',
    views: 3400,
    isLive: false,
    transcript: "Money is a tool, not a master. In Zimbabwe, we know the value of stretching a dollar, but God asks us to trust Him with the first fruits..."
  },
  {
    id: 's3',
    title: 'Walking in Love',
    preacher: 'Bishop Ndlovu',
    series: 'The Book of John',
    thumbnail: 'https://picsum.photos/seed/sermon3/800/450',
    videoUrl: '#',
    date: '2023-10-08',
    views: 900,
    isLive: false,
    transcript: "Love is patient. Love is kind. It does not envy..."
  }
];

export const MOCK_SONGS: Song[] = [
    { 
        id: 'song1', 
        title: 'Makanaka Jesu', 
        artist: 'Minister Mahendere', 
        album: 'Getting Personal', 
        thumbnail: 'https://picsum.photos/seed/mahendere/300/300', 
        videoUrl: '#', 
        duration: '5:45', 
        likes: 2400 
    },
    { 
        id: 'song2', 
        title: 'Sungano', 
        artist: 'ZimPraise', 
        album: 'Season 12', 
        thumbnail: 'https://picsum.photos/seed/zimpraise/300/300', 
        videoUrl: '#', 
        duration: '6:30', 
        likes: 5000 
    },
    { 
        id: 'song3', 
        title: 'Ndimi Mwari', 
        artist: 'Takesure Zamar', 
        album: 'Worship Addicts', 
        thumbnail: 'https://picsum.photos/seed/zamar/300/300', 
        videoUrl: '#', 
        duration: '7:15', 
        likes: 3200 
    },
     { 
        id: 'song4', 
        title: 'Mweya Mutsvene', 
        artist: 'Janet Manyowa', 
        album: 'Grateful', 
        thumbnail: 'https://picsum.photos/seed/janet/300/300', 
        videoUrl: '#', 
        duration: '4:20', 
        likes: 1800 
    }
];

export const MOCK_CONTACTS: Contact[] = [
    { id: 'c1', name: 'Mai Chisamba', avatar: 'https://i.pravatar.cc/150?u=c1', status: 'online', churchBranch: 'Harare Central' },
    { id: 'c2', name: 'Elder Banda', avatar: 'https://i.pravatar.cc/150?u=c2', status: 'offline', churchBranch: 'Bulawayo North' },
    { id: 'c3', name: 'Sister Rudo', avatar: 'https://i.pravatar.cc/150?u=c3', status: 'online', churchBranch: 'Harare Central' },
    { id: 'c4', name: 'Brother Farai', avatar: 'https://i.pravatar.cc/150?u=c4', status: 'online', churchBranch: 'Mutare East' },
];

export const MOCK_SHORTS: ShortVideo[] = [
  { id: 'v1', url: '#', description: 'Powerful worship moment at overflow tonight! 🙌 #ZimPraise', creator: 'WorshipTeam', likes: 1200, shares: 300, type: 'praise' },
  { id: 'v2', url: '#', description: 'Pastor said WHAT?! 🔥 Listen to this.', creator: 'DigitalSanctuary', likes: 5000, shares: 1200, type: 'sermon_clip' },
  { id: 'v3', url: '#', description: 'My testimony of healing. God is good!', creator: 'SisterGrace', likes: 800, shares: 50, type: 'testimony' },
];

export const MOCK_GROUPS: ChatGroup[] = [
  { id: 'g1', name: 'Youth Ministry (Harare)', type: 'ministry', image: 'https://picsum.photos/seed/youth/100/100', lastMessage: 'Meeting is at 5PM tomorrow guys!', lastMessageTime: '10:30 AM', unreadCount: 3, members: ['u1', 'c1', 'c3'] },
  { id: 'g2', name: 'Men of Valor', type: 'cell_group', image: 'https://picsum.photos/seed/men/100/100', lastMessage: 'Brother John, we are praying for you.', lastMessageTime: '09:15 AM', unreadCount: 0, members: ['u1', 'c2', 'c4'] },
  { id: 'g3', name: 'Choir Practice', type: 'ministry', image: 'https://picsum.photos/seed/choir/100/100', lastMessage: 'New song sheet attached.', lastMessageTime: 'Yesterday', unreadCount: 1, members: ['u1', 'c1', 'c3', 'c4'] },
];

export const MOCK_MESSAGES: ChatMessage[] = [
  { id: 'm1', groupId: 'g1', senderId: 'u2', senderName: 'Chipo', text: 'Are we still meeting at the main hall?', timestamp: new Date(Date.now() - 3600000), isMe: false },
  { id: 'm2', groupId: 'g1', senderId: 'u1', senderName: 'Tinashe', text: 'Yes, Pastor confirmed it.', timestamp: new Date(Date.now() - 3500000), isMe: true },
  { id: 'm3', groupId: 'g1', senderId: 'u3', senderName: 'Tendai', text: 'Great, I will bring the guitar.', timestamp: new Date(Date.now() - 3400000), isMe: false },
  { id: 'm4', groupId: 'g2', senderId: 'u1', senderName: 'Tinashe', text: 'Bless you brother.', timestamp: new Date(Date.now() - 7200000), isMe: true },
  { id: 'm5', groupId: 'g2', senderId: 'c2', senderName: 'Elder Banda', text: 'Brother John, we are praying for you.', timestamp: new Date(Date.now() - 7100000), isMe: false },
];

export const MOCK_PRAYER_REQUESTS: PrayerRequest[] = [
  { id: 'p1', content: 'Pray for my exam results coming out tomorrow.', isPrivate: false, author: 'Kudzai', prayedCount: 12, status: 'active', createdAt: new Date() },
  { id: 'p2', content: 'Healing for my grandmother in Mutare.', isPrivate: false, author: 'Blessing', prayedCount: 45, status: 'answered', createdAt: new Date(Date.now() - 86400000) },
];