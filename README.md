#  InventoryFlow - Project Architecture & Setup

Hey there! Welcome to the InventoryFlow codebase. 

This document is your roadmap to understanding how everything is wired together. We built this app using **React Native (Expo)**, **TypeScript**, and **NativeWind v4** (which means we get to use Tailwind CSS right in our React Native components!). 

Here's everything you need to know to get up and running, and where to find things when you need to make changes.

---

## Getting Started (Installation & Setup)

If you're setting this up for the first time, you'll need a few things installed.

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine. You'll also need the **Expo Go** app on your physical phone, or an iOS/Android emulator set up on your computer.

### 2. Install Dependencies
Open your terminal, navigate to the `InventoryFlow` folder, and run:

```bash
# We use the --legacy-peer-deps flag to ensure smooth compatibility 
# with some of the NativeWind v4 and Expo 54 native modules.
npm install --legacy-peer-deps
```

### 3. Start the App
Once everything is installed, fire up the Expo development server:

```bash

npx expo start
```
Scan the QR code that appears in your terminal with your phone's camera (iOS) or the Expo Go app (Android).

---

##  How We Organized the Code (Directory Tree)

We kept the structure as flat and intuitive as possible. Here is a breakdown of what lives where:

```text
InventoryFlow/
├── App.tsx                     # The main entry point. Sets up navigation and global fonts.
├── app.json                    # Expo config (app name, icons, splash screens, etc.)
├── package.json                # Where all our npm packages live
├── tailwind.config.js          # Our design system tokens (colors, spacing, fonts)
├── babel.config.js             # Babel config (crucial for NativeWind v4 to work)
├── metro.config.js             # Bundler config
├── global.css                  # Global CSS imports for Tailwind
│
├── assets/                     
│   └── fonts/                  # Custom fonts (Inter, JetBrains Mono, Hanken Grotesk)
│
└── src/                        # The meat of the application!
    ├── components/             # Reusable UI pieces (dumb components)
    │   ├── ProductCard.tsx     # The card showing a single inventory item
    │   ├── QuickActionButton.tsx # The little buttons on the dashboard
    │   └── Toast.tsx           # Our custom animated pop-up notifications
    │   └── ...                 # (And a few other UI helpers)
    │
    ├── hooks/                  # The brains of the operation (smart logic)
    │   ├── useProducts.ts      # Handles adding products and updating stock levels
    │   ├── useTransactions.ts  # Keeps track of the history log
    │   └── useUsers.ts         # Manages the profile and "login" state
    │
    ├── navigation/             
    │   └── BottomTabNavigator.tsx # Wires up the tabs at the bottom of the screen
    │
    ├── screens/                # The actual pages you see in the app
    │   ├── DashboardScreen.tsx # The home tab (stats and quick actions)
    │   ├── InventoryScreen.tsx # The list of all products
    │   ├── AddProductScreen.tsx# The form to create a new product
    │   ├── HistoryScreen.tsx   # The log of all stock changes
    │   └── ProfileScreen.tsx   # The user profile / registration page
    │
    ├── types/                  
    │   └── index.ts            # All our TypeScript blueprints (User, Product, etc.)
    │
    └── utils/                  # Helper functions that don't need React
        ├── formatting.ts       # Formats dates, numbers, and currency
        ├── storage.ts          # Wraps AsyncStorage to safely save data to the phone
        └── validation.ts       # Makes sure form inputs are correct before saving
```

---

 🏗️ Architectural Decisions

If you are looking to contribute or add features, keep these core philosophies in mind:

### 1. Keep the UI "Dumb"
I strictly separate our visuals from our logic. The files in `src/components/` and `src/screens/` should really only care about rendering the UI and handling button clicks. If you find yourself writing complex data-filtering logic inside a screen, it probably belongs in a custom hook inside `src/hooks/`.

### 2. Styling with NativeWind
I am using **NativeWind v4**.so we write standard Tailwind CSS classes directly in the `className` prop. 
*Need to change the primary brand color?* Don't hunt through the code; just update the token in `tailwind.config.js` and it will automatically apply everywhere.

### 3. State & "Backend" Persistence
Since this app doesn't have a real cloud database yet, all state is managed locally via React's `useState` and saved directly to the device using `@react-native-async-storage/async-storage`. 
To make it feel like a real app, all saving/loading actions are routed through `useSimulatedApi.ts`, which injects a slight artificial delay. This allows us to naturally test loading spinners and asynchronous behavior!

### 4. Navigation Flow
We use `@react-navigation/bottom-tabs`. It's straightforward, but there is one trick: the `Inventory` tab actually houses a nested `NativeStackNavigator`. We do this so that when you tap the floating "+" button to add a product, the "Add Product" screen slides in *over* the inventory list, but still keeps you within the Inventory tab flow.
