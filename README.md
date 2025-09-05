# Citizen's Shield

A mobile-first web application providing instant, location-specific legal rights information and de-escalation scripts for interactions with law enforcement.

## 🚀 Features

### Core Features
- **State-Specific Rights Guides**: Comprehensive legal rights information for all US states
- **AI-Powered Script Generation**: Dynamic, contextual de-escalation scripts using OpenAI
- **Multi-Language Support**: English and Spanish language options
- **User Authentication**: Secure user accounts with profile management
- **Incident Recording**: Audio/video recording with cloud storage
- **Emergency Contacts**: Real-time notification system for trusted contacts
- **Subscription Management**: Freemium model with premium features

### Technical Features
- **Progressive Web App (PWA)**: Offline functionality and mobile optimization
- **Real-time Database**: Supabase backend with row-level security
- **Payment Processing**: Stripe integration for subscriptions
- **Geolocation Services**: Automatic state detection and rights loading
- **Comprehensive Error Handling**: User-friendly error messages and fallbacks

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: OpenAI GPT-3.5-turbo for script generation
- **Payments**: Stripe for subscription management
- **Icons**: Lucide React
- **State Management**: React Context + Custom Hooks

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- OpenAI API key
- Stripe account (for payments)

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd citizens-shield
npm install
```

### 2. Environment Setup

Copy the environment template and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your-openai-api-key

# Stripe Configuration (optional for development)
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

### 3. Database Setup

Run the database schema in your Supabase SQL editor:

```sql
-- Copy the schema from src/lib/supabase.js (DATABASE_SCHEMA constant)
-- This creates all necessary tables and security policies
```

### 4. Start Development Server

```bash
npm run dev
```

Open your browser to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AuthModal.jsx           # Authentication modal
│   ├── ProfileSettings.jsx     # User profile management
│   ├── ScriptGenerator.jsx     # AI script generation
│   ├── StateGuideCard.jsx      # State rights display
│   └── ...
├── contexts/           # React contexts
│   └── AuthContext.jsx        # Authentication context
├── data/              # Static data
│   └── stateRights.js         # State-specific legal data
├── services/          # API and business logic
│   ├── api.js                 # Supabase API functions
│   ├── aiService.js           # OpenAI integration
│   └── rightsService.js       # Rights data management
├── lib/               # Configuration
│   └── supabase.js            # Supabase client setup
└── App.jsx           # Main application
```

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the database schema from `src/lib/supabase.js`
3. Enable Row Level Security (RLS) on all tables
4. Configure authentication providers as needed
5. Set up storage bucket for incident recordings

### OpenAI Setup

1. Get an API key from OpenAI
2. Add to environment variables
3. Monitor usage and set up billing alerts

### Stripe Setup (Optional)

1. Create Stripe account
2. Get publishable key
3. Set up webhook endpoints for subscription events
4. Configure products and pricing

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy Options

- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag and drop build folder or connect repo
- **Supabase**: Use Supabase hosting for seamless integration

### Environment Variables

Ensure all production environment variables are set:
- Database URLs and keys
- API keys for external services
- Feature flags and configuration

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint

# Type checking (if TypeScript is added)
npm run type-check
```

## 📱 PWA Features

The app includes Progressive Web App capabilities:
- Offline functionality
- App installation
- Push notifications
- Background sync

To test PWA features:
1. Build the app: `npm run build`
2. Serve locally: `npm run preview`
3. Open in mobile browser
4. Test "Add to Home Screen"

## 🔒 Security Considerations

- All API calls use environment variables
- Row Level Security (RLS) enabled on database
- Input validation and sanitization
- Secure file upload handling
- Rate limiting on API endpoints

## 🌐 Internationalization

Currently supports:
- English (default)
- Spanish (Español)

To add new languages:
1. Add language option to components
2. Create translation files
3. Update AI service prompts
4. Add state rights data translations

## 📊 Analytics and Monitoring

Consider adding:
- User analytics (privacy-compliant)
- Error tracking (Sentry)
- Performance monitoring
- Usage metrics for AI features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of a Product Requirements Document (PRD) implementation. Please refer to the PRD for detailed specifications and requirements.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information
4. Include environment details and error messages

## 🔄 Roadmap

- [ ] Complete state rights data for all 50 states
- [ ] Video recording capabilities
- [ ] Real-time emergency notifications
- [ ] Advanced AI script customization
- [ ] Legal professional verification system
- [ ] Community-driven content updates
- [ ] Mobile app versions (iOS/Android)
