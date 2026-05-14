# InventoryFlow 

This document outlines the folder structure and architectural patterns used in the InventoryFlow application. The app is built with **React Native (Expo)**, **TypeScript**, and styled using **NativeWind (v4)**.

## Directory Tree

```text
InventoryFlow/
├── App.tsx                     # Main application entry point and global providers
├── app.json                    # Expo configuration
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # NativeWind & design system tokens configuration
├── babel.config.js             # Babel compiler config (NativeWind setup)
├── metro.config.js             # Metro bundler config
├── global.css                  # Global Tailwind CSS directives
├── nativewind-env.d.ts         # TypeScript definitions for NativeWind
│
├── assets/                     # Static assets
│   ├── fonts/                  # Custom application fonts
│   └── images/                 # Local image assets
│
└── src/                        # Core application source code
    ├── components/             # Reusable, stateless UI components
    │   ├── EmptyState.tsx      # Fallback UI for empty lists
    │   ├── InfoBanner.tsx      # Contextual alert/info messages
    │   ├── LoadingState.tsx    # Loading spinners and indicators
    │   ├── ProductCard.tsx     # Inventory item display card
    │   ├── QuantityStepper.tsx # + / - input control
    │   ├── QuickActionButton.tsx # Dashboard quick action buttons
    │   ├── StatCard.tsx        # Dashboard statistic display
    │   ├── StockValueCard.tsx  # Hero card for total portfolio value
    │   ├── Toast.tsx           # Animated temporary notifications
    │   ├── TransactionBadge.tsx# Status indicator for logs
    │   └── TransactionItem.tsx # History log list item
    │
    ├── hooks/                  # Custom React hooks (Business Logic & State)
    │   ├── useProducts.ts      # Product CRUD and stock adjustment logic
    │   ├── useSimulatedApi.ts  # Wrapper to simulate network latency
    │   ├── useTransactions.ts  # Transaction logging and pagination logic
    │   └── useUsers.ts         # Authentication and user profile state
    │
    ├── navigation/             # Routing configuration
    │   └── BottomTabNavigator.tsx # Main tab bar and nested stack routing
    │
    ├── screens/                # Full-screen route components
    │   ├── AddProductScreen.tsx# Form to register new SKUs
    │   ├── DashboardScreen.tsx # Overview, stats, and quick actions
    │   ├── HistoryScreen.tsx   # Transaction log with pagination
    │   ├── InventoryScreen.tsx # Product list and management
    │   └── ProfileScreen.tsx   # User registration and profile details
    │
    ├── types/                  # TypeScript interfaces and type definitions
    │   └── index.ts            # Core domain models (User, Product, Transaction)
    │
    └── utils/                  # Pure helper functions
        ├── formatting.ts       # Currency, date, and number formatters
        ├── storage.ts          # Typed AsyncStorage wrappers
        └── validation.ts       # Form validation rules (Zod/Regex)
```

## Architectural Patterns

### 1. Separation of Concerns
The application strictly separates **Presentation** from **Business Logic**:
- **Components & Screens** handle rendering UI and capturing user input. They remain as stateless as possible.
- **Hooks (`/hooks`)** contain all complex business logic, data fetching, and state management. They expose clean APIs for the screens to consume.
- **Utils (`/utils`)** contain pure, easily testable helper functions that do not rely on React.

### 2. Styling Strategy (NativeWind)
We utilize **NativeWind v4**, allowing us to write standard Tailwind CSS utility classes directly on React Native components via the `className` prop. 
- All brand colors, fonts, and spacing are tokenized inside `tailwind.config.js`.
- This ensures consistency with the provided Figma/HTML design specifications without writing inline `StyleSheet` objects.

### 3. State Management & Persistence
- State is managed locally using React's `useState` and `useEffect` within custom hooks.
- **Data Persistence** is achieved through `@react-native-async-storage/async-storage`. The `src/utils/storage.ts` file acts as a strongly-typed adapter to ensure data integrity when saving to the device.
- All mutating actions (saving products, adding stock) are wrapped in `useSimulatedApi.ts` to mimic real-world network conditions (loading states, promise resolution).

### 4. Navigation
The app uses `@react-navigation/bottom-tabs` as the primary navigation structure. A nested `NativeStackNavigator` is used inside the Inventory tab to handle pushing the "Add Product" screen over the product list without losing the bottom tab context.
