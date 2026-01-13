# Authentication & User Management Setup

## ✅ What's Been Implemented

### **1. Complete Authentication System**

- **User Model** with fields:
  - `username` - Unique username (lowercase)
  - `password` - Hashed password (bcrypt)
  - `displayName` - User's display name
  - `isAdmin` - Administrator role flag
  - `isActive` - Account activation status
  - `languagePreference` - Language choice (en/zh)

- **Authentication Features**:
  - JWT-based session management
  - HTTP-only secure cookies
  - Password hashing with bcrypt
  - Session persistence (7-day expiry)

### **2. API Routes**

- **Auth Routes**:
  - `POST /api/auth/login` - Login with username/password
  - `POST /api/auth/logout` - Logout and clear session
  - `GET /api/auth/session` - Check current session

- **User Management Routes**:
  - `GET /api/users` - List all users (admin only)
  - `POST /api/users` - Create new user (admin only)
  - `PATCH /api/users/[id]` - Update user (admin or self)
  - `DELETE /api/users/[id]` - Delete user (admin only, can't delete self)

### **3. Pages**

#### **Login Page** (`/login`)
- Username and password fields
- Error handling
- Auto-redirect after successful login

#### **Profile Page** (`/profile`)
Users can:
- View account information (username, role)
- Update display name
- Change language preference (English/中文)
- Change password with current password verification

#### **Admin User Management** (`/admin/users`)
Administrators can:
- View all users
- Create new users (display name, username, password)
- Toggle user active/inactive status with switch
- Delete users (except themselves)
- See user details (language, created date, role)

### **4. UI Components**

- **TopNavigation**:
  - Shows Event Tracking and Production Management tabs
  - User menu with Profile, Admin (if admin), and Logout buttons
  - Displays current user's display name
  - Auto-redirects to login if not authenticated

- **AuthContext**:
  - Global authentication state
  - Login/logout functions
  - User session management
  - Language preference updates

### **5. Security Features**

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with 7-day expiry
- HTTP-only cookies (prevents XSS)
- Secure cookies in production
- Admin can't delete themselves
- Admin can't deactivate themselves
- Users can only update their own profile (except admin)

## 📦 Setup Instructions

### **Step 1: Ensure MongoDB is Running**

The seed script requires a MongoDB connection. Update your `.env.local`:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
```

### **Step 2: Create Admin User**

Run the seed script to create the default admin user:

```bash
npm run seed:admin
```

This creates:
- **Username**: `admin`
- **Password**: `admin`
- **Role**: Administrator

⚠️ **IMPORTANT**: Change the admin password immediately after first login!

### **Step 3: Start the Application**

```bash
npm run dev
```

### **Step 4: Login**

1. Navigate to `http://localhost:3000`
2. You'll be redirected to `/login`
3. Login with `admin` / `admin`
4. Go to Profile and change your password

## 🎯 Using the System

### **As Admin**

1. **Create Users**:
   - Click "Admin" in the top navigation
   - Click "Create User" button
   - Fill in display name, username, and password
   - User is created as active by default

2. **Manage Users**:
   - View all users in the list
   - Toggle Active/Inactive switch for any user (except yourself)
   - Delete users with the trash icon (except yourself)
   - See user details (language preference, creation date)

### **As Regular User**

1. **Update Profile**:
   - Click "Profile" in the top navigation
   - Change your display name
   - Select language preference (English or 中文)
   - Click "Save Profile"

2. **Change Password**:
   - Go to Profile page
   - Enter current password
   - Enter new password (min 4 characters)
   - Confirm new password
   - Click "Change Password"

### **Logout**

- Click "Logout" button in the top navigation
- You'll be redirected to the login page

## 🔒 Permission System

### **Admin Users** (`isAdmin: true`)
- Access all features
- Manage users (create, activate/deactivate, delete)
- Access admin panel
- Cannot delete or deactivate themselves

### **Regular Users** (`isAdmin: false`)
- Access Event Tracking and Production Management
- Update their own profile
- Change their own password
- Cannot access admin features

### **Inactive Users** (`isActive: false`)
- Cannot login
- Receive error message: "Account is disabled. Please contact administrator."

## 📝 API Usage Examples

### **Login**
```typescript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin' }),
});
const data = await response.json();
// Returns: { user: { id, username, displayName, isAdmin, languagePreference } }
```

### **Check Session**
```typescript
const response = await fetch('/api/auth/session');
const data = await response.json();
// Returns: { user: {...} } or { user: null }
```

### **Create User** (Admin only)
```typescript
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'newuser',
    password: 'password123',
    displayName: 'New User',
  }),
});
```

### **Update User**
```typescript
const response = await fetch(`/api/users/${userId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    displayName: 'Updated Name',
    languagePreference: 'zh',
    isActive: false, // Admin only
  }),
});
```

## 🌐 Next Steps for i18n

To add full Chinese localization:

1. **Create translation files**:
   - `/messages/en.json`
   - `/messages/zh.json`

2. **Set up next-intl**:
   - Configure i18n provider
   - Wrap app with IntlProvider
   - Use language preference from user profile

3. **Translate all text**:
   - Navigation labels
   - Form labels and placeholders
   - Button text
   - Error messages
   - Success messages

4. **Add language switcher** (already prepared):
   - User language preference saves to database
   - Can be used to determine display language

The foundation is ready - just need to add the translation files and wrap components with translation functions!

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env.local`
- For MongoDB Atlas, whitelist your IP address

### "Invalid username or password"
- Username is case-insensitive
- Default admin credentials: `admin` / `admin`
- Try running seed script again

### "Account is disabled"
- Contact administrator to activate your account
- Admin can toggle the Active switch in the user management panel

### Can't access admin panel
- Ensure your user has `isAdmin: true`
- Only admin user created by seed script has this by default
- Regular users cannot access `/admin/users`

## ✨ Features Summary

- ✅ Secure authentication with JWT
- ✅ User login/logout
- ✅ Profile management with language preference
- ✅ Password change with verification
- ✅ Admin user management panel
- ✅ Create users with display name, username, password
- ✅ Activate/deactivate users
- ✅ Delete users (with protection)
- ✅ Role-based access control
- ✅ Session persistence
- ✅ Auto-redirect to login when not authenticated
- ✅ Language preference saving (ready for i18n)
- ⏳ Full Chinese localization (next step)
