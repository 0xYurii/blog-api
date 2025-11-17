# Testing Guide - Authentication & Profile Features

This guide will help you test the newly added signup and profile features in both frontends.

## 🎯 Prerequisites

Make sure all three applications are running:

```bash
# Terminal 1: Backend
cd backend && npm run dev
# Should be running on http://localhost:3000

# Terminal 2: Blog Reader
cd blog-reader && npm run dev
# Should be running on http://localhost:5173

# Terminal 3: Blog CMS
cd blog-cms && npm run dev
# Should be running on http://localhost:5174
```

---

## 📘 Testing blog-reader (Public Site)

### Test 1: Signup New Account

1. Visit http://localhost:5173/
2. Click **"Sign Up"** in the header
3. Fill in the signup form:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
4. Click **"Sign Up"**
5. ✅ You should be redirected to your profile page

### Test 2: View Profile

1. After signup, you should see your profile page with:
   - ✅ Avatar circle with your initial (T)
   - ✅ Your username (testuser)
   - ✅ Your email (test@example.com)
   - ✅ Member since date (today's date)
2. Click **"Browse Posts"** to return to home page

### Test 3: Login

1. Click **"Logout"** in the header
2. Click **"Login"** in the header
3. Enter your credentials:
   - Email: `test@example.com`
   - Password: `password123`
4. Click **"Login"**
5. ✅ You should be redirected to your profile page

### Test 4: Commenting as Logged-In User

1. From home page, click on any post
2. Scroll to the comment section
3. ✅ Notice: You should ONLY see the "Content" field (no name/email required)
4. Write a comment and submit
5. ✅ Your comment should appear with your username

### Test 5: Commenting as Anonymous User

1. Click **"Logout"** in the header
2. Click on any post
3. Scroll to comment section
4. ✅ Notice: You should see "Name", "Email", and "Content" fields
5. Fill all fields and submit
6. ✅ Your comment should appear with the name you provided

---

## 💼 Testing blog-cms (Author Dashboard)

### Test 1: Signup New Author

1. Visit http://localhost:5174/
2. Click **"Sign Up"** in the header
3. Fill in the signup form:
   - Username: `author1`
   - Email: `author1@example.com`
   - Password: `author123`
   - Confirm Password: `author123`
4. Click **"Sign Up"**
5. ✅ You should be redirected to the dashboard

### Test 2: View Profile Statistics

1. Click **"Profile"** in the header
2. ✅ You should see your profile with:
   - Avatar circle with initial (A)
   - Username (author1)
   - Email (author1@example.com)
   - Member since date
   - Statistics cards:
     - Total Posts: 0
     - Published: 0
     - Drafts: 0
     - Comments: 0

### Test 3: Create Posts and Check Stats

1. Click **"View My Posts"** or **"Dashboard"**
2. Click **"Create New Post"**
3. Create a post:
   - Title: "My First Post"
   - Content: "This is my first blog post!"
4. Click **"Create Post"**
5. ✅ You should be back at the dashboard with your post listed
6. Click **"Profile"** again
7. ✅ Statistics should now show:
   - Total Posts: 1
   - Published: 0 (post is draft by default)
   - Drafts: 1
   - Comments: 0

### Test 4: Publish Post and Update Stats

1. From dashboard, click **"Publish"** on your post
2. Click **"Profile"** again
3. ✅ Statistics should now show:
   - Total Posts: 1
   - Published: 1
   - Drafts: 0

### Test 5: Login After Logout

1. Click **"Logout"** in the header
2. ✅ You should be redirected to the login page
3. Click **"Sign up here"** link to verify it works
4. Click **"Login here"** link to go back to login
5. Enter your credentials and login
6. ✅ You should be back at the dashboard

---

## 🔐 Testing Password Validation

### Test in Signup (both frontends):

1. Try submitting with empty fields
   - ✅ Should show: "Please fill in all fields"

2. Try passwords that don't match
   - Password: `password123`
   - Confirm: `password456`
   - ✅ Should show: "Passwords do not match"

3. Try password less than 6 characters
   - Password: `pass`
   - ✅ Should show: "Password must be at least 6 characters"

---

## 🎨 Testing UI/UX

### Header Navigation (blog-reader):

**When NOT logged in:**
- ✅ Should show: Home | Login | Sign Up

**When logged in:**
- ✅ Should show: Home | Profile | Logout

### Header Navigation (blog-cms):

**When NOT logged in:**
- ✅ Should show: Login | Sign Up

**When logged in:**
- ✅ Should show: Dashboard | New Post | Profile | Logout

---

## 📱 Testing Responsive Design

1. Open browser developer tools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1200px)

✅ Verify that:
- Profile cards stack vertically on mobile
- Statistics grid adjusts to 2 columns on mobile
- Auth forms remain centered and readable
- Navigation header stacks appropriately

---

## ✨ Expected Behavior Summary

**blog-reader:**
- ✅ Anonymous users can read posts and comment with name/email
- ✅ Logged-in users can comment without providing name/email
- ✅ Profile shows account information
- ✅ Smooth login/signup flow

**blog-cms:**
- ✅ Only authenticated users can access dashboard, posts, and profile
- ✅ Profile shows comprehensive statistics about posts and comments
- ✅ Protected routes redirect to login when not authenticated
- ✅ Signup/login work seamlessly

---

## 🐛 Troubleshooting

**Issue: "Failed to fetch" errors**
- Make sure backend is running on http://localhost:3000
- Check browser console for CORS errors

**Issue: "Unauthorized" or redirect to login**
- Token may have expired
- Try logging out and logging in again

**Issue: Comments not showing username**
- Make sure you're logged in when commenting
- Check that the token is stored in localStorage

**Issue: Stats not updating**
- Try refreshing the profile page
- Make sure you're viewing posts created by the logged-in user

---

## 🎉 Success Criteria

All features are working correctly if you can:
- ✅ Create a new account in both frontends
- ✅ Login and logout successfully
- ✅ View your profile with correct information
- ✅ See accurate statistics in CMS profile
- ✅ Comment as both anonymous and logged-in user
- ✅ Navigate between pages without issues
- ✅ See proper validation messages

---

Happy testing! 🚀
