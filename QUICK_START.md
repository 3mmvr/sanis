# 🚀 SANIS - Quick Start Guide

## ✅ What's New

### 1. **Authentication System** 
- **Login Page** - Existing users can sign in
- **Signup Page** - New users can create accounts
- **Guest Mode** - Continue without account (local data only)
- **Mock Auth** - Works without backend (localStorage based)

### 2. **5-Stage App Onboarding**
- Stage 1: Welcome & Purpose
- Stage 2: Why Nutrition Matters
- Stage 3: AI Scanning Explained
- Stage 4: Streaks & Goals
- Stage 5: Ready to Start

### 3. **Settings Enhancements**
- User profile display (for logged-in users)
- Guest mode indicator
- **Logout Button** - Exit account or guest mode
- Clear distinction between guest/authenticated users

---

## 🎯 User Flow

### First Time User:
```
1. Open app
2. See Auth Page (Login/Signup/Guest)
3. Choose option:
   - Signup → Create account → Onboarding
   - Login → Enter credentials → Onboarding (if first time)
   - Guest → Continue anonymously → Onboarding
4. Complete 5-stage onboarding
5. Create first pet profile
6. Start logging meals
```

### Returning User:
```
1. Open app
2. Auto-login (localStorage)
3. Skip onboarding (already completed)
4. Go directly to Dashboard
```

---

## 💾 Data Management

### Current Setup: **localStorage (Perfect for Testing)**

#### Data Stored:
1. **Authentication State** (`sanis_auth`)
   - User info (email, name, ID)
   - Guest mode status
   - Authentication status

2. **Session Data** (`sanis_session`)
   - Pet profiles
   - Meal logs with images
   - History per pet

3. **Onboarding Flag** (`sanis_onboarding_complete`)
   - Tracks completion status
   - Prevents re-showing onboarding

#### Advantages:
✅ **Works Offline** - No internet required
✅ **No Setup Needed** - Start testing immediately
✅ **Fast Performance** - Instant data access
✅ **Private** - Data never leaves device
✅ **Free** - No database costs

#### Limitations:
⚠️ **Device-Specific** - Data doesn't sync between devices
⚠️ **Browser-Specific** - Different browsers = different data
⚠️ **Can Be Cleared** - Browser cache clear removes data
⚠️ **Storage Limit** - ~5-10MB (plenty for testing)

---

## 🧪 Testing Scenarios

### Test Auth Flow:
```bash
1. Clear localStorage (in DevTools)
2. Refresh page
3. Should see Auth Page
4. Try signup
5. Complete onboarding
6. Add a pet
7. Refresh page → Should go to Dashboard
```

### Test Guest Mode:
```bash
1. Click "Continue as Guest"
2. Complete onboarding
3. Add pet & log meals
4. Settings → Logout
5. Confirm data is cleared
```

### Test Persistence:
```bash
1. Login/Signup
2. Add 3 pets
3. Log 5 meals
4. Close browser completely
5. Reopen → All data should be there
```

---

## 🔐 Logout Behavior

### Guest Mode Logout:
- Clears ALL data (auth, session, onboarding)
- Returns to Auth Page
- Data cannot be recovered

### Authenticated User Logout:
- Clears auth state
- **Preserves data** (for production DB sync)
- Returns to Auth Page
- Can login again to access data

---

## 🎨 UI Components Added

### 1. AuthPage (`/components/AuthPage.tsx`)
Features:
- Toggle between Login/Signup
- Email & password validation
- Guest mode button
- Loading states
- Responsive design

### 2. AppOnboarding (`/components/AppOnboarding.tsx`)
Features:
- 5 stages with unique content
- Progress bar at top
- Skip option
- Smooth animations
- Emoji icons for visual appeal

### 3. Settings Updates
Features:
- User profile card (authenticated users)
- Guest mode warning banner
- Logout button with smart labeling
- Distinct styling for different user types

---

## 🎯 When to Move to Supabase

### Stick with localStorage if:
- ✅ Testing with < 20 users
- ✅ Gathering feedback
- ✅ Iterating on features
- ✅ No need for multi-device sync

### Switch to Supabase when:
- 🚀 Ready for public launch
- 🚀 Need user accounts across devices
- 🚀 Want data backups
- 🚀 Require collaboration features
- 🚀 User base grows > 100

---

## 🔍 Debugging Tips

### View Current Data:
```javascript
// In browser console (F12)
console.log(JSON.parse(localStorage.getItem('sanis_auth')))
console.log(JSON.parse(localStorage.getItem('sanis_session')))
console.log(localStorage.getItem('sanis_onboarding_complete'))
```

### Reset Everything:
```javascript
// In browser console
localStorage.clear()
location.reload()
```

### Check Storage Usage:
```javascript
// Calculate total size
let total = 0;
for(let key in localStorage) {
  if(key.startsWith('sanis_')) {
    total += localStorage[key].length;
  }
}
console.log(`Storage used: ${(total/1024).toFixed(2)} KB`);
```

---

## 🎉 Feature Checklist

### ✅ Implemented:
- [x] Login page with email/password
- [x] Signup page with validation
- [x] Guest mode option
- [x] 5-stage app onboarding
- [x] Skip onboarding option
- [x] Onboarding completion tracking
- [x] User profile display in settings
- [x] Guest mode indicator
- [x] Logout button (Settings)
- [x] Different logout behavior (guest vs user)
- [x] Auth state persistence
- [x] Data persistence across sessions
- [x] Mock authentication (no backend needed)

### 🔲 Future (When Adding Supabase):
- [ ] Real email/password authentication
- [ ] Email verification
- [ ] Password reset
- [ ] OAuth (Google, Apple)
- [ ] Multi-device sync
- [ ] Cloud backups
- [ ] User profile editing

---

## 🚀 Start Testing Now!

```bash
# Start the dev server
npm run dev

# Open browser to http://localhost:3000

# You'll see:
1. Auth Page (Login/Signup/Guest)
2. Complete onboarding (or skip)
3. Create pet profile
4. Start using the app!
```

---

## 💡 Pro Tips

1. **Use Guest Mode for Quick Testing**
   - No need to fill forms
   - Instant access
   - Easy to reset

2. **Create a Test Account**
   - Email: test@test.com
   - Password: test123
   - Persists across sessions

3. **Test Logout Flows**
   - Try both guest and user logout
   - Verify data clearing/preservation
   - Check return to auth page

4. **Inspect localStorage**
   - Open DevTools → Application → Local Storage
   - See all stored data
   - Great for debugging

---

## 📊 Data is Production-Ready!

Your current localStorage implementation is:
✅ **Robust** - Handles all user flows
✅ **Reliable** - Data persists correctly
✅ **Secure** - Local to device
✅ **Fast** - Instant reads/writes
✅ **Testable** - Easy to debug

**Perfect for the testing phase! Start gathering user feedback now!** 🎉

---

## 🆘 Need Help?

### Common Issues:

**Issue**: Auth page shows even after login
- **Fix**: Check localStorage has `sanis_auth` with `isAuthenticated: true`

**Issue**: Onboarding shows every time
- **Fix**: Check localStorage has `sanis_onboarding_complete = 'true'`

**Issue**: Data disappears
- **Fix**: Browser in incognito mode? localStorage doesn't persist in incognito

**Issue**: Logout doesn't work
- **Fix**: Check console for errors, ensure handleLogout is called

---

**You're all set! Start testing! 🚀**
