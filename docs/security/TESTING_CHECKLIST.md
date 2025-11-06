# 🧪 Security Testing Checklist

This document provides a comprehensive checklist for testing the security improvements implemented in the Univer Frontend application.

---

## 📋 Pre-Testing Setup

### 1. Environment Setup
- [ ] Development environment is running (`yarn dev`)
- [ ] Production build is available (`yarn build`)
- [ ] Browser DevTools (F12) is open
- [ ] Test accounts are available (student, teacher, admin)

### 2. Testing Tools
- [ ] Browser: Chrome/Firefox with DevTools
- [ ] Network tab monitoring enabled
- [ ] React DevTools extension installed (optional)
- [ ] Postman or cURL for API testing

---

## 🔒 XSS (Cross-Site Scripting) Testing

### Test 1: Script Injection in Forum Posts

**Objective:** Verify that script tags are sanitized

**Steps:**
1. Log in as a teacher
2. Navigate to Forum page
3. Create a new topic or reply with the following content:
   ```html
   <script>alert('XSS Attack!')</script>
   <p>This is normal text</p>
   ```
4. Submit the post
5. View the post

**Expected Result:**
- ✅ The `<script>` tag should be removed
- ✅ Only `<p>This is normal text</p>` should be displayed
- ✅ No alert popup should appear
- ✅ F12 Console should not show any script execution

**Status:** [ ] PASS / [ ] FAIL

---

### Test 2: Event Handler Injection

**Objective:** Verify that event handlers are removed

**Steps:**
1. Create a forum post with:
   ```html
   <a href="#" onclick="alert('Clicked!')">Click me</a>
   <img src="invalid" onerror="alert('Error!')">
   ```
2. Submit and view the post
3. Click the link and observe the broken image

**Expected Result:**
- ✅ `onclick` and `onerror` attributes should be removed
- ✅ Link should not trigger any alert
- ✅ Image error should not trigger any script

**Status:** [ ] PASS / [ ] FAIL

---

### Test 3: iframe Injection

**Objective:** Verify that iframes are blocked

**Steps:**
1. Create a forum post with:
   ```html
   <iframe src="https://evil.com/phishing"></iframe>
   ```
2. Submit and view the post

**Expected Result:**
- ✅ iframe should be completely removed
- ✅ No external content should be loaded

**Status:** [ ] PASS / [ ] FAIL

---

## 📝 Logging Security Testing

### Test 4: Token Visibility in Console (Development)

**Objective:** Verify that tokens are not logged in development

**Steps:**
1. Start dev server: `yarn dev`
2. Open F12 > Console
3. Clear console
4. Log in as a student
5. Check console for token-related logs

