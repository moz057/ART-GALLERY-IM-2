# Connecting Vivid Gallery to a PHP & MySQL Backend

This guide outlines how to connect this modern React/Vite frontend application to a robust PHP REST API backed by a MySQL database (commonly managed via phpMyAdmin). It provides the SQL schema, dummy data seed scripts, and React integration examples.

---

## 1. Project Directory Structure Map

Understanding where files are located in this workspace is key to replacing mock data with real database connections.

```text
├── src/
│   ├── main.tsx                # React application mount entrypoint
│   ├── App.tsx                 # Core App Shell: Manages application state & view routing
│   ├── types.ts                # TypeScript interfaces (Artwork, Artist, Comment, Notification, etc.)
│   ├── data/
│   │   └── dummyData.ts        # Seed data generators currently feeding the application
│   └── components/
│       ├── HomeView.tsx        # Instagram-style scrolling single-post feed
│       ├── ExploreView.tsx     # Pinterest-style grid layout component
│       ├── CategoriesView.tsx  # Interactive filter/category browser
│       ├── UploadView.tsx      # Form for submitting new creative artwork
│       ├── ProfileView.tsx     # Displaying artist bios, galleries, and collections
│       ├── SavedView.tsx       # User's bookmarked bookmark collections
│       ├── NotificationsView.tsx # Activity feeds (likes, follows, saves)
│       └── SettingsView.tsx    # User preference and profile details manager
```

---

## 2. Setting Up the MySQL Database (SQL Schema)

Log in to your **phpMyAdmin** or terminal console, create a new database called `vivid_gallery`, and run the following queries to create the necessary tables:

```sql
-- Create Database
CREATE DATABASE IF NOT EXISTS vivid_gallery CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vivid_gallery;

-- 1. Artists Table
CREATE TABLE IF NOT EXISTS artists (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    avatar TEXT,
    banner TEXT,
    bio TEXT,
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    is_following BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Artworks Table
CREATE TABLE IF NOT EXISTS artworks (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    image_url TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    tags TEXT, -- Comma-separated list of tags e.g. "futuristic,cyberpunk"
    artist_id VARCHAR(50) NOT NULL,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    favorites_count INT DEFAULT 0,
    views_count INT DEFAULT 1,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

-- 3. Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id VARCHAR(50) PRIMARY KEY,
    artwork_id VARCHAR(50) NOT NULL,
    artist_id VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);
```

---

## 3. Inserting Dummy Data with MySQL

Run the following SQL statements to seed your newly created database with high-quality dummy records corresponding to the interactive state inside the app:

```sql
-- Seed Artists
INSERT INTO artists (id, name, username, email, avatar, banner, bio, followers_count, following_count, is_following) VALUES
('user-current', 'Alex Mercer', 'alexmercer_art', 'alex.mercer@vivid.gallery', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80', 'Visual artist, designer and storyteller. Seeking the poetic in futuristic, mechanical, and natural landscapes.', 1240, 480, 0),
('artist-1', 'Elena Rostova', 'elena_rostova', 'elena@vivid.gallery', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&auto=format&fit=crop&q=80', 'Conceptual graphic designer exploring modern organic shapes, fluid colors, and brutalist layouts.', 4820, 290, 1),
('artist-2', 'Marcus Vance', 'marcus_vance', 'marcus@vivid.gallery', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&auto=format&fit=crop&q=80', 'Landscape and fine-art photographer capturing pristine, rare structural architecture in cold climates.', 3120, 150, 0);

-- Seed Artworks
INSERT INTO artworks (id, title, image_url, category, tags, artist_id, likes_count, comments_count, favorites_count, views_count, description) VALUES
('art-1', 'Prism of Dreams', 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80', 'Abstract', 'fluid,colors,psychedelic,modern', 'artist-1', 452, 2, 89, 1205, 'An exploration of liquid chromatography and refracted light waves bouncing inside geometric chambers.'),
('art-2', 'Monolithic Winter', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80', 'Architecture', 'cold,brutalist,monolith,snow', 'artist-2', 823, 1, 142, 2401, 'A high-contrast exposure of concrete modernist shelters towering over desolate snow-bound landscapes.'),
('art-3', 'Neon Citadel', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80', 'Cyberpunk', 'neon,futuristic,city,night', 'user-current', 241, 1, 44, 592, 'Dusk settling in Sector 7. Hand-painted glowing glass textures combined with retro-grade vector overlays.');

-- Seed Comments
INSERT INTO comments (id, artwork_id, artist_id, content, likes) VALUES
('c-1', 'art-1', 'artist-2', 'The lighting contrast in the center is absolutely spectacular Elena.', 12),
('c-2', 'art-1', 'user-current', 'Incredible work! What tools did you use to design these gradients?', 8),
('c-3', 'art-2', 'artist-1', 'The geometry is so clean. Makes me feel cold just looking at it.', 15);
```

