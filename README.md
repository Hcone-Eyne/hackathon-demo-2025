## About DBT Prototype / Unified DBT Navigator & Accessibility Suite

A Progressive Web App (PWA) designed to help users understand and check the difference between Aadhaar-linked and Aadhaar-seeded DBT-enabled bank accounts.

## Vision
To bridge the digital divide by engineering a "3-in-1" mobile solution that empowers the 55% of the population currently facing smartphone barriers. My goal is to simplify complex government processes (Aadhaar/DBT) into a single, intuitive interface that requires zero prior technical training.

### Features

- **Educational Content**: Educational Content: * Interactive Framework: Engineered a progressive learning system that breaks down complex Aadhaar and DBT systems into "micro-lessons" to reduce cognitive load for first-time users.
Visual Guidance: Integrated high-contrast visual aids and transitions to clarify the distinction between Aadhaar-linked and Aadhaar-seeded bank accounts.
- **AI Assistant**:
Natural Language Processing (NLP): Utilizes a state-of-the-art Large Language Model (LLM) to translate complex banking and government jargon into simple, actionable steps.

Prompt Engineering: Developed custom system prompts to ensure the AI acts as a "Digital Concierge," predicting user friction points during the Aadhaar-seeding process.

Model-Agnostic Design: The architecture is built to be modular, allowing for the integration of various high-performance AI models to ensure scalability and future-proofing.

- **DBT Checker**: Mock Verification Engine: Developed robust simulation logic that mimics real-world API responses for status checks, providing immediate, risk-free feedback for educational purposes.
Edge Case Troubleshooting: Programmed the checker to demonstrate common failure points—such as mismatched names—to teach users how to resolve actual portal errors.
- **User Authentication**: Secure Identity Management: Integrated Supabase Auth with strict Row-Level Security (RLS) policies, ensuring 100% data privacy and integrity in a multi-user environment.
- **Offline Support**: PWA Resilience: Leveraged Service Workers and the Cache API to ensure educational modules and AI logic remain functional in low-connectivity or rural areas.
- **Push Notifications**: Intelligent Engagement: Built a notification layer using background sync to deliver critical scholarship deadlines and status updates the moment a device regains internet access.

### Tech Stack

-Frontend: React 18+, TypeScript, Tailwind CSS, Vite
-State Management: TanStack Query (for optimized data fetching)
-Backend: Supabase (PostgreSQL, PLpgSQL functions)
-Animation: Framer Motion & Lottie React

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

**Solo Developer Note:** This entire project—from architecture and database design to UI/UX and AI prompt engineering—was developed and deployed by me over an intensive 30-day development cycle.


**Important:** Create a `.env` file in the root directory with your API keys and secrets.  
See `.env.example` (if available) for the required variables.


Don't Forget To Add Your .env File For Full Experience 

Thank You
--- 
Enjoy exploring the DBT Prototype! 🎉

