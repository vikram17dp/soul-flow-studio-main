# Firebase OTP Authentication Troubleshooting Guide

## Error: `auth/invalid-app-credential`

This error typically occurs when the domain is not properly configured in Firebase Console or there are credential issues.

### Solutions (in order of likelihood):

## 1. **Domain Whitelisting (Most Common Solution)**

### For Localhost Development:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `shuddha-32217`
3. Navigate to **Authentication** → **Settings** → **Authorized domains**
4. Add the following domains:
   - `localhost` (for development)
   - `127.0.0.1` (alternative localhost)
   - Your production domain (if any)

### For Production Deployment:
- Add your production domain (e.g., `yourdomain.com`, `www.yourdomain.com`)

## 2. **Enable Test Phone Numbers (Recommended for Development)**

1. In Firebase Console → **Authentication** → **Settings**
2. Scroll down to **Phone numbers for testing**
3. Add test phone numbers with their corresponding OTP codes:
   - Phone: `+91-1234567890`, Code: `123456`
   - Phone: `+1-5551234567`, Code: `654321`

This allows you to test without sending real SMS messages.

## 3. **reCAPTCHA Configuration**

### For Production:
- Ensure reCAPTCHA Enterprise is properly configured
- Verify domain in reCAPTCHA Console

### For Development:
The code has been updated to:
- Show reCAPTCHA widget on localhost for debugging
- Use normal-sized reCAPTCHA on localhost (easier to solve)
- Disable app verification for localhost testing

## 4. **Firebase Project Settings**

Verify your Firebase configuration in `src/lib/firebase.ts`:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDVMWdEn3QkdQ_c1cXpAkoS257D8Wz5-NM",
  authDomain: "shuddha-32217.firebaseapp.com", 
  projectId: "shuddha-32217",
  // ... other settings
};
```

## 5. **Environment Setup**

1. Copy `.env.example` to `.env.local`
2. Update the values if needed
3. Restart your development server

## 6. **Debugging Steps**

### Check Browser Console:
1. Open Developer Tools (F12)
2. Look for detailed error messages
3. Check Network tab for failed requests

### Verify Domain in Console:
The app will log the current domain - ensure it matches what's in Firebase Console.

## 7. **Alternative Solutions**

### Use Firebase Test Phone Numbers:
If you've added test phone numbers in Firebase Console, use those instead of real numbers:
- Phone: `+91-1234567890`
- OTP: `123456`

### Reset reCAPTCHA:
If reCAPTCHA is causing issues:
1. Clear browser cache
2. Try incognito/private browsing mode
3. Refresh the page

## 8. **Production Checklist**

Before deploying to production:
- [ ] Add production domain to Firebase authorized domains
- [ ] Configure reCAPTCHA Enterprise (if using)
- [ ] Remove test phone numbers from Firebase Console
- [ ] Update environment variables
- [ ] Test with real phone numbers

## 9. **Common Issues & Quick Fixes**

| Issue | Solution |
|-------|----------|
| reCAPTCHA not appearing | Check if container exists, refresh page |
| OTP not received | Use test phone numbers, check spam folder |
| Domain errors | Add domain to Firebase authorized domains |
| Network errors | Check Firebase project status, API limits |

## 10. **Testing the Fixed Implementation**

After applying the fixes:

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Open browser and check console:**
   - Should see logs about Firebase Auth configuration
   - Should see current domain logged

3. **Test with test phone number:**
   - Use: `+91-1234567890`
   - Expected OTP: `123456`

4. **If reCAPTCHA appears:**
   - Solve it (it should be visible on localhost)
   - OTP should be sent immediately for test numbers

## Need More Help?

1. Check the browser console for specific error messages
2. Verify all domains are added in Firebase Console
3. Test with Firebase test phone numbers first
4. Ensure Firebase project has phone authentication enabled

Remember: The most common cause is missing domain authorization in Firebase Console!