---

## 4. Setting Up the PHP REST API Backend

Create a directory on your local server running PHP (e.g., `C:\xampp\htdocs\vivid-api\`).

### A. Database Connection Setup (`db.php`)
This file handles the secure connection with PDO.

```php
<?php
// db.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$host = 'localhost';
$db   = 'vivid_gallery';
$user = 'root'; // default XAMPP username
$pass = '';     // default XAMPP password
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
     exit;
}
?>
```

### B. Read Artworks Endpoint (`get_artworks.php`)
Outputs clean database rows matching the React `Artwork` typescript interface structure.

```php
<?php
// get_artworks.php
require_once 'db.php';

try {
    // Join artworks and artists to easily populate artist metadata fields in React
    $stmt = $pdo->query("
        SELECT 
            w.id, 
            w.title, 
            w.image_url as imageUrl, 
            w.category, 
            w.tags,
            w.artist_id as artistId, 
            w.likes_count as likesCount, 
            w.comments_count as commentsCount, 
            w.favorites_count as favoritesCount, 
            w.views_count as viewsCount, 
            w.description,
            w.created_at as createdAt,
            a.name as artistName,
            a.avatar as artistAvatar,
            a.username as artistUsername
        FROM artworks w
        JOIN artists a ON w.artist_id = a.id
        ORDER BY w.created_at DESC
    ");
    
    $rawArtworks = $stmt->fetchAll();
    
    // Format tags array and booleans for JSON output
    $artworks = [];
    foreach ($rawArtworks as $art) {
        $art['tags'] = $art['tags'] ? explode(',', $art['tags']) : [];
        $art['likesCount'] = (int)$art['likesCount'];
        $art['commentsCount'] = (int)$art['commentsCount'];
        $art['favoritesCount'] = (int)$art['favoritesCount'];
        $art['viewsCount'] = (int)$art['viewsCount'];
        
        // Mock personal likes/faves for simple demo connection (or track in join table)
        $art['hasLiked'] = false; 
        $art['hasFavorited'] = false;
        
        // Fetch comments for this artwork
        $commentStmt = $pdo->prepare("
            SELECT 
                c.id, 
                c.artist_id as artistId, 
                c.content, 
                c.likes,
                c.created_at as timestamp,
                a.name as artistName,
                a.avatar as artistAvatar,
                a.username as artistUsername
            FROM comments c
            JOIN artists a ON c.artist_id = a.id
            WHERE c.artwork_id = ?
            ORDER BY c.created_at DESC
        ");
        $commentStmt->execute([$art['id']]);
        $art['comments'] = $commentStmt->fetchAll();
        
        $artworks[] = $art;
    }

    echo json_encode($artworks);

} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
```

---

## 5. Fetching the PHP Backend Data in React (`src/App.tsx`)

Inside `src/App.tsx`, modify the initialization logic to pull real content from your local PHP server instead of generating local client mock data.

### Recommended Code Implementation:

1. **Open `src/App.tsx`** using your code explorer.
2. Replace your mock `useEffect` initialization with real HTTP request triggers:

```tsx
// Inside src/App.tsx

// Define your local API root URL
const API_BASE_URL = 'http://localhost/vivid-api';

useEffect(() => {
  // 1. Fetch Artists
  fetch(`${API_BASE_URL}/get_artists.php`)
    .then(res => res.json())
    .then(data => setArtists(data))
    .catch(err => console.error("Error fetching artists:", err));

  // 2. Fetch Artworks
  fetch(`${API_BASE_URL}/get_artworks.php`)
    .then(res => res.json())
    .then(data => setArtworks(data))
    .catch(err => console.error("Error fetching artworks:", err));
    
  // 3. Fetch Notifications
  fetch(`${API_BASE_URL}/get_notifications.php`)
    .then(res => res.json())
    .then(data => setNotifications(data))
    .catch(err => console.error("Error fetching notifications:", err));
}, []);
```

### Writing a New Artwork back to PHP MySQL (`handlePublishArtwork` example):

To store user uploads inside the MySQL database instead of appending to local memory state, replace `handlePublishArtwork` in `src/App.tsx`:

```tsx
const handlePublishArtwork = (newArt: { title: string; description: string; category: string; tags: string[]; localImage: string }) => {
  const payload = {
    title: newArt.title,
    description: newArt.description,
    category: newArt.category,
    tags: newArt.tags.join(','),
    localImage: newArt.localImage,
    artistId: 'user-current'
  };

  fetch(`${API_BASE_URL}/create_artwork.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(savedRecord => {
    // Append the newly saved record returned by PHP database directly to state
    setArtworks(prev => [savedRecord, ...prev]);
    setCurrentView('home');
  })
  .catch(err => console.error("Error saving artwork:", err));
};
```

---

## 6. Implementing User Accounts (Authentication with PHP & MySQL)

To transition from local mocked logins to true user accounts with persistent databases, expand the `artists` database table to support password verification and implement register/login endpoints.

### A. Updating the MySQL Table Schema
Run this SQL query to add a secure password hash column, plus any desired details:

```sql
-- Run this in phpMyAdmin to support user accounts
ALTER TABLE artists 
ADD COLUMN password_hash VARCHAR(255) NOT NULL AFTER email;
```

---

### B. Secure Account Registration Endpoint (`register.php`)
This file accepts new user credentials, securely hashes the password using PHP's robust standard `PASSWORD_BCRYPT` algorithm, and provisions their account.

```php
<?php
// register.php
require_once 'db.php';

// Retrieve POST body payload
$data = json_decode(file_get_contents("php://input"), true);

if (
    empty($data['name']) || 
    empty($data['username']) || 
    empty($data['email']) || 
    empty($data['password'])
) {
    http_response_code(400);
    echo json_encode(["error" => "All fields (name, username, email, password) are required."]);
    exit;
}

$name = trim($data['name']);
$username = strtolower(trim($data['username']));
$email = strtolower(trim($data['email']));
$password = $data['password'];

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid email address format."]);
    exit;
}

try {
    // Check if username or email already exists
    $checkStmt = $pdo->prepare("SELECT id FROM artists WHERE username = ? OR email = ?");
    $checkStmt->execute([$username, $email]);
    if ($checkStmt->fetch()) {
        http_response_code(409);
        echo json_encode(["error" => "An account with this username or email already exists."]);
        exit;
    }

    // Securely hash the password (never store plain-text passwords!)
    $password_hash = password_hash($password, PASSWORD_BCRYPT);
    
    // Generate a unique identifier
    $userId = "user-" . bin2hex(random_bytes(8));
    
    // Set default avatars/banners
    $avatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";
    $banner = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80";
    $bio = "New artist on VIVID Gallery.";

    // Insert into DB
    $insertStmt = $pdo->prepare("
        INSERT INTO artists (id, name, username, email, password_hash, avatar, banner, bio) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $insertStmt->execute([$userId, $name, $username, $email, $password_hash, $avatar, $banner, $bio]);

    // Return newly created user (excluding password hash)
    echo json_encode([
        "success" => true,
        "user" => [
            "id" => $userId,
            "name" => $name,
            "username" => $username,
            "email" => $email,
            "avatar" => $avatar,
            "banner" => $banner,
            "bio" => $bio,
            "followersCount" => 0,
            "followingCount" => 0,
            "isFollowing" => false
        ]
    ]);

} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Registration failed: " . $e->getMessage()]);
}
?>
```

---

### C. Secure Login & Session Authorization Endpoint (`login.php`)
This endpoint accepts credentials, checks for account existence, verifies the input password against the hashed database value using `password_verify()`, and responds with the full profile details.

```php
<?php
// login.php
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['usernameOrEmail']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "Username/Email and Password are required."]);
    exit;
}

$identity = strtolower(trim($data['usernameOrEmail']));
$password = $data['password'];

try {
    // Find user by either email or username
    $stmt = $pdo->prepare("
        SELECT id, name, username, email, password_hash, avatar, banner, bio, followers_count, following_count 
        FROM artists 
        WHERE username = ? OR email = ?
    ");
    $stmt->execute([$identity, $identity]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid username, email, or password."]);
        exit;
    }

    // Return validated session user
    echo json_encode([
        "success" => true,
        "user" => [
            "id" => $user['id'],
            "name" => $user['name'],
            "username" => $user['username'],
            "email" => $user['email'],
            "avatar" => $user['avatar'],
            "banner" => $user['banner'],
            "bio" => $user['bio'],
            "followersCount" => (int)$user['followers_count'],
            "followingCount" => (int)$user['following_count'],
            "isFollowing" => false
        ]
    ]);

} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Login failed: " . $e->getMessage()]);
}
?>
```

---

### D. Connecting the Auth Endpoints in React (`src/App.tsx`)

In `src/App.tsx`, we can map the current layout actions for **Registration** and **Login** directly to server fetches.

#### 1. Real Login Connection
In `src/App.tsx`, locate your login trigger function (e.g. `handleLoginSubmit` or `handleLogin`) and replace it with:

```tsx
const handleLogin = (credentials: { usernameOrEmail: string; password: string }) => {
  fetch(`${API_BASE_URL}/login.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
  .then(res => {
    if (!res.ok) {
      return res.json().then(err => { throw new Error(err.error || 'Login failed') });
    }
    return res.json();
  })
  .then(data => {
    // 1. Store user data as active session
    setCurrentUser(data.user);
    setIsLoggedIn(true);
    
    // 2. Optional: Persist active session to local storage so user stays logged in
    localStorage.setItem('vivid_session_user', JSON.stringify(data.user));
    
    // 3. Navigate back to Home Feed
    setCurrentView('home');
  })
  .catch(err => {
    alert(err.message || "An error occurred during login. Please try again.");
  });
};
```

#### 2. Real Registration Connection
Replace your registration trigger function with:

```tsx
const handleRegister = (newUser: { name: string; username: string; email: string; password: string }) => {
  fetch(`${API_BASE_URL}/register.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser)
  })
  .then(res => {
    if (!res.ok) {
      return res.json().then(err => { throw new Error(err.error || 'Registration failed') });
    }
    return res.json();
  })
  .then(data => {
    // Success alert and automatically log the user in
    alert("Account created successfully!");
    setCurrentUser(data.user);
    setIsLoggedIn(true);
    localStorage.setItem('vivid_session_user', JSON.stringify(data.user));
    setCurrentView('home');
  })
  .catch(err => {
    alert(err.message || "An error occurred during registration.");
  });
};
```

#### 3. Restoring User Session on Startup
To ensure users do not have to sign in every time they refresh the page, update the initial startup hook in `src/App.tsx`:

```tsx
useEffect(() => {
  // Check if session user exists in local storage
  const cachedUser = localStorage.getItem('vivid_session_user');
  if (cachedUser) {
    setCurrentUser(JSON.parse(cachedUser));
    setIsLoggedIn(true);
  }
  
  // Existing data fetches from PHP backend...
}, []);
```
