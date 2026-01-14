## About DBT Prototype

A Progressive Web App (PWA) designed to help users understand and check the difference between Aadhaar-linked and Aadhaar-seeded DBT-enabled bank accounts.

### Features

- **Educational Content**: Interactive lessons about Aadhaar and DBT systems
- **AI Assistant**: OpenAI GPT-4o powered chatbot for queries
- **DBT Checker**: Mock verification system for DBT status
- **User Authentication**: Secure authentication with Supabase
- **Offline Support**: PWA with offline functionality
- **Push Notifications**: Stay updated with important information

### Tech Stack

- React 18+, TypeScript, Tailwind CSS, Vite
- Supabase (PostgreSQL, Authentication)
- OpenAI GPT-4o API
- PWA with Service Workers
- TanStack Query, Framer Motion, Lottie React

### Security

All tables use Row-Level Security (RLS). See [SECURITY.md](./SECURITY.md) for details.

### Testing

```bash
npm run test          # Run tests
npm run test:coverage # Generate coverage report
```

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

## Built With

- **Vite** – Frontend build tool  
- **React** – UI library  
- **TypeScript** – Main programming language  
- **JavaScript** – Legacy/utility scripts  
- **PLpgSQL** – Database functions in Supabase



**Important:** Create a `.env` file in the root directory with your API keys and secrets.  
See `.env.example` (if available) for the required variables.


Don't Forget To Add Your .env File For Full Experience 

Thank You
--- 
Enjoy exploring the DBT Prototype! 🎉

