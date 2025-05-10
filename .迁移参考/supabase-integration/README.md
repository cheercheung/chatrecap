# Supabase Integration

This folder contains all the necessary files to integrate Supabase into your project, including authentication and database operations.

## Setup

1. Install the required dependencies:

```bash
npm install @supabase/supabase-js
# or
yarn add @supabase/supabase-js
# or
pnpm add @supabase/supabase-js
```

2. Add the following environment variables to your `.env` file:

```
SUPABASE_URL = "your-supabase-url"
SUPABASE_ANON_KEY = "your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY = "your-supabase-service-role-key"
```

3. Configure OAuth providers in the Supabase dashboard:
   - Go to Authentication > Providers
   - Enable and configure Google, GitHub, or other providers
   - Set the redirect URL to `https://your-domain.com/auth/callback`

4. Import and use the Supabase client in your application:

```typescript
import { getSupabaseClient } from './supabase-integration/db';

// Use the client
const supabase = getSupabaseClient();
```

## Authentication Integration

### 1. Create Auth Callback Handler

Create a route handler for OAuth callbacks:

```typescript
// app/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/supabase-integration/db';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = getSupabaseClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to the home page or a specific page after authentication
  return NextResponse.redirect(new URL('/', request.url));
}
```

### 2. Create Middleware for Protected Routes

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSupabaseClient } from '@/supabase-integration/db';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = getSupabaseClient();

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();

  // Protected routes
  const protectedPaths = ['/dashboard', '/profile', '/settings'];
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !session) {
    // Redirect to login page if not authenticated
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### 3. Use Authentication Hooks in Components

```typescript
// components/sign/form.tsx
import { useState } from 'react';
import { signInWithEmail, signInWithOAuth } from '@/supabase-integration/models/auth';

export default function SignForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
      // Handle successful sign in
    } catch (error) {
      // Handle error
    }
  };

  const handleOAuthSignIn = async (provider) => {
    try {
      await signInWithOAuth(provider);
      // Auth redirect will happen automatically
    } catch (error) {
      // Handle error
    }
  };

  return (
    // Your form JSX
  );
}
```

### 4. Update Application Context

```typescript
// contexts/app.tsx
import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/supabase-integration/hooks/useAuth';

const AppContext = createContext({});

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading, logout, isAuthenticated } = useAuth();

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
```

## Database Schema

Create the following tables in your Supabase project:

### Users Table

```sql
CREATE TABLE users (
  uuid UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nickname TEXT,
  avatar_url TEXT,
  signin_type TEXT,
  signin_provider TEXT,
  signin_openid TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  signin_ip TEXT
);
```

### Posts Table

```sql
CREATE TYPE post_status AS ENUM ('draft', 'online', 'offline');

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  status post_status DEFAULT 'draft',
  locale TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Usage Examples

### Authentication Operations

```typescript
import {
  signInWithEmail,
  signInWithOAuth,
  signUpWithEmail,
  signOut,
  resetPassword,
  updatePassword,
  getCurrentUser,
  getSession
} from './supabase-integration/models/auth';

// Sign in with email and password
await signInWithEmail('user@example.com', 'password123');

// Sign in with OAuth provider
await signInWithOAuth('google');

// Sign up with email and password
await signUpWithEmail('newuser@example.com', 'password123', {
  nickname: 'New User',
  avatar_url: 'https://example.com/avatar.png'
});

// Sign out
await signOut();

// Reset password
await resetPassword('user@example.com');

// Update password (when user is authenticated)
await updatePassword('newPassword123');

// Get current authenticated user
const user = await getCurrentUser();

// Get current session
const session = await getSession();
```

### Using the Auth Hook

```typescript
import { useAuth } from './supabase-integration/hooks/useAuth';

function ProfileComponent() {
  const { user, loading, logout, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please sign in to view your profile</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.nickname}</h1>
      <img src={user.avatar_url} alt="Profile" />
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
```

### User Operations

```typescript
import { saveUser, getUserByEmail, getUserByUuid } from './supabase-integration/models/user';
import { User } from './supabase-integration/types/user';

// Save a user
const user: User = {
  uuid: 'unique-id',
  email: 'user@example.com',
  nickname: 'User',
  avatar_url: 'https://example.com/avatar.png',
  signin_type: 'oauth',
  signin_provider: 'google',
  signin_openid: '12345',
  created_at: new Date().toISOString(),
  signin_ip: '127.0.0.1'
};

await saveUser(user);

// Get a user by email
const foundUser = await getUserByEmail('user@example.com');

// Get a user by UUID
const userById = await getUserByUuid('unique-id');
```

### Post Operations

```typescript
import { getAllPosts, getPostBySlug, getPostsByLocale } from './supabase-integration/models/post';

// Get all posts
const posts = await getAllPosts(1, 10);

// Get a post by slug
const post = await getPostBySlug('hello-world');

// Get posts by locale
const enPosts = await getPostsByLocale('en', 1, 10);
```

## Migration from NextAuth.js

If you're migrating from NextAuth.js to Supabase Auth, follow these steps:

1. **Replace NextAuth API Routes**:
   - Remove `app/api/auth/[...nextauth]/route.ts`
   - Add `app/auth/callback/route.ts` for OAuth callbacks

2. **Update Auth Configuration**:
   - Remove NextAuth config files (`auth/config.ts`, `auth/index.ts`)
   - Use Supabase client and auth models instead

3. **Update Frontend Components**:
   - Replace `signIn` and `signOut` from NextAuth with Supabase equivalents
   - Replace `useSession` hook with `useAuth` hook

4. **Update Middleware**:
   - Replace NextAuth session checks with Supabase session checks

5. **Update Environment Variables**:
   - Replace NextAuth environment variables with Supabase ones

6. **Configure Supabase Auth**:
   - Set up providers in the Supabase dashboard
   - Configure redirect URLs and allowed domains