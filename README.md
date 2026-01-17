# 🚀 Dynamic Festival Theme Implementation Doc

## 📖 Overview
This document explains the architecture connecting the **Admin Panel**, **Backend**, and **User App**. The core feature is allowing the Admin to schedule specific "Festival Themes" (like Diwali, Christmas, etc.) for specific dates. When the current date matches a scheduled theme, the User App automatically updates its entire UI (colors, banners, icons) to match that festival.

---

## 🏗️ Architecture Flow

1.  **Admin Panel**: Admin selects a **Theme** + **Start Date** + **End Date** and saves it.
2.  **Backend (Database)**: Stores this schedule in the `theme_schedules` table.
3.  **Backend (API)**: Exposes an endpoint `/current-theme` that checks "Is today's date inside any scheduled festival?".
4.  **User App**: When the app opens (or home screen loads), it asks the backend "What is today's theme?".
5.  **User App (UI)**: The app receives the theme name (e.g., "Diwali") and instantly swaps all colors, fonts, and images from a pre-defined `THEMES` dictionary.

---

## 🛠️ Step-by-Step Implementation

### 1. The Backend (Server & Database)
**File:** `backend/server.js`

We use a **PostgreSQL** database to store schedules.

#### Database Schema
A table named `theme_schedules` is created automatically:
```sql
CREATE TABLE theme_schedules (
    id SERIAL PRIMARY KEY,
    theme_name VARCHAR(50) NOT NULL, -- e.g. "Diwali"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);
```

#### API Endpoints
-   **POST `/schedule-theme`**: Used by Admin to save a new schedule.
-   **GET `/current-theme`**: Used by User App. It runs a SQL query to find a theme active *today*:
    ```sql
    SELECT theme_name FROM theme_schedules 
    WHERE CURRENT_DATE BETWEEN start_date AND end_date 
    LIMIT 1;
    ```
    *If no date matches, it defaults to "Default".*

---

### 2. The Admin Panel (Scheduler UI)
**File:** `frontend/app/admin.tsx`

The Admin screen has a "Theme Scheduler" section.

-   **UI**: Displays chips for themes (Default, Diwali, Christmas, etc.) and Date Pickers for Start/End dates.
-   **Logic**:
    1.  Admin clicks "Diwali" -> Selects "2024-10-25" to "2024-11-05".
    2.  Clicks "Save Schedule".
    3.  `handleThemeSubmit` function sends a **POST** request to the backend:
        ```javascript
        fetch(`${API_URL}/schedule-theme`, {
            method: 'POST',
            body: JSON.stringify({ 
                themeName: 'Diwali', 
                startDate: '2024-10-25', 
                endDate: '2024-11-05' 
            })
        });
        ```

---

### 3. The User App (Dynamic UI)
**Files:** `frontend/app/context/ThemeContext.tsx` & `frontend/app/(tabs)/index.tsx`

The app does **not** hardcode styles. Instead, it uses a **Theme Context**.

#### The Theme Dictionary (`ThemeContext.tsx`)
We defined a constant `THEMES` object that contains all the hex codes and assets for every festival:
```javascript
const THEMES = {
    Default: { primary: '#6366F1', background: '#F9FAFB', ... },
    Diwali: { primary: '#FFD700', background: '#1a0505', sticker: 'diya.png', ... },
    Christmas: { primary: '#EF4444', background: '#F0FDF4', sticker: 'santa.png', ... },
    // ...
};
```

#### Fetching the Theme
Inside `ThemeContext`, we have a function `fetchTheme()`:
1.  Calls `GET API_URL/current-theme`.
2.  Backend replies: `{ theme: "Diwali" }`.
3.  Context updates state: `setTheme(THEMES["Diwali"])`.

#### Applying the Theme
Any component (like Home Screen) uses the theme values dynamically:
```javascript
// frontend/app/(tabs)/index.tsx
const { theme } = useTheme();

return (
  <View style={{ backgroundColor: theme.background }}>
    <Text style={{ color: theme.primary }}>Hello User!</Text>
  </View>
);
```

---

## 🔄 The Result
Whenever the Admin changes dates:
1.  **Admin** saves new dates to DB.
2.  **User** opens the app.
3.  **App** fetches "Current Theme".
4.  **Backend** sees the date matches the new schedule.
5.  **App** receives the new theme and **instantly transforms** the look and feel (Dark mode for Diwali, Green/Red for Christmas, etc.).
