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
- PostgreSQL
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

5. Start the development server:
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

## Testing

### Backend Tests

```
cd backend
python manage.py test
```

### Frontend Tests

```
cd frontend
npm test
```

## Deployment

The project uses GitHub Actions for CI/CD. Push to the `main` branch to trigger a production deployment.

## GitHub Integration

1. Create a new GitHub repository
2. Initialize the local repository:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Link to your GitHub repository:
   ```
   git remote add origin https://github.com/yourusername/klaape.git
   git push -u origin main
   ```

## Running in GitHub Codespaces

1. Open your repository in GitHub Codespaces:
   - Go to your GitHub repository
   - Click the "Code" button
   - Select the "Codespaces" tab
   - Click "Create codespace on main"

2. Once the Codespace is ready, run the frontend:
   ```
   cd frontend
   npm run codespace
   ```

3. Connect devices:
   - **Web**: Click the "Open in Browser" button in the ports tab for port 19002
   - **Mobile devices**: Scan the QR code shown in the terminal with the Expo Go app
   - **Emulators**: Use the local IP address shown in the terminal

4. Run the backend in a separate terminal:
   ```
   cd backend
   python manage.py runserver 0.0.0.0:8000
   ```

## Development Workflow

1. Create a feature branch:
   ```
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```
   git add .
   git commit -m "Add your feature"
   ```

3. Push to GitHub:
   ```
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request on GitHub

## License

[Your License]