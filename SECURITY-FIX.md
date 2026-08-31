# Security Fix for STS-Rosario/carpoolear

Addresses 33 security finding(s).

## Changes Required

### Axios: Regular Expression Denial of Service (ReDoS) via Cookie Name Injection

- **File:** `package.json`
- **Severity:** HIGH
- **CWE:** [CWE-400](https://cwe.mitre.org/data/definitions/400.html)
- **Fix:** Update `axios` to version `1.16.0` or later.

Run:
  npm update axios  # For npm
  pip install --upgrade axios  # For Python
  go get axios@latest  # For Go

### Allocation of Resources Without Limits or Throttling in Axios

- **File:** `package.json`
- **Severity:** HIGH
- **CWE:** [CWE-770](https://cwe.mitre.org/data/definitions/770.html)
- **Fix:** Update `axios` to version `1.16.0` or later.

Run:
  npm update axios  # For npm
  pip install --upgrade axios  # For Python
  go get axios@latest  # For Go

### Axios: Proxy-Authorization Credential Leak to Origin Server Across HTTP-to-HTTPS Redirect in Axios Node.js HTTP Adapter

- **File:** `package.json`
- **Severity:** HIGH
- **CWE:** [CWE-201](https://cwe.mitre.org/data/definitions/201.html)
- **Fix:** Update `axios` to version `1.16.0` or later.

Run:
  npm update axios  # For npm
  pip install --upgrade axios  # For Python
  go get axios@latest  # For Go

### semver vulnerable to Regular Expression Denial of Service

- **File:** `package.json`
- **Severity:** HIGH
- **CWE:** [CWE-1333](https://cwe.mitre.org/data/definitions/1333.html)
- **Fix:** Update `semver` to version `7.5.2` or later.

Run:
  npm update semver  # For npm
  pip install --upgrade semver  # For Python
  go get semver@latest  # For Go

### sharp inherited vulnerabilities in libvips: CVE-2026-33327, CVE-2026-33328, CVE-2026-35590, CVE-2026-35591

- **File:** `package.json`
- **Severity:** HIGH
- **CWE:** [CWE-1395](https://cwe.mitre.org/data/definitions/1395.html)
- **Fix:** Update `sharp` to version `0.35.0` or later.

Run:
  npm update sharp  # For npm
  pip install --upgrade sharp  # For Python
  go get sharp@latest  # For Go

### vite: `server.fs.deny` bypass on Windows alternate paths

- **File:** `package.json`
- **Severity:** HIGH
- **CWE:** [CWE-22](https://cwe.mitre.org/data/definitions/22.html)
- **Fix:** Update `vite` to version `8.0.16` or later.

Run:
  npm update vite  # For npm
  pip install --upgrade vite  # For Python
  go get vite@latest  # For Go

### Axios: Nested axios option objects can consume polluted prototype values

- **File:** `package.json`
- **Severity:** MEDIUM
- **CWE:** [CWE-1321](https://cwe.mitre.org/data/definitions/1321.html)
- **Fix:** Update `axios` to version `0.33.0` or later.

Run:
  npm update axios  # For npm
  pip install --upgrade axios  # For Python
  go get axios@latest  # For Go

### Axios: HTTP/2 streamed uploads bypass `maxBodyLength`

- **File:** `package.json`
- **Severity:** MEDIUM
- **CWE:** [CWE-400](https://cwe.mitre.org/data/definitions/400.html)
- **Fix:** Update `axios` to version `1.18.0` or later.

Run:
  npm update axios  # For npm
  pip install --upgrade axios  # For Python
  go get axios@latest  # For Go

### Axios: Fetch adapter `ReadableStream` uploads bypass `maxBodyLength`

- **File:** `package.json`
- **Severity:** MEDIUM
- **CWE:** [CWE-770](https://cwe.mitre.org/data/definitions/770.html)
- **Fix:** Update `axios` to version `1.18.0` or later.

Run:
  npm update axios  # For npm
  pip install --upgrade axios  # For Python
  go get axios@latest  # For Go

### Axios: Prototype pollution gadgets can alter axios request construction

- **File:** `package.json`
- **Severity:** MEDIUM
- **CWE:** [CWE-1321](https://cwe.mitre.org/data/definitions/1321.html)
- **Fix:** Update `axios` to version `1.18.0` or later.

Run:
  npm update axios  # For npm
  pip install --upgrade axios  # For Python
  go get axios@latest  # For Go

### Axios: NO_PROXY bypass for 0.0.0.0 local addresses in axios

- **File:** `package.json`
- **Severity:** MEDIUM
- **CWE:** [CWE-183](https://cwe.mitre.org/data/definitions/183.html)
- **Fix:** Update `axios` to version `1.18.0` or later.

Run:
  npm update axios  # For npm
  pip install --upgrade axios  # For Python
  go get axios@latest  # For Go

### Axios: Excessive recursion in formDataToJSON can cause denial of service

- **File:** `package.json`
- **Severity:** MEDIUM
- **CWE:** [CWE-400](https://cwe.mitre.org/data/definitions/400.html)
- **Fix:** Update `axios` to version `0.33.0` or later.

Run:
  npm update axios  # For npm
  pip install --upgrade axios  # For Python
  go get axios@latest  # For Go

### Axios: Deep formToJSON Key Recursion Can Cause Denial of Service

- **File:** `package.json`
- **Severity:** MEDIUM
- **CWE:** [CWE-400](https://cwe.mitre.org/data/definitions/400.html)
- **Fix:** Update `axios` to version `0.33.0` or later.

Run:
  npm update axios  # For npm
  pip install --upgrade axios  # For Python
  go get axios@latest  # For Go

### DOMPurify: IN_PLACE hook removal leaves a detached subtree executable, causing XSS

- **File:** `package.json`
- **Severity:** MEDIUM
- **CWE:** [CWE-79](https://cwe.mitre.org/data/definitions/79.html)
- **Fix:** Update `dompurify` to version `3.4.13` or later.

Run:
  npm update dompurify  # For npm
  pip install --upgrade dompurify  # For Python
  go get dompurify@latest  # For Go

### DOMPurify: Permanent `ALLOWED_ATTR` pollution via `setConfig()` bypassing the hook clone-guard (incomplete fix of the 3.4.7 hook-pollution patch)

- **File:** `package.json`
- **Severity:** MEDIUM
- **CWE:** [CWE-79](https://cwe.mitre.org/data/definitions/79.html)
- **Fix:** Update `dompurify` to version `3.4.11` or later.

Run:
  npm update dompurify  # For npm
  pip install --upgrade dompurify  # For Python
  go get dompurify@latest  # For Go

### DOMPurify IN_PLACE Sanitization Bypass via Attached Shadow Root Inside <template>.content

- **File:** `package.json`
- **Severity:** MEDIUM
- **CWE:** [CWE-79](https://cwe.mitre.org/data/definitions/79.html)
- **Fix:** Update `dompurify` to version `3.4.7` or later.

Run:
  npm update dompurify  # For npm
  pip install --upgrade dompurify  # For Python
  go get dompurify@latest  # For Go

### DOMPurify: Hook mutation of `data.allowedTags` / `data.allowedAttributes` permanently pollutes `DEFAULT_ALLOWED_TAGS` / `DEFAULT_ALLOWED_ATTR`

- **File:** `package.json`
- **Severity:** MEDIUM
- **CWE:** [CWE-501](https://cwe.mitre.org/data/definitions/501.html)
- **Fix:** Update `dompurify` to version `3.4.7` or later.

Run:
  npm update dompurify  # For npm
  pip install --upgrade dompurify  # For Python
  go get dompurify@latest  # For Go

### DOMPurify: Cross-realm IN_PLACE sanitization leaves executable markup intact via realm-bound `instanceof` checks

- **File:** `package.json`
- **Severity:** MEDIUM
- **CWE:** [CWE-79](https://cwe.mitre.org/data/definitions/79.html)
- **Fix:** Update `dompurify` to version `3.4.6` or later.

Run:
  npm update dompurify  # For npm
  pip install --upgrade dompurify  # For Python
  go get dompurify@latest  # For Go

### DOMPurify: IN_PLACE mode preserves attributes of a clobbered root element, allowing XSS via attacker-controlled root DOM

- **File:** `package.json`
- **Severity:** MEDIUM
- **CWE:** [CWE-79](https://cwe.mitre.org/data/definitions/79.html)
- **Fix:** Update `dompurify` to version `3.4.6` or later.

Run:
  npm update dompurify  # For npm
  pip install --upgrade dompurify  # For Python
  go get dompurify@latest  # For Go

### Firebase JavaScript SDK allows attackers to manipulate the "_authTokenSyncURL" to point to their own server

- **File:** `package.json`
- **Severity:** MEDIUM
- **CWE:** [CWE-79](https://cwe.mitre.org/data/definitions/79.html)
- **Fix:** Update `firebase` to version `10.9.0` or later.

Run:
  npm update firebase  # For npm
  pip install --upgrade firebase  # For Python
  go get firebase@latest  # For Go

### Prototype Pollution in minimist

- **File:** `package.json`
- **Severity:** MEDIUM
- **CWE:** [CWE-1321](https://cwe.mitre.org/data/definitions/1321.html)
- **Fix:** Update `minimist` to version `0.2.1` or later.

Run:
  npm update minimist  # For npm
  pip install --upgrade minimist  # For Python
  go get minimist@latest  # For Go

### Withdrawn: ESLint dependencies are vulnerable (ReDoS and Prototype Pollution)

- **File:** `package.json`
- **Severity:** MEDIUM
- **CWE:** [N/A](https://cwe.mitre.org/data/definitions/N/A.html)
- **Fix:** Update `minimist` to version `1.2.2` or later.

Run:
  npm update minimist  # For npm
  pip install --upgrade minimist  # For Python
  go get minimist@latest  # For Go

### OS Command Injection in node-notifier

- **File:** `package.json`
- **Severity:** MEDIUM
- **CWE:** [CWE-78](https://cwe.mitre.org/data/definitions/78.html)
- **Fix:** Update `node-notifier` to version `8.0.1` or later.

Run:
  npm update node-notifier  # For npm
  pip install --upgrade node-notifier  # For Python
  go get node-notifier@latest  # For Go

### vue-i18n's escapeParameterHtml does not prevent DOM-based XSS through its tag attributes

- **File:** `package.json`
- **Severity:** MEDIUM
- **CWE:** [CWE-79](https://cwe.mitre.org/data/definitions/79.html)
- **Fix:** Update `vue-i18n` to version `9.14.5` or later.

Run:
  npm update vue-i18n  # For npm
  pip install --upgrade vue-i18n  # For Python
  go get vue-i18n@latest  # For Go

### Withdrawn Advisory: eslint has a Stack Overflow when serializing objects with circular references

- **File:** `package.json`
- **Severity:** MEDIUM
- **CWE:** [CWE-674](https://cwe.mitre.org/data/definitions/674.html)
- **Fix:** Update `eslint` to version `9.26.0` or later.

Run:
  npm update eslint  # For npm
  pip install --upgrade eslint  # For Python
  go get eslint@latest  # For Go

### launch-editor: NTLMv2 hash disclosure via UNC path handling on Windows

- **File:** `package.json`
- **Severity:** MEDIUM
- **CWE:** [CWE-73](https://cwe.mitre.org/data/definitions/73.html)
- **Fix:** Update `vite` to version `2.14.1` or later.

Run:
  npm update vite  # For npm
  pip install --upgrade vite  # For Python
  go get vite@latest  # For Go

### xml2js is vulnerable to prototype pollution

- **File:** `package.json`
- **Severity:** MEDIUM
- **CWE:** [CWE-1321](https://cwe.mitre.org/data/definitions/1321.html)
- **Fix:** Update `xml2js` to version `0.5.0` or later.

Run:
  npm update xml2js  # For npm
  pip install --upgrade xml2js  # For Python
  go get xml2js@latest  # For Go

### DOMPurify: `CUSTOM_ELEMENT_HANDLING` bypasses `afterSanitizeElements` for allowed custom elements.

- **File:** `package.json`
- **Severity:** LOW
- **CWE:** [CWE-79](https://cwe.mitre.org/data/definitions/79.html)
- **Fix:** Update `dompurify` to version `3.4.12` or later.

Run:
  npm update dompurify  # For npm
  pip install --upgrade dompurify  # For Python
  go get dompurify@latest  # For Go

### DOMPurify: Trusted Types policy survives `clearConfig()` and can poison later `RETURN_TRUSTED_TYPE` output

- **File:** `package.json`
- **Severity:** LOW
- **CWE:** [CWE-693](https://cwe.mitre.org/data/definitions/693.html)
- **Fix:** Update `dompurify` to version `3.4.9` or later.

Run:
  npm update dompurify  # For npm
  pip install --upgrade dompurify  # For Python
  go get dompurify@latest  # For Go

### DOMPurify: SAFE_FOR_TEMPLATES bypass - template expressions survive sanitization inside <template> content when using DOM output modes

- **File:** `package.json`
- **Severity:** LOW
- **CWE:** [CWE-79](https://cwe.mitre.org/data/definitions/79.html)
- **Fix:** Update `dompurify` to version `3.4.8` or later.

Run:
  npm update dompurify  # For npm
  pip install --upgrade dompurify  # For Python
  go get dompurify@latest  # For Go

### DOMPurify: `IN_PLACE` mode trusts attacker-controlled `nodeName` on live non-form nodes, allowing script retention and XSS via attacker-supplied DOM objects

- **File:** `package.json`
- **Severity:** LOW
- **CWE:** [CWE-79](https://cwe.mitre.org/data/definitions/79.html)
- **Fix:** Update `dompurify` to version `latest` or later.

Run:
  npm update dompurify  # For npm
  pip install --upgrade dompurify  # For Python
  go get dompurify@latest  # For Go

### @babel/core: Arbitrary File Read via sourceMappingURL Comment

- **File:** `package.json`
- **Severity:** LOW
- **CWE:** [CWE-22](https://cwe.mitre.org/data/definitions/22.html)
- **Fix:** Update `@babel/core` to version `8.0.0-rc.6` or later.

Run:
  npm update @babel/core  # For npm
  pip install --upgrade @babel/core  # For Python
  go get @babel/core@latest  # For Go

### Prototype Pollution in minimist

- **File:** `package.json`
- **Severity:** CRITICAL
- **CWE:** [CWE-1321](https://cwe.mitre.org/data/definitions/1321.html)
- **Fix:** Update `minimist` to version `1.2.6` or later.

Run:
  npm update minimist  # For npm
  pip install --upgrade minimist  # For Python
  go get minimist@latest  # For Go

---

Generated by [mcontributor](https://github.com/mcontributor) security scanner.