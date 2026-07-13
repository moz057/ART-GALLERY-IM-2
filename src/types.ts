export interface Artist {
  id: string;
  name: string;
  username: string;
  avatar: string;
  banner: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  artworksCount: number;
  isFollowing?: boolean;
}

export interface Comment {
  id: string;
  artistId: string;
  artistName: string;
  artistAvatar: string;
  artistUsername: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface Artwork {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  tags: string[];
  artistId: string;
  artistName: string;
  artistAvatar: string;
  artistUsername: string;
  likesCount: number;
  commentsCount: number;
  favoritesCount: number;
  viewsCount: number;
  description: string;
  createdAt: string;
  comments: Comment[];
  hasLiked?: boolean;
  hasFavorited?: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'save';
  senderName: string;
  senderAvatar: string;
  senderUsername: string;
  artworkId?: string;
  artworkTitle?: string;
  artworkImage?: string;
  timestamp: string;
  read: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  imageUrl?: string;
}

export interface Conversation {
  id: string;
  artist: Artist;
  messages: Message[];
  unreadCount: number;
}

export interface UserSettings {
  name: string;
  username: string;
  bio: string;
  avatar: string;
  banner: string;
  isMatureEnabled: boolean;
  visibility: 'public' | 'private' | 'unlisted';
  email: string;
}
