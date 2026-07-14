import { Artist, Artwork, Comment, Notification, Conversation } from '../types';

// Let's define the list of categories
export const CATEGORIES = [
  'For You',
  'All',
  'Digital Art',
  'Anime',
  'Photography',
  'Traditional Art',
  'Character Design',
  'Landscape',
  'Fan Art',
  'Pixel Art',
  '3D Art',
  'Architecture',
  'Vehicles',
  'Fantasy',
  'Sci-Fi',
  'Nature',
  'Food',
  'Fashion'
];

// Curated stunning Unsplash images for each category to ensure high aesthetic fidelity
const CATEGORY_IMAGES: Record<string, string[]> = {
  'Digital Art': [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&auto=format&fit=crop&q=80',
  ],
  'Anime': [
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80',
  ],
  'Photography': [
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&auto=format&fit=crop&q=80',
  ],
  'Traditional Art': [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579783922761-1fc45b0a3242?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
  ],
  'Character Design': [
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1569173112611-52a7cd38bea9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
  ],
  'Landscape': [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472214222541-d510753a4707?w=800&auto=format&fit=crop&q=80',
  ],
  'Fan Art': [
    'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
  ],
  'Pixel Art': [
    'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80',
  ],
  '3D Art': [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005198143-d366b2a382e7?w=800&auto=format&fit=crop&q=80',
  ],
  'Architecture': [
    'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
  ],
  'Vehicles': [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&auto=format&fit=crop&q=80',
  ],
  'Fantasy': [
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
  ],
  'Sci-Fi': [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&auto=format&fit=crop&q=80',
  ],
  'Nature': [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop&q=80',
  ],
  'Food': [
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
  ],
  'Fashion': [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800&auto=format&fit=crop&q=80',
  ]
};

// Curated avatar list to be highly aesthetic and diverse
const AVATAR_IMAGES = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
];

// Curated beautiful banner images
const BANNER_IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&auto=format&fit=crop&q=80'
];

const FIRST_NAMES = [
  'Aria', 'Kaelen', 'Seraphina', 'Dante', 'Elysia', 'Zephyr', 'Nova', 'Caspian', 'Luna', 'Orion',
  'Iris', 'Phoenix', 'Lyra', 'Valen', 'Thalia', 'Ronan', 'Freya', 'Kael', 'Maeve', 'Gideon',
  'Sylas', 'Elena', 'Marcus', 'Chloe', 'Zane', 'Yuna', 'Leif', 'Sienna', 'Ashton', 'Myra',
  'Kiran', 'Naomi', 'Tariq', 'Sasha', 'Juno', 'Bastian', 'Vesper', 'Dorian', 'Rhea', 'Sterling',
  'Genevieve', 'Kai', 'Amara', 'Ronen', 'Nesta', 'Evander', 'Seren', 'Calypso', 'Atlas', 'Ember'
];

const LAST_NAMES = [
  'Vance', 'Aethelgard', 'Kincaid', 'Sterling', 'Blackwood', 'Hawthorne', 'Shadowend', 'Lumina',
  'Crestwood', 'Storm', 'Winter', 'Rostova', 'Takahashi', 'Chen', 'Okoye', 'Fernandez', 'Vega',
  'Novak', 'Dubois', 'Bianchi', 'Saito', 'Mercer', 'Devereux', 'Aris', 'Pendleton', 'Sinclair',
  'Valerius', 'Sovereign', 'Kross', 'Thorne', 'Frost', 'Vesper', 'Vanderbilt', 'Drake', 'Cross'
];

const BIOS = [
  'Digital painter and world-builder. Exploring the nexus of mythology and cyberpunk.',
  'Concept artist in the gaming industry. Lover of atmospheric lighting and epic scales.',
  '3D sculptor and procedural design enthusiast. Crafting abstract futuristic forms.',
  'Traditional oil painter venturing into pixel art. Finding beauty in constraints.',
  'Pixel wizard and retro game dev. Making tiny blocks feel incredibly alive.',
  'Architect by day, fantasy concept designer by night. Structured magic is my specialty.',
  'Street and landscape photographer capturing quiet, cinematic moments in crowded cities.',
  'Character specialist and illustrator. Bringing stories to life through expressions and fashion.',
  'Sci-Fi world architect. Designing the spaceships and colonies we will live in tomorrow.',
  'Anime and manga style illustrator. Loving vibrant colors, high energy, and expressive eyes.'
];

