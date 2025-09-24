
# CasePort - Legal Case Management App

[![React Native](https://img.shields.io/badge/React%20Native-0.72-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-49.0-lightgrey.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

CasePort is a comprehensive legal case management mobile application built with React Native and Expo. It provides lawyers and legal professionals with tools to manage client cases, track case progress, and maintain detailed case notes.

## 🚀 Features

### 🔐 Authentication System
- **User Registration & Login**: Secure authentication with JWT tokens
- **Password Security**: Encrypted password storage with bcrypt
- **Persistent Sessions**: Automatic login with secure token storage

### 📋 Case Management
- **Case Creation**: Create detailed client cases with comprehensive information
- **Case Tracking**: Monitor case status and priority levels
- **Client Information**: Store client contact details and case history
- **Case Filtering**: Filter cases by status, priority, and search terms

### 📝 Notes System
- **Case Notes**: Add detailed notes to any case
- **Note Management**: Edit and delete notes with real-time updates
- **Chronological Tracking**: Timestamp all notes for proper case documentation

### 🎨 User Experience
- **Native Mobile UI**: Optimized for iOS and Android devices
- **Intuitive Navigation**: Smooth navigation between screens
- **Real-time Updates**: Live data synchronization
- **Responsive Design**: Adapts to different screen sizes

## 🛠️ Technology Stack

- **Frontend**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation 6
- **State Management**: React Hooks & Context API
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios with interceptors
- **Storage**: AsyncStorage for offline data
- **Styling**: React Native StyleSheet

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── ClientCaseForm.tsx
│   ├── ClientCasesList.tsx
│   └── CaseNotes.tsx
├── screens/            # Application screens
│   ├── AuthScreen.tsx
│   ├── HomeScreen.tsx
│   ├── CreateCaseScreen.tsx
│   └── CaseDetailsScreen.tsx
├── navigation/         # Navigation configuration
│   └── AppNavigation.tsx
├── services/          # API services
│   └── api.ts
├── hooks/            # Custom React hooks
│   ├── useAuth.ts
│   └── useCases.ts
├── utils/           # Utility functions
│   ├── index.ts
│   └── validations.ts
└── types/          # TypeScript type definitions
    └── index.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CaseportPLLC/CaseportApp.git
   cd CaseportApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - **iOS**: Press `i` in the terminal or scan QR code with Camera app
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in the terminal

### Environment Setup

Create a `.env` file in the root directory:

```env
API_BASE_URL=http://your-api-server.com/api
```

## 🔧 Configuration

### API Integration

The app is configured to work with a REST API backend. Update the API base URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://your-api-server.com/api';
```

### Required API Endpoints

The app expects the following API endpoints:

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/client-cases` - Fetch user cases
- `POST /api/client-cases` - Create new case
- `PUT /api/client-cases/:id` - Update case
- `DELETE /api/client-cases/:id` - Delete case
- `GET /api/case-notes` - Fetch case notes
- `POST /api/case-notes` - Create new note
- `PUT /api/case-notes/:id` - Update note
- `DELETE /api/case-notes/:id` - Delete note

## 📱 Screenshots

*Screenshots will be added once the app is deployed*

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details.

## 🏢 About CasePort PLLC

CasePort PLLC is dedicated to providing innovative legal technology solutions. This mobile application represents our commitment to modernizing legal case management through intuitive and powerful mobile tools.

## 📞 Support

For support, email support@caseport.com or create an issue in this repository.

---

**Built with ❤️ by the CasePort Team**