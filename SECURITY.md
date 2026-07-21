# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in **Potager de Poche**, please do **not** open a public GitHub issue.

Instead, report it privately by contacting the maintainer directly:

- **Email:** genomectra@gmail.com
- **Subject line:** `[SECURITY] Potager de Poche — <brief description>`

### What to include

- A clear description of the vulnerability
- Steps to reproduce (proof-of-concept if possible)
- Potential impact (data exposed, features affected)
- Your suggested fix (optional but appreciated)

### What to expect

| Timeline | Action |
| -------- | ------ |
| **48 h** | Acknowledgement of your report |
| **7 days** | Initial assessment and severity classification |
| **30 days** | Patch released (or a workaround communicated) |

You will be credited in the release notes unless you prefer to remain anonymous.

---

## Scope

This project is a **Progressive Web App** backed by **Firebase Realtime Database** and **Google Authentication**. The following areas are considered in-scope:

- Authentication bypass or session hijacking (Firebase Auth)
- Unauthorized read/write access to another user's garden data (Firebase rules)
- Cross-site scripting (XSS) via plant names, notes, or photo URLs
- Sensitive data exposure (photos, personal notes)
- Insecure Firebase security rules

The following are **out of scope**:

- Vulnerabilities in Firebase / Google infrastructure itself
- Self-XSS requiring physical access to the victim's device
- Theoretical vulnerabilities with no practical impact

---

## Security Measures in Place

- **Authentication:** Google Sign-In via Firebase Auth — no password stored by this app
- **Data isolation:** Firebase Realtime Database rules restrict each user to their own `jardin/` node
- **No server-side code:** the app is purely client-side; no custom backend collects or processes data
- **HTTPS only:** the PWA is served exclusively over HTTPS (Firebase Hosting)
- **Content Security Policy:** recommended headers are documented in `firebase.json`

---

## Disclosure Policy

We follow a **coordinated disclosure** model. Please allow us the 30-day remediation window before publishing details of a vulnerability publicly. We will work with you to agree on a disclosure date if the fix requires more time.

Thank you for helping keep Potager de Poche safe for all its users. 🌿