**Expected Result:**
- ✅ Login should log: `[INFO] [AuthStore] Login successful`
- ✅ Should NOT show: token value, token length, or actual token string
- ✅ Debug logs should be visible (because it's development)

**Status:** [ ] PASS / [ ] FAIL

---

### Test 5: Token Visibility in Console (Production)

**Objective:** Verify that logs are removed in production build

**Steps:**
1. Build production: `NODE_ENV=production yarn build`
2. Serve production build: `yarn preview`
3. Open F12 > Console
4. Clear console
5. Log in as a student
6. Check console for any logs

**Expected Result:**
- ✅ Console should be empty or only show error logs
- ✅ No `[INFO]` or `[DEBUG]` logs should appear
- ✅ No console.log statements should execute

**Status:** [ ] PASS / [ ] FAIL

---

### Test 6: API Error Logging

**Objective:** Verify that API errors are logged appropriately

**Steps:**
1. In development mode
2. Make an invalid API request (e.g., wrong credentials)
3. Check F12 > Console

**Expected Result:**
- ✅ Error should be logged with `[ERROR]` prefix
- ✅ Should include: status code, error message
- ✅ Should NOT include: full response body with sensitive data

**Status:** [ ] PASS / [ ] FAIL

---

## 🔐 Token Security Testing

### Test 7: Token Storage Location

**Objective:** Verify tokens are in sessionStorage, not localStorage

**Steps:**
1. Log in as any user
2. Open F12 > Application > Storage
3. Check both Session Storage and Local Storage

**Expected Result:**
- ✅ `access_token` should be in Session Storage
- ✅ `refresh_token` should be in Session Storage
- ✅ `user_type` should be in Session Storage
- ✅ NO tokens in Local Storage
- ✅ Local Storage should only have: `language-storage`

**Status:** [ ] PASS / [ ] FAIL

---

### Test 8: Token Cleared on Logout

**Objective:** Verify tokens are removed on logout

**Steps:**
1. Log in
2. Check F12 > Application > Session Storage (tokens present)
3. Click Logout
4. Check Session Storage again

**Expected Result:**
- ✅ All tokens should be removed from Session Storage
- ✅ User should be redirected to login page
- ✅ Attempting to access protected pages should redirect to login

**Status:** [ ] PASS / [ ] FAIL

---

### Test 9: Token Expiry and Refresh

**Objective:** Verify token refresh mechanism works

**Steps:**
1. Log in
2. Wait for token to expire (or manually modify token in Session Storage)
3. Make an API request
4. Check F12 > Network tab

**Expected Result:**
- ✅ Should see a refresh token request to `/v1/{user_type}/auth/refresh`
- ✅ New token should be stored in Session Storage
- ✅ Original request should be retried with new token
- ✅ User should NOT be logged out

**Status:** [ ] PASS / [ ] FAIL

---

## 🛡️ Content Security Policy (CSP) Testing

### Test 10: CSP Header Presence

**Objective:** Verify CSP meta tag is present

**Steps:**
1. Open the application
2. Open F12 > Elements/Inspector
3. Find `<head>` section
4. Look for `<meta http-equiv="Content-Security-Policy">`

**Expected Result:**
- ✅ CSP meta tag should be present
- ✅ Should include: `default-src 'self'`
- ✅ Should include: `script-src 'self' 'unsafe-inline' 'unsafe-eval'`
- ✅ Should include: `frame-ancestors 'none'`

**Status:** [ ] PASS / [ ] FAIL

---

### Test 11: CSP Violations

**Objective:** Verify CSP blocks unauthorized resources

**Steps:**
1. Open F12 > Console
2. Navigate through the application
3. Check for any CSP violation warnings

**Expected Result:**
- ✅ No CSP violations should appear
- ✅ All resources should load successfully
- ✅ If violations appear, they should be documented and fixed

**Violations Found (if any):**
```
[List any CSP violations here]
```

**Status:** [ ] PASS / [ ] FAIL

---

## 🏗️ Build Security Testing

### Test 12: Source Maps in Production

**Objective:** Verify source maps are disabled in production

**Steps:**
1. Build production: `NODE_ENV=production yarn build`
2. Check `dist/` folder
3. Look for `.map` files
4. Serve production build: `yarn preview`
5. Open F12 > Sources tab
6. Check if original source code is visible

**Expected Result:**
- ✅ NO `.map` files should exist in `dist/` folder
- ✅ F12 > Sources should show minified code only
- ✅ Original source code should NOT be readable
- ✅ File names should be hashed (e.g., `index-abc123.js`)

**Status:** [ ] PASS / [ ] FAIL

---

### Test 13: Console.log Removal in Production

**Objective:** Verify console.log is removed in production build

**Steps:**
1. Build production: `NODE_ENV=production yarn build`
2. Serve: `yarn preview`
3. Open F12 > Console
4. Perform various actions (login, navigate, logout)

**Expected Result:**
- ✅ No `[DEBUG]` or `[INFO]` logs should appear
- ✅ Only `[ERROR]` logs (if any errors occur) should appear
- ✅ Console should be mostly empty

**Status:** [ ] PASS / [ ] FAIL

---

## 🔓 Permission & Authorization Testing

### Test 14: Frontend Permission Bypass Attempt

**Objective:** Verify that frontend permission checks can be bypassed, but backend rejects

**Steps:**
1. Log in as a student
2. Open F12 > Console
3. Try to modify user role in React DevTools or store
4. Attempt to access teacher/admin pages
5. Check Network tab for API responses

**Expected Result:**
- ✅ Frontend may allow navigation to page
- ✅ API requests should return 401/403 Unauthorized
- ✅ Page should show "Not Found" or error
- ✅ Backend must reject unauthorized requests

**Status:** [ ] PASS / [ ] FAIL

---

### Test 15: Role-Based Access Control

**Objective:** Verify different user roles have appropriate access

**Test Cases:**

| User Type | Can Access Student Pages | Can Access Teacher Pages | Can Access Admin Pages |
|-----------|--------------------------|--------------------------|------------------------|
| Student   | ✅ YES                   | ❌ NO (404)              | ❌ NO (404)           |
| Teacher   | ❌ NO                    | ✅ YES                   | ❌ NO (404)           |
| Admin     | ❌ NO                    | ✅ YES                   | ✅ YES                |

**Status:** [ ] PASS / [ ] FAIL

---

## 🌐 Network Security Testing

### Test 16: HTTPS Enforcement (Production Only)

**Objective:** Verify HTTPS is used in production

**Steps:**
1. Access production site via HTTP: `http://yourdomain.com`
2. Check if redirected to HTTPS

**Expected Result:**
- ✅ Should auto-redirect from HTTP to HTTPS
- ✅ All resources should load over HTTPS
- ✅ Mixed content warnings should not appear

**Status:** [ ] PASS / [ ] FAIL (N/A for development)

---

### Test 17: Sensitive Data in Network Requests

**Objective:** Verify no sensitive data in URL parameters

**Steps:**
1. Log in
2. Open F12 > Network tab
3. Navigate through application
4. Check all request URLs

**Expected Result:**
- ✅ Tokens should be in Authorization header, NOT in URL
- ✅ Passwords should never appear in URLs
- ✅ API keys should be in headers, NOT in query params

**Status:** [ ] PASS / [ ] FAIL

---

## 📱 Session Security Testing

### Test 18: Session Timeout

**Objective:** Verify session expires appropriately

**Steps:**
1. Log in
2. Leave browser open but inactive
3. Wait for token to expire (check JWT expiry time)
4. Try to make an API request
5. Check if redirected to login

**Expected Result:**
- ✅ Expired token should trigger refresh attempt
- ✅ If refresh fails, should redirect to login
- ✅ User should see appropriate error message

**Status:** [ ] PASS / [ ] FAIL

---

### Test 19: Multiple Browser Tabs

**Objective:** Verify session synchronization across tabs

**Steps:**
1. Log in on Tab 1
2. Open Tab 2 with same application
3. Log out from Tab 1
4. Try to navigate in Tab 2

**Expected Result:**
- ✅ Both tabs should share same session (sessionStorage)
- ✅ Logout in one tab affects others
- ✅ Tab 2 should detect logged-out state

**Status:** [ ] PASS / [ ] FAIL

---

### Test 20: Browser Close Behavior

**Objective:** Verify session is cleared when browser closes

**Steps:**
1. Log in
2. Close entire browser (not just tab)
3. Reopen browser
4. Navigate to application

**Expected Result:**
- ✅ User should be logged out
- ✅ Session Storage should be cleared
- ✅ Should redirect to login page

**Status:** [ ] PASS / [ ] FAIL

---

## 🚨 Input Validation Testing

### Test 21: SQL Injection Attempt

**Objective:** Verify SQL injection is prevented

**Steps:**
1. Try logging in with:
   - Login: `admin' OR '1'='1`
   - Password: `password`
2. Try searching with: `'; DROP TABLE users; --`

**Expected Result:**
- ✅ Login should fail with "Invalid credentials"
- ✅ Search should return no results or empty
- ✅ Backend should reject malicious input
- ✅ No database errors in console

**Status:** [ ] PASS / [ ] FAIL

---

### Test 22: HTML Injection in Forms

**Objective:** Verify HTML is escaped in form inputs

**Steps:**
1. Try to input HTML in various forms:
   - Name: `<h1>Test</h1>`
   - Comment: `<script>alert(1)</script>`
2. Submit and view the data

**Expected Result:**
- ✅ HTML should be escaped and displayed as plain text
- ✅ No HTML rendering should occur
- ✅ Data should be stored and retrieved safely

**Status:** [ ] PASS / [ ] FAIL

---

## 📊 Test Summary

### Critical Tests (Must Pass)
- [ ] Test 1: XSS Script Injection
- [ ] Test 2: XSS Event Handlers
- [ ] Test 7: Token Storage Location
- [ ] Test 8: Token Cleared on Logout
- [ ] Test 12: Source Maps Disabled
- [ ] Test 14: Backend Permission Enforcement

### Important Tests
- [ ] Test 4: Development Logging
- [ ] Test 5: Production Logging
- [ ] Test 9: Token Refresh
- [ ] Test 10: CSP Header
- [ ] Test 13: Console.log Removal
- [ ] Test 15: Role-Based Access

### Optional Tests
- [ ] Test 16: HTTPS (Production only)
- [ ] Test 18: Session Timeout
- [ ] Test 20: Browser Close
- [ ] Test 21: SQL Injection
- [ ] Test 22: HTML Injection

---

## 📝 Test Results Summary

**Date:** _________________  
**Tester:** _________________  
**Environment:** [ ] Development [ ] Production

### Overall Results

| Category | Tests Passed | Tests Failed | Pass Rate |
|----------|-------------|--------------|-----------|
| XSS Protection | __ / 3 | __ | __% |
| Logging Security | __ / 3 | __ | __% |
| Token Security | __ / 3 | __ | __% |
| CSP | __ / 2 | __ | __% |
| Build Security | __ / 2 | __ | __% |
| Authorization | __ / 2 | __ | __% |
| Network Security | __ / 2 | __ | __% |
| Session Security | __ / 3 | __ | __% |
| Input Validation | __ / 2 | __ | __% |

**Total:** __ / 22 Tests Passed (__%)

---

## 🐛 Issues Found

### Critical Issues
_List any critical security issues found:_

1. 
2. 
3. 

### Medium Issues
_List any medium-priority issues:_

1. 
2. 
3. 

### Low Issues
_List any low-priority issues:_

1. 
2. 
3. 

---

## ✅ Recommendations

Based on testing results, the following actions are recommended:

### Immediate Actions (Critical)
- [ ] 
- [ ] 
- [ ] 

### Short-term (1-2 weeks)
- [ ] 
- [ ] 
- [ ] 

### Long-term (1+ months)
- [ ] 
- [ ] 
- [ ] 

---

## 📚 Additional Testing Resources

### Manual Testing Tools
- **OWASP ZAP** - Automated security scanner
- **Burp Suite** - Web security testing
- **Browser DevTools** - Built-in testing

### Automated Testing
```bash
# Check for vulnerable dependencies
yarn audit

# Run security scan (if configured)
npx snyk test

# Check for outdated packages
yarn outdated
```

### External Resources
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [MDN Security Best Practices](https://developer.mozilla.org/en-US/docs/Web/Security)
- [React Security Best Practices](https://react.dev/learn/thinking-in-react#security)

---

**Next Review Date:** _________________  
**Reviewed By:** _________________

---
