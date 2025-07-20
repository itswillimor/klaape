# Klaape Development in GitHub Codespaces

This guide will help you set up and work with the Klaape project in GitHub Codespaces.

## Getting Started

1. **Sync with GitHub**:
   When you first open your Codespace or need to get the latest changes, run:
   ```bash
   ./sync-codespace.sh
   ```

2. **Setup PostgreSQL**:
   To use PostgreSQL instead of SQLite:
   ```bash
   # Create a .env file if it doesn't exist
   cp backend/.env.example backend/.env
   
   # Edit the .env file to set USE_POSTGRES=True
   nano backend/.env
   
   # Apply migrations
   cd backend
   python manage.py migrate
   ```

3. **Start the Backend**:
   ```bash
   cd backend
   python manage.py runserver 0.0.0.0:8000
   ```
   The backend will be available at the Codespace URL on port 8000.

4. **Start the Frontend**:
   ```bash
   cd frontend
   npm start
   ```
   The frontend will be available at the Codespace URL on port 19006.

## Working with the Database

GitHub Codespaces provides PostgreSQL as a service. The connection details are:

- Host: `localhost`
- Port: `5432`
- Username: `postgres`
- Password: `postgres`
- Database: `postgres`

You can connect to it using:
```bash
psql -h localhost -U postgres
```

## Useful Commands

- **Create a superuser**:
  ```bash
  cd backend
  python manage.py createsuperuser
  ```

- **Make migrations**:
  ```bash
  cd backend
  python manage.py makemigrations
  python manage.py migrate
  ```

- **Reset the database**:
  ```bash
  cd backend
  python manage.py flush
  ```

- **Run tests**:
  ```bash
  cd backend
  python manage.py test
  ```

## Troubleshooting

- **Port forwarding issues**: Make sure ports 8000 and 19006 are forwarded in your Codespace settings.
- **Database connection issues**: Check that PostgreSQL is running with `pg_isready`.
- **Frontend not connecting to backend**: Ensure the API URL in `frontend/src/services/api.js` is set correctly for Codespaces.