const ARTWORK_NOUNS: Record<string, string[]> = {
  'Digital Art': ['Eternity', 'Synthesis', 'Flow', 'Glow', 'Void', 'Shatter', 'Rhythm', 'Metamorphosis', 'Pulse', 'Chroma'],
  'Anime': ['Dreamer', 'Samurai', 'Ronin', 'Academy', 'Princess', 'Horizon', 'Heart', 'Starlight', 'Nostalgia', 'Vanguard'],
  'Photography': ['Silence', 'Solitude', 'Contrast', 'Reflection', 'Mist', 'Morning', 'Shadows', 'Gaze', 'Perspective', 'Tide'],
  'Traditional Art': ['Sorrow', 'Grace', 'Rebirth', 'Decay', 'Harmony', 'Tension', 'Epoch', 'Devotion', 'Ode', 'Remembrance'],
  'Character Design': ['Sentinel', 'Mage', 'Wanderer', 'Outlaw', 'Commander', 'Oracle', 'Hunter', 'Duchess', 'Rebel', 'Deity'],
  'Landscape': ['Valley', 'Sanctuary', 'Ridge', 'Canyon', 'Abyss', 'Fjord', 'Wilderness', 'Peak', 'Oasis', 'Tundra'],
  'Fan Art': ['Tribute', 'Redux', 'Homage', 'Legend', 'Saga', 'Chronicle', 'Ascent', 'Destiny', 'Legacy', 'Echo'],
  'Pixel Art': ['Quest', 'Keep', 'Dungeon', 'Cabin', 'Arcade', 'Shrine', 'Breeze', 'Lighthouse', 'Campfire', 'Nostalgia'],
  '3D Art': ['Dimension', 'Structure', 'Form', 'Topology', 'Prism', 'Lattice', 'Anomaly', 'Symmetry', 'Grid', 'Vertex'],
  'Architecture': ['Pavilion', 'Tower', 'Spire', 'Dome', 'Plaza', 'Monolith', 'Sanctum', 'Atrium', 'Vault', 'Façade'],
  'Vehicles': ['Cruiser', 'Interceptor', 'Rover', 'Engine', 'Vessel', 'Chariot', 'Skiff', 'Locomotive', 'Interceptor', 'Glider'],
  'Fantasy': ['Griffin', 'Covenant', 'Keep', 'Forest', 'Artifact', 'Sigil', 'Rune', 'Realm', 'Prophecy', 'Eclipse'],
  'Sci-Fi': ['Nexus', 'Singularity', 'Warp', 'Nebula', 'Station', 'Beacon', 'Protocol', 'Android', 'Sector', 'Horizon'],
  'Nature': ['Bloom', 'Sprout', 'Glade', 'Canopy', 'Coral', 'Moss', 'Fern', 'Reef', 'Seasons', 'Cascade'],
  'Food': ['Feast', 'Baking', 'Harvest', 'Still Life', 'Delicacy', 'Infusion', 'Confection', 'Gathering', 'Essence', 'Platter'],
  'Fashion': ['Silhouette', 'Couture', 'Vogue', 'Garm', 'Texture', 'Drape', 'Thread', 'Ensemble', 'Palette', 'Gait']
};

const ARTWORK_ADJECTIVES = [
  'Ethereal', 'Cybernetic', 'Neon', 'Forgotten', 'Golden', 'Prismatic', 'Obsidian', 'Luminous', 'Serene', 'Submerged',
  'Infinite', 'Astral', 'Crimson', 'Azure', 'Silent', 'Dynamic', 'Retro', 'Epic', 'Mystic', 'Cosmic',
  'Haunting', 'Vibrant', 'Gilded', 'Shattered', 'Dusk', 'Dawn', 'Ancient', 'Wandering', 'Velvet', 'Monolithic'
];

const DUMMY_COMMENTS = [
  'This lighting is absolutely incredible! How did you achieve this glow?',
  'The brushwork and textures here are just outstanding. Inspiring work!',
  'Instant save. This fits perfectly with the aesthetic I love.',
  'Absolutely brilliant composition! Keep them coming!',
  'The details on the edges are amazing. I can stare at this for hours.',
  'The mood of this piece is so calming yet slightly melancholic. Exceptional!',
  'Wow, pure masterpiece. Your progress is phenomenal!',
  'Stunning color palette! It blends so perfectly.',
  'This is highly creative, never seen this concept executed so well.',
  'So clean! The dynamic range is beautiful.'
];

// Generate 50 realistic artists
export const generateArtists = (): Artist[] => {
  const artists: Artist[] = [];
  
  // Create a prominent mock current user first
  artists.push({
    id: 'user-current',
    name: 'Alex Mercer',
    username: 'alexmercer_art',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    banner: BANNER_IMAGES[0],
    bio: 'Visual artist, designer and storyteller. Seeking the poetic in futuristic, mechanical, and natural landscapes.',
    followersCount: 1420,
    followingCount: 382,
    artworksCount: 24,
    isFollowing: false
  });

  // Create a moderator account
  artists.push({
    id: 'user-moderator',
    name: 'Admin Moderator',
    username: 'moderator_admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    banner: BANNER_IMAGES[1],
    bio: 'Official VIVID Community Moderator.',
    followersCount: 10000,
    followingCount: 0,
    artworksCount: 0,
    isFollowing: false,
    isModerator: true
  });

  for (let i = 2; i < 50; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}_${i}`;
    const avatar = AVATAR_IMAGES[i % AVATAR_IMAGES.length];
    const banner = BANNER_IMAGES[i % BANNER_IMAGES.length];
    const bio = BIOS[i % BIOS.length];
    
    artists.push({
      id: `artist-${i}`,
      name: `${firstName} ${lastName}`,
      username,
      avatar,
      banner,
      bio,
      followersCount: Math.floor(Math.random() * 4500) + 120,
      followingCount: Math.floor(Math.random() * 800) + 50,
      artworksCount: Math.floor(Math.random() * 80) + 5,
      isFollowing: Math.random() > 0.6
    });
  }
  
  return artists;
};

// Generate 100 artwork cards with custom data
export const generateArtworks = (artists: Artist[]): Artwork[] => {
  const artworks: Artwork[] = [];
  
  // Ensure we get dynamic titles and matching categories
  let imgIndexMap: Record<string, number> = {};
  
  for (let i = 0; i < 100; i++) {
    const isCurrentUser = i % 15 === 0;
    const artist = isCurrentUser ? artists[0] : artists[1 + (i % (artists.length - 1))];
    
    // Choose a valid content category (not 'For You' or 'All')
    const activeCategories = CATEGORIES.slice(2);
    const category = activeCategories[i % activeCategories.length];
    
    // Get image matching category
    const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES['Digital Art'];
    if (!imgIndexMap[category]) {
      imgIndexMap[category] = 0;
    }
    const imgUrl = images[imgIndexMap[category] % images.length];
    imgIndexMap[category]++;

    // Generate stunning title
    const adj = ARTWORK_ADJECTIVES[i % ARTWORK_ADJECTIVES.length];
    const nouns = ARTWORK_NOUNS[category] || ARTWORK_NOUNS['Digital Art'];
    const noun = nouns[(i * 2) % nouns.length];
    const title = `${adj} ${noun}`;

    // Tag list
    const tags = [
      category.toLowerCase().replace(' ', ''),
      adj.toLowerCase(),
      noun.toLowerCase(),
      'illustration',
      i % 2 === 0 ? 'conceptart' : 'creative'
    ];

    // Comments
    const commentsCount = Math.floor(Math.random() * 15) + 2;
    const comments: Comment[] = [];
    for (let c = 0; c < commentsCount; c++) {
      const commenter = artists[(i + c + 3) % artists.length];
      comments.push({
        id: `comment-${i}-${c}`,
        artistId: commenter.id,
        artistName: commenter.name,
        artistAvatar: commenter.avatar,
        artistUsername: commenter.username,
        content: DUMMY_COMMENTS[(i + c) % DUMMY_COMMENTS.length],
        timestamp: `${c + 1}h ago`,
        likes: Math.floor(Math.random() * 25)
      });
    }

    artworks.push({
      id: `artwork-${i}`,
      title,
      imageUrl: imgUrl,
      category,
      tags,
      artistId: artist.id,
      artistName: artist.name,
      artistAvatar: artist.avatar,
      artistUsername: artist.username,
      likesCount: Math.floor(Math.random() * 600) + 15,
      commentsCount,
      favoritesCount: Math.floor(Math.random() * 200) + 5,
      viewsCount: Math.floor(Math.random() * 5000) + 200,
      description: `A piece representing the pure aesthetic of ${category}. Inspired by the themes of ${adj.toLowerCase()} landscapes and dynamic structures. Crafted digitally with attention to lighting, depth, and atmospheric balance.`,
      createdAt: `${Math.floor(Math.random() * 10) + 1} days ago`,
      comments,
      hasLiked: Math.random() > 0.7,
      hasFavorited: Math.random() > 0.8
    });
  }

  return artworks;
};

// Generate 15 notifications
export const generateNotifications = (artists: Artist[], artworks: Artwork[]): Notification[] => {
  const notifications: Notification[] = [];
  const notificationTypes: ('like' | 'comment' | 'follow' | 'save')[] = ['like', 'comment', 'follow', 'save'];
  
  for (let i = 0; i < 15; i++) {
    const type = notificationTypes[i % notificationTypes.length];
    const sender = artists[1 + (i % (artists.length - 1))];
    const artwork = artworks[i % artworks.length];
    
    notifications.push({
      id: `notification-${i}`,
      type,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      senderUsername: sender.username,
      artworkId: type !== 'follow' ? artwork.id : undefined,
      artworkTitle: type !== 'follow' ? artwork.title : undefined,
      artworkImage: type !== 'follow' ? artwork.imageUrl : undefined,
      timestamp: `${i + 1}h ago`,
      read: i > 3
    });
  }

  return notifications;
};

// Generate chat conversations
export const generateConversations = (artists: Artist[]): Conversation[] => {
  const conversations: Conversation[] = [];
  const messagePrompts = [
    [
      "Hey! I saw your latest digital art piece. It looks stunning!",
      "Thank you so much! I spent about 12 hours on it.",
      "Twelve hours? Wow, that's dedication. Do you do commission work as well?",
      "Yes, I do! Send over the details and we can discuss pricing and timelines."
    ],
    [
      "Hello Alex! Would you be interested in being featured in our upcoming art digital showcase?",
      "Hi! I would love to. What are the requirements?",
      "Just 3 of your high-res digital artworks and a brief bio. I can send you the official link here.",
      "Awesome, please send it over!"
    ],
    [
      "Your landscape lighting is out of this world. Are those custom brushes or default ones?",
      "Thanks! Actually, I use standard chalk brushes, but I use a lot of soft-light layer blending.",
      "Ah! Layer blending is a lifesaver. Thanks for the tip, keep up the amazing work."
    ],
    [
      "Hey mate, are we still meeting up for the virtual workshop tomorrow?",
      "Yes, absolutely. Ready to sketch some characters!"
    ],
    [
      "Love your pixel art transition. Do you do tutorials?",
      "I am planning to launch a YouTube channel soon to show my process!",
      "Subscribing immediately once you launch it!"
    ]
  ];

  for (let i = 0; i < 5; i++) {
    const partner = artists[1 + i];
    const prompts = messagePrompts[i % messagePrompts.length];
    const messages = prompts.map((text, idx) => ({
      id: `msg-${i}-${idx}`,
      senderId: idx % 2 === 0 ? partner.id : 'user-current',
      content: text,
      timestamp: `${(prompts.length - idx) * 15}m ago`,
      imageUrl: idx === prompts.length - 1 && i === 0 ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80' : undefined
    }));

    conversations.push({
      id: `convo-${i}`,
      artist: partner,
      messages,
      unreadCount: i < 2 ? 1 : 0
    });
  }

  return conversations;
};

// Recent Searches
export const RECENT_SEARCHES = [
  'cyberpunk city 3d',
  'fantasy forest path',
  'pixel art fireplace animation',
  'anime fighter character sheet'
];

// Trending Tags
export const TRENDING_TAGS = [
  'cyberpunk2077',
  'isometric3d',
  'studioghibli',
  'unrealengine5',
  'oilpainting',
  'characterconcept',
  'cozypixel',
  'surrealism'
];
