# Klaape

A platform connecting users with professional creators and businesses.

## Project Structure

```
/Klaape
├── backend/               # Django backend
│   ├── klaape_backend/    # Main Django project
│   ├── klaape_users/      # User management app
│   ├── klaape_content/    # Content management app
│   └── klaape_marketplace/# Marketplace functionality
├── frontend/              # React Native frontend
│   ├── src/               # Source code
│   │   ├── components/    # Reusable components
│   │   ├── screens/       # App screens
│   │   ├── navigation/    # Navigation configuration
│   │   └── services/      # API services
│   ├── assets/            # Static assets
│   └── app.json           # Expo configuration
└── .github/               # GitHub workflows
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL (optional, SQLite for development)
- Redis (for WebSockets and caching)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```
   python manage.py migrate
   ```

5. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

6. Start the development server:
   ```
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Run on specific platforms:
   ```
   npm run ios     # Run on iOS simulator
   npm run android # Run on Android emulator
   npm run web     # Run in web browser
   ```

## Features

### User Roles

- **Regular User**: Browse content, follow creators, and interact with the community
- **Pro Creator**: Monetize content, host live sessions, and build a following
- **Business**: Team management, business tools, and professional services

### Core Functionality

- User profile management
- Content creation and sharing
- Monetization for creators
- Live sessions ("Ask a Pro")
- Marketplace for services

## Technical Architecture

### Backend (Django + DRF)

- Strong API layer for mobile apps
- Built-in auth, permissions, and session management
- DRF simplifies pagination, serialization, and JWT/OAuth for mobile login

### Database (PostgreSQL)

- Handles complex relational data:
  - Users ↔ Followers
  - Posts ↔ Comments ↔ Likes
  - Transactions ↔ Creators
- JSON fields for flexible metadata
- Indexes for query performance

### Real-time Features (Redis + WebSockets)

- Redis for:
  - Caching (feeds, trending content)
  - Celery broker (background tasks)
- WebSockets for:
  - Live sessions
  - Presence tracking
  - Real-time notifications

### Media Processing

- FFmpeg + Celery workers:
  - Video compression for fast delivery
  - Generate thumbnails and adaptive streaming formats
  - Store in AWS S3 or DigitalOcean Spaces for global CDN delivery

### Payment Processing

- Stripe Connect for:
  - User payments (monetized content, live sessions)
  - Creator payouts
  - Supports multiple regions and currencies

## Development Workflow

### Local Development

1. Set up the development environment:
   ```
   ./setup-dev.sh
   ```

2. Create a feature branch:
   ```
   git checkout -b feature/your-feature-name
   ```

3. Make your changes and push to GitHub:
   ```
   ./push-to-github.sh "Your commit message"
   ```
   Or just run `./push-to-github.sh` and you'll be prompted for a commit message.

4. Create a Pull Request on GitHub

### GitHub Codespaces

1. Open the project in GitHub Codespaces

2. Sync with the latest changes:
   ```
   ./sync-codespace.sh
   ```

3. Follow the setup instructions in `.devcontainer/README.md`

## License

[Your License]