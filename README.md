# City Ambient Soundscape Mixer - Frontend

A React application that allows users to create, customize, save, and retrieve ambient city soundscapes by mixing different environmental sounds.

## Features

- **Sound Mixing Interface**: Select from various ambient sound elements (traffic, rain, sirens, cafe murmur, birds, etc.)
- **Volume Control**: Individual volume sliders for each active sound
- **User Authentication**: Login and signup functionality to save personal soundscapes
- **Save & Load**: Store your favorite sound combinations and load them later
- **Visual Feedback**: Clear visual indicators for active sounds

## Technology Stack

- **React** with **Vite** for fast development and optimized builds
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Tone.js** for audio processing and playback
- **Axios** for API communication

## Pages

- **Login Page**: User authentication
- **Signup Page**: New user registration
- **Homepage**: Introduction and navigation
- **Sound Mix Page**: Main interface for creating and editing soundscapes

## Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- Backend API running (see backend repository)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/neethuss/CitySoundscape-frontend.git
   
   ```

2. Install dependencies:
   ```bash
   npm install
   # or with yarn
   yarn install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   VITE_BACKEND_URL = 'http://localhost:3000'
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or with yarn
   yarn dev
   ```

5. The application will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
# or with yarn
yarn build
```

The built files will be in the `dist` directory and can be served by any static file server.

## API Integration

The frontend communicates with the backend through the following endpoints:

- `POST /user/login` - User login
- `POST /user/signup` - User registration
- `GET /soundscape` - Retrieve user's saved soundscapes
-  `GET /soundscape/:id` - Retrieve saved soundscapes by id
- `POST /soundscape` - Save a new soundscape
- `PUT /soundscaps/:id` - Update an existing soundscape
- `DELETE /soundscape/:id` - Delete a soundscape

## Usage

1. Register a new account or log in
2. Navigate to the Sound Mix page
3. Select different ambient sounds by clicking on their icons
4. Adjust individual volume levels using the sliders
5. Use the master volume control to adjust overall volume
6. Save your mix by clicking the "Save" button and providing a name
7. Load previously saved soundscapes from the dropdown menu

## Deployment

The frontend is currently deployed at: https://citysoundscape-frontend.onrender.com
