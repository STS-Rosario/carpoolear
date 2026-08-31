# Security Fix for STS-Rosario/carpoolear

## Summary

This PR addresses 64 security finding(s) in this repository.

## Findings

### Google API Key (CWE-798)

- **File:** `.env.production:22`
- **Severity:** HIGH
- **CWE:** [CWE-798](https://cwe.mitre.org/data/definitions/798.html)
- **Description:** A potential Google API Key was found in `.env.production` at line 22. This could lead to unauthorized access if exposed.
- **Recommended Fix:** Remove the hardcoded secret and use environment variables or a secrets manager instead.

```diff
- AIzaSyCwecybmdmiWUehjZBT30RZXWKgiNnP7XI
+ # Use environment variable: process.env.GOOGLE_API_KEY
```

### Container runs as root (no USER directive)

- **File:** `Dockerfile:24`
- **Severity:** HIGH
- **CWE:** [CWE-250](https://cwe.mitre.org/data/definitions/250.html)
- **Description:** The Dockerfile does not specify a non-root user. Containers running as root have elevated privileges and are a security risk.
- **Recommended Fix:** Add a non-root user:
```dockerfile
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
```

### Container runs as root (no USER directive)

- **File:** `docker-compose.yml:24`
- **Severity:** HIGH
- **CWE:** [CWE-250](https://cwe.mitre.org/data/definitions/250.html)
- **Description:** The Dockerfile does not specify a non-root user. Containers running as root have elevated privileges and are a security risk.
- **Recommended Fix:** Add a non-root user:
```dockerfile
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
```

### Deep nesting: anonymous_172 (7 levels)

- **File:** `movilizame.js:173`
- **Severity:** HIGH
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** Function `anonymous_172` has 7 levels of nesting. Deep nesting reduces readability.
- **Recommended Fix:** Use early returns or extract nested logic into helper functions.

### Dangerous npm script: postinstall

- **File:** `package.json`
- **Severity:** HIGH
- **CWE:** [CWE-94](https://cwe.mitre.org/data/definitions/94.html)
- **Description:** The `postinstall` script runs automatically and can be exploited.
- **Recommended Fix:** Review and remove if unnecessary:
```diff
- "postinstall": "npm run setup-git-hooks"
```

### Deep nesting: dirname (7 levels)

- **File:** `vite.config.js:9`
- **Severity:** HIGH
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** Function `dirname` has 7 levels of nesting. Deep nesting reduces readability.
- **Recommended Fix:** Use early returns or extract nested logic into helper functions.

### Deep nesting: bundle (7 levels)

- **File:** `vite.config.js:11`
- **Severity:** HIGH
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** Function `bundle` has 7 levels of nesting. Deep nesting reduces readability.
- **Recommended Fix:** Use early returns or extract nested logic into helper functions.

### Deep nesting: anonymous_11 (7 levels)

- **File:** `vite.config.js:12`
- **Severity:** HIGH
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** Function `anonymous_11` has 7 levels of nesting. Deep nesting reduces readability.
- **Recommended Fix:** Use early returns or extract nested logic into helper functions.

### High cyclomatic complexity: defineConfig (26)

- **File:** `vite.config.js:98`
- **Severity:** HIGH
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** Function `defineConfig` has cyclomatic complexity of 26. High complexity makes code harder to test and maintain.
- **Recommended Fix:** Break down into smaller functions:
```diff
- function defineConfig() { /* complex logic */ }
+ function defineConfigPart1() { ... }
+ function defineConfigPart2() { ... }
```

### Long function: defineConfig (161 lines)

- **File:** `vite.config.js:98`
- **Severity:** HIGH
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** Function `defineConfig` is 161 lines long. Long functions are harder to understand and maintain.
- **Recommended Fix:** Extract helper functions or use early returns.

### Deep nesting: defineConfig (7 levels)

- **File:** `vite.config.js:98`
- **Severity:** HIGH
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** Function `defineConfig` has 7 levels of nesting. Deep nesting reduces readability.
- **Recommended Fix:** Use early returns or extract nested logic into helper functions.

### Overly broad permissions

- **File:** `.github/workflows/update-snapshots.yml:6`
- **Severity:** HIGH
- **CWE:** [CWE-269](https://cwe.mitre.org/data/definitions/269.html)
- **Description:** Workflows with write-all permissions can modify repository contents.
- **Recommended Fix:** Use least-privilege permissions:
```diff
- permissions: write-all
+ permissions:
+   contents: read
```

### Insecure HTTP URL detected

- **File:** `.env.development:5`
- **Severity:** MEDIUM
- **CWE:** [CWE-319](https://cwe.mitre.org/data/definitions/319.html)
- **Description:** HTTP transmits data in plaintext. Use HTTPS for all external communications.
- **Recommended Fix:** Use HTTPS:
```diff
- const url = 'http://api.example.com'
+ const url = 'https://api.example.com'
```

### Insecure HTTP URL detected

- **File:** `.env.example:4`
- **Severity:** MEDIUM
- **CWE:** [CWE-319](https://cwe.mitre.org/data/definitions/319.html)
- **Description:** HTTP transmits data in plaintext. Use HTTPS for all external communications.
- **Recommended Fix:** Use HTTPS:
```diff
- const url = 'http://api.example.com'
+ const url = 'https://api.example.com'
```

### Long function: components (51 lines)

- **File:** `CLAUDE.md:10`
- **Severity:** MEDIUM
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** Function `components` is 51 lines long. Long functions are harder to understand and maintain.
- **Recommended Fix:** Extract helper functions or use early returns.

### Using 'latest' tag: base

- **File:** `Dockerfile:6`
- **Severity:** MEDIUM
- **CWE:** [CWE-829](https://cwe.mitre.org/data/definitions/829.html)
- **Description:** Using the 'latest' tag makes builds non-reproducible and may pull untested versions.
- **Recommended Fix:** Pin to a specific version:
```dockerfile
- FROM node:latest
+ FROM node:20-alpine
```

### Using 'latest' tag: base

- **File:** `Dockerfile:13`
- **Severity:** MEDIUM
- **CWE:** [CWE-829](https://cwe.mitre.org/data/definitions/829.html)
- **Description:** Using the 'latest' tag makes builds non-reproducible and may pull untested versions.
- **Recommended Fix:** Pin to a specific version:
```dockerfile
- FROM node:latest
+ FROM node:20-alpine
```

### Long function: build (77 lines)

- **File:** `README.md:63`
- **Severity:** MEDIUM
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** Function `build` is 77 lines long. Long functions are harder to understand and maintain.
- **Recommended Fix:** Extract helper functions or use early returns.

### Long function: assets (65 lines)

- **File:** `README.md:75`
- **Severity:** MEDIUM
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** Function `assets` is 65 lines long. Long functions are harder to understand and maintain.
- **Recommended Fix:** Extract helper functions or use early returns.

### Long function: tests (52 lines)

- **File:** `README.md:88`
- **Severity:** MEDIUM
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** Function `tests` is 52 lines long. Long functions are harder to understand and maintain.
- **Recommended Fix:** Extract helper functions or use early returns.

### Hardcoded public IP: 104.131.15.228

- **File:** `gulpfile.js:68`
- **Severity:** MEDIUM
- **CWE:** [CWE-200](https://cwe.mitre.org/data/definitions/200.html)
- **Description:** Hardcoded public IPs can leak infrastructure details and make migration difficult.
- **Recommended Fix:** Use environment variables or DNS names:
```diff
- const apiHost = '203.0.113.50'
+ const apiHost = process.env.API_HOST
```

### Hardcoded public IP: 104.131.15.228

- **File:** `gulpfile.js:75`
- **Severity:** MEDIUM
- **CWE:** [CWE-200](https://cwe.mitre.org/data/definitions/200.html)
- **Description:** Hardcoded public IPs can leak infrastructure details and make migration difficult.
- **Recommended Fix:** Use environment variables or DNS names:
```diff
- const apiHost = '203.0.113.50'
+ const apiHost = process.env.API_HOST
```

### Hardcoded public IP: 45.55.196.14

- **File:** `gulpfile.js:80`
- **Severity:** MEDIUM
- **CWE:** [CWE-200](https://cwe.mitre.org/data/definitions/200.html)
- **Description:** Hardcoded public IPs can leak infrastructure details and make migration difficult.
- **Recommended Fix:** Use environment variables or DNS names:
```diff
- const apiHost = '203.0.113.50'
+ const apiHost = process.env.API_HOST
```

### Long function: task (56 lines)

- **File:** `gulpfile.js:42`
- **Severity:** MEDIUM
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** Function `task` is 56 lines long. Long functions are harder to understand and maintain.
- **Recommended Fix:** Extract helper functions or use early returns.

### Deep nesting: readFileSync (6 levels)

- **File:** `movilizame.js:175`
- **Severity:** MEDIUM
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** Function `readFileSync` has 6 levels of nesting. Deep nesting reduces readability.
- **Recommended Fix:** Use early returns or extract nested logic into helper functions.

### Deep nesting: xmlParser (6 levels)

- **File:** `movilizame.js:176`
- **Severity:** MEDIUM
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** Function `xmlParser` has 6 levels of nesting. Deep nesting reduces readability.
- **Recommended Fix:** Use early returns or extract nested logic into helper functions.

### Deep nesting: if (5 levels)

- **File:** `movilizame.js:177`
- **Severity:** MEDIUM
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** Function `if` has 5 levels of nesting. Deep nesting reduces readability.
- **Recommended Fix:** Use early returns or extract nested logic into helper functions.

### Long function: if (70 lines)

- **File:** `movilizame.js:198`
- **Severity:** MEDIUM
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** Function `if` is 70 lines long. Long functions are harder to understand and maintain.
- **Recommended Fix:** Extract helper functions or use early returns.

### Deep nesting: if (5 levels)

- **File:** `movilizame.js:198`
- **Severity:** MEDIUM
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** Function `if` has 5 levels of nesting. Deep nesting reduces readability.
- **Recommended Fix:** Use early returns or extract nested logic into helper functions.

### Long function: loadAppVersion (66 lines)

- **File:** `movilizame.js:201`
- **Severity:** MEDIUM
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** Function `loadAppVersion` is 66 lines long. Long functions are harder to understand and maintain.
- **Recommended Fix:** Extract helper functions or use early returns.

### Long function: switch (65 lines)

- **File:** `movilizame.js:202`
- **Severity:** MEDIUM
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** Function `switch` is 65 lines long. Long functions are harder to understand and maintain.
- **Recommended Fix:** Extract helper functions or use early returns.

### Long function: anonymous_3568 (66 lines)

- **File:** `package-lock.json:3569`
- **Severity:** MEDIUM
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** Function `anonymous_3568` is 66 lines long. Long functions are harder to understand and maintain.
- **Recommended Fix:** Extract helper functions or use early returns.

### Long function: anonymous_3575 (59 lines)

- **File:** `package-lock.json:3576`
- **Severity:** MEDIUM
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** Function `anonymous_3575` is 59 lines long. Long functions are harder to understand and maintain.
- **Recommended Fix:** Extract helper functions or use early returns.

### Long function: anonymous_3576 (58 lines)

- **File:** `package-lock.json:3577`
- **Severity:** MEDIUM
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** Function `anonymous_3576` is 58 lines long. Long functions are harder to understand and maintain.
- **Recommended Fix:** Extract helper functions or use early returns.

### Long function: anonymous_3578 (56 lines)

- **File:** `package-lock.json:3579`
- **Severity:** MEDIUM
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** Function `anonymous_3578` is 56 lines long. Long functions are harder to understand and maintain.
- **Recommended Fix:** Extract helper functions or use early returns.

### Large file: 24131 lines

- **File:** `package-lock.json`
- **Severity:** MEDIUM
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** File has 24131 lines. Large files are harder to navigate and maintain.
- **Recommended Fix:** Split into smaller, focused modules.

### HTTP (not HTTPS) (CWE-319)

- **File:** `vite.config.js:122`
- **Severity:** MEDIUM
- **CWE:** [CWE-319](https://cwe.mitre.org/data/definitions/319.html)
- **Description:** HTTP (not HTTPS) detected in `vite.config.js` at line 122. This pattern is commonly associated with security vulnerabilities.
- **Recommended Fix:** Use HTTPS instead of HTTP for external URLs.

### HTTP (not HTTPS) (CWE-319)

- **File:** `vite.config.js:223`
- **Severity:** MEDIUM
- **CWE:** [CWE-319](https://cwe.mitre.org/data/definitions/319.html)
- **Description:** HTTP (not HTTPS) detected in `vite.config.js` at line 223. This pattern is commonly associated with security vulnerabilities.
- **Recommended Fix:** Use HTTPS instead of HTTP for external URLs.

### Insecure HTTP URL detected

- **File:** `vite.config.js:122`
- **Severity:** MEDIUM
- **CWE:** [CWE-319](https://cwe.mitre.org/data/definitions/319.html)
- **Description:** HTTP transmits data in plaintext. Use HTTPS for all external communications.
- **Recommended Fix:** Use HTTPS:
```diff
- const url = 'http://api.example.com'
+ const url = 'https://api.example.com'
```

### Insecure HTTP URL detected

- **File:** `vite.config.js:223`
- **Severity:** MEDIUM
- **CWE:** [CWE-319](https://cwe.mitre.org/data/definitions/319.html)
- **Description:** HTTP transmits data in plaintext. Use HTTPS for all external communications.
- **Recommended Fix:** Use HTTPS:
```diff
- const url = 'http://api.example.com'
+ const url = 'https://api.example.com'
```

### Deep nesting: closeBundle (5 levels)

- **File:** `vite.config.js:16`
- **Severity:** MEDIUM
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** Function `closeBundle` has 5 levels of nesting. Deep nesting reduces readability.
- **Recommended Fix:** Use early returns or extract nested logic into helper functions.

### High cyclomatic complexity: loadEnv (16)

- **File:** `vite.config.js:99`
- **Severity:** MEDIUM
- **CWE:** [CWE-1127](https://cwe.mitre.org/data/definitions/1127.html)
- **Description:** Function `loadEnv` has cyclomatic complexity of 16. High complexity makes code harder to test and maintain.
- **Recommended Fix:** Break down into smaller functions:
```diff
- function loadEnv() { /* complex logic */ }
+ function loadEnvPart1() { ... }
+ function loadEnvPart2() { ... }
```

### Unpinned action: stefanzweifel/git-auto-commit-action

- **File:** `.github/workflows/update-snapshots.yml:45`
- **Severity:** MEDIUM
- **CWE:** [CWE-829](https://cwe.mitre.org/data/definitions/829.html)
- **Description:** Using branch refs instead of SHA pins allows malicious updates.
- **Recommended Fix:** Pin actions to full SHA:
```diff
- uses: owner/action@main
+ uses: owner/action@abc123def456
```

### No license specified in package.json

- **File:** `package.json`
- **Severity:** MEDIUM
- **CWE:** [CWE-502](https://cwe.mitre.org/data/definitions/502.html)
- **Description:** Without a license, the default copyright laws apply and others cannot use your code.
- **Recommended Fix:** Add a license field:
```json
{
  "license": "MIT"
}
```

### No HEALTHCHECK instruction

- **File:** `Dockerfile:24`
- **Severity:** LOW
- **CWE:** [CWE-693](https://cwe.mitre.org/data/definitions/693.html)
- **Description:** Without HEALTHCHECK, orchestrators cannot determine if the container is healthy.
- **Recommended Fix:** Add a healthcheck:
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3000/health || exit 1
```

### No HEALTHCHECK instruction

- **File:** `docker-compose.yml:24`
- **Severity:** LOW
- **CWE:** [CWE-693](https://cwe.mitre.org/data/definitions/693.html)
- **Description:** Without HEALTHCHECK, orchestrators cannot determine if the container is healthy.
- **Recommended Fix:** Add a healthcheck:
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3000/health || exit 1
```

### Artifacts uploaded

- **File:** `.github/workflows/frontend-tests.yml:44`
- **Severity:** LOW
- **CWE:** [CWE-200](https://cwe.mitre.org/data/definitions/200.html)
- **Description:** Uploaded artifacts may contain sensitive data and are accessible to collaborators.
- **Recommended Fix:** Ensure artifacts do not contain secrets or sensitive data.

### Line exceeds 120 characters

- **File:** `README.md:5`
- **Severity:** INFO
- **CWE:** [CWE-116](https://cwe.mitre.org/data/definitions/116.html)
- **Description:** Long lines may be hard to read in some editors.
- **Recommended Fix:** Break long lines for better readability.

### Line exceeds 120 characters

- **File:** `README.md:7`
- **Severity:** INFO
- **CWE:** [CWE-116](https://cwe.mitre.org/data/definitions/116.html)
- **Description:** Long lines may be hard to read in some editors.
- **Recommended Fix:** Break long lines for better readability.

### Line exceeds 120 characters

- **File:** `README.md:11`
- **Severity:** INFO
- **CWE:** [CWE-116](https://cwe.mitre.org/data/definitions/116.html)
- **Description:** Long lines may be hard to read in some editors.
- **Recommended Fix:** Break long lines for better readability.

### Line exceeds 120 characters

- **File:** `README.md:13`
- **Severity:** INFO
- **CWE:** [CWE-116](https://cwe.mitre.org/data/definitions/116.html)
- **Description:** Long lines may be hard to read in some editors.
- **Recommended Fix:** Break long lines for better readability.

### Line exceeds 120 characters

- **File:** `README.md:73`
- **Severity:** INFO
- **CWE:** [CWE-116](https://cwe.mitre.org/data/definitions/116.html)
- **Description:** Long lines may be hard to read in some editors.
- **Recommended Fix:** Break long lines for better readability.

### Line exceeds 120 characters

- **File:** `README.md:75`
- **Severity:** INFO
- **CWE:** [CWE-116](https://cwe.mitre.org/data/definitions/116.html)
- **Description:** Long lines may be hard to read in some editors.
- **Recommended Fix:** Break long lines for better readability.

### Line exceeds 120 characters

- **File:** `README.md:77`
- **Severity:** INFO
- **CWE:** [CWE-116](https://cwe.mitre.org/data/definitions/116.html)
- **Description:** Long lines may be hard to read in some editors.
- **Recommended Fix:** Break long lines for better readability.

### Line exceeds 120 characters

- **File:** `README.md:79`
- **Severity:** INFO
- **CWE:** [CWE-116](https://cwe.mitre.org/data/definitions/116.html)
- **Description:** Long lines may be hard to read in some editors.
- **Recommended Fix:** Break long lines for better readability.

### Multiple blank lines

- **File:** `README.md:157`
- **Severity:** INFO
- **CWE:** [CWE-116](https://cwe.mitre.org/data/definitions/116.html)
- **Description:** Multiple consecutive blank lines reduce readability.
- **Recommended Fix:** Remove extra blank lines.

### Line exceeds 120 characters

- **File:** `README.md:160`
- **Severity:** INFO
- **CWE:** [CWE-116](https://cwe.mitre.org/data/definitions/116.html)
- **Description:** Long lines may be hard to read in some editors.
- **Recommended Fix:** Break long lines for better readability.

### Command Injection (CWE-78)

- **File:** `gulpfile.js:35`
- **Severity:** CRITICAL
- **CWE:** [CWE-78](https://cwe.mitre.org/data/definitions/78.html)
- **Description:** Command Injection detected in `gulpfile.js` at line 35. This pattern is commonly associated with security vulnerabilities.
- **Recommended Fix:** Use subprocess with list arguments:
```diff
- os.exec(f'rm -rf {path}')
+ subprocess.run(['rm', '-rf', path], check=True)
```

### Command Injection (CWE-78)

- **File:** `movilizame.js:150`
- **Severity:** CRITICAL
- **CWE:** [CWE-78](https://cwe.mitre.org/data/definitions/78.html)
- **Description:** Command Injection detected in `movilizame.js` at line 150. This pattern is commonly associated with security vulnerabilities.
- **Recommended Fix:** Use subprocess with list arguments:
```diff
- os.exec(f'rm -rf {path}')
+ subprocess.run(['rm', '-rf', path], check=True)
```

### Command Injection (CWE-78)

- **File:** `movilizame.js:154`
- **Severity:** CRITICAL
- **CWE:** [CWE-78](https://cwe.mitre.org/data/definitions/78.html)
- **Description:** Command Injection detected in `movilizame.js` at line 154. This pattern is commonly associated with security vulnerabilities.
- **Recommended Fix:** Use subprocess with list arguments:
```diff
- os.exec(f'rm -rf {path}')
+ subprocess.run(['rm', '-rf', path], check=True)
```

### Command Injection (CWE-78)

- **File:** `movilizame.js:227`
- **Severity:** CRITICAL
- **CWE:** [CWE-78](https://cwe.mitre.org/data/definitions/78.html)
- **Description:** Command Injection detected in `movilizame.js` at line 227. This pattern is commonly associated with security vulnerabilities.
- **Recommended Fix:** Use subprocess with list arguments:
```diff
- os.exec(f'rm -rf {path}')
+ subprocess.run(['rm', '-rf', path], check=True)
```

### Command Injection (CWE-78)

- **File:** `movilizame.js:235`
- **Severity:** CRITICAL
- **CWE:** [CWE-78](https://cwe.mitre.org/data/definitions/78.html)
- **Description:** Command Injection detected in `movilizame.js` at line 235. This pattern is commonly associated with security vulnerabilities.
- **Recommended Fix:** Use subprocess with list arguments:
```diff
- os.exec(f'rm -rf {path}')
+ subprocess.run(['rm', '-rf', path], check=True)
```

### Command Injection (CWE-78)

- **File:** `movilizame.js:245`
- **Severity:** CRITICAL
- **CWE:** [CWE-78](https://cwe.mitre.org/data/definitions/78.html)
- **Description:** Command Injection detected in `movilizame.js` at line 245. This pattern is commonly associated with security vulnerabilities.
- **Recommended Fix:** Use subprocess with list arguments:
```diff
- os.exec(f'rm -rf {path}')
+ subprocess.run(['rm', '-rf', path], check=True)
```

### Command Injection (CWE-78)

- **File:** `movilizame.js:258`
- **Severity:** CRITICAL
- **CWE:** [CWE-78](https://cwe.mitre.org/data/definitions/78.html)
- **Description:** Command Injection detected in `movilizame.js` at line 258. This pattern is commonly associated with security vulnerabilities.
- **Recommended Fix:** Use subprocess with list arguments:
```diff
- os.exec(f'rm -rf {path}')
+ subprocess.run(['rm', '-rf', path], check=True)
```

---

This fix was generated by an automated security scanner.
Please review the changes carefully before merging.