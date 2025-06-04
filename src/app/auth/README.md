# Authentication Implementation

This folder contains the complete authentication system for the EndoConnect application using Supabase Auth.

## Features

- **Email/Password Authentication**: Traditional signup and signin with email confirmation
- **Google OAuth**: One-click signin/signup with Google
- **Password Reset**: Forgot password functionality with email reset links
- **Email Confirmation**: Email verification for new user registrations
- **Protected Routes**: Automatic redirection based on authentication state
- **Responsive UI**: Mobile-friendly authentication forms with Tailwind CSS

## Pages

### `/auth/signin`
- Email/password signin form
- Google OAuth signin button
- Links to signup and forgot password pages
- Displays success messages (e.g., after password reset)

### `/auth/signup`
- Email/password registration form
- Google OAuth signup button
- Password confirmation validation
- Email confirmation flow
- Terms of service and privacy policy links

### `/auth/callback`
- Handles OAuth redirects from Google
- Processes email confirmation links
- Handles authentication state changes
- Redirects to appropriate pages after authentication

### `/auth/forgot-password`
- Email input for password reset requests
- Sends password reset email via Supabase
- Link back to signin page

### `/auth/reset-password`
- Password reset form accessed via email links
- Token validation from URL parameters
- New password confirmation
- Redirects to signin after successful reset

## Authentication Flow

### Email/Password Registration
1. User fills out signup form
2. Supabase sends confirmation email
3. User clicks email link → redirects to `/auth/callback`
4. Callback page processes confirmation
5. User is signed in and redirected to `/welcome`

### Google OAuth Flow
1. User clicks "Continue with Google"
2. Redirected to Google OAuth consent screen
3. After consent, Google redirects to `/auth/callback`
4. Callback page processes OAuth response
5. User is signed in and redirected to `/welcome`

### Password Reset Flow
1. User enters email on forgot password page
2. Supabase sends password reset email
3. User clicks email link → redirects to `/auth/reset-password`
4. User enters new password
5. Password is updated and user redirected to signin

## Configuration

### Environment Variables
Make sure these are set in your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup
1. Enable Email Auth in Supabase dashboard
2. Configure Google OAuth provider
3. Set up email templates for confirmation and password reset
4. Configure redirect URLs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)

## AuthProvider Integration

The auth pages work seamlessly with the `AuthProvider` component:

- **Public Routes**: `/signin`, `/signup`, `/auth/callback`
- **Auto Redirect**: Unauthenticated users → signin, Authenticated users → welcome
- **State Management**: Real-time auth state updates across the app
- **Session Handling**: Automatic token refresh and session management

## Styling

All pages use Tailwind CSS with:
- Consistent indigo color scheme
- Responsive design (mobile-first)
- Loading states and disabled buttons
- Error and success message styling
- Accessible form elements with proper labels

## Error Handling

- Form validation (password length, email format, password confirmation)
- Supabase error messages displayed to users
- Network error handling
- Invalid token/link validation
- Graceful fallbacks for authentication failures

## Security Features

- Client-side form validation
- Server-side validation via Supabase
- Secure token handling for password resets
- CSRF protection via Supabase
- Email confirmation requirement for new accounts
- Password strength requirements (minimum 6 characters)

## Usage

Import and use the auth pages in your Next.js app:

```typescript
// The pages are automatically available at:
// /auth/signin
// /auth/signup
// /auth/callback
// /auth/forgot-password
// /auth/reset-password

// Use the AuthProvider to check auth state:
import { useAuth } from '@/providers/AuthProvider';

function MyComponent() {
  const { user, signOut } = useAuth();
  
  if (!user) {
    // User will be automatically redirected to signin
    return null;
  }
  
  return <div>Welcome, {user.email}!</div>;
}
```

## Customization

To customize the auth pages:

1. **Styling**: Modify Tailwind classes in each page component
2. **Branding**: Update logos, colors, and copy
3. **Validation**: Add custom validation rules in form handlers
4. **Redirects**: Modify redirect URLs in AuthProvider and callback handlers
5. **Fields**: Add additional form fields (name, profile info, etc.)

## Testing

To test the authentication flow:

1. Start your Next.js development server
2. Navigate to `/auth/signin` or `/auth/signup`
3. Test email/password flow (check your email for confirmation)
4. Test Google OAuth flow (ensure Google OAuth is configured)
5. Test password reset flow
6. Verify redirects work correctly based on auth state 