I will update the codebase to use `config.js` as the single source of truth, removing hardcoded IP addresses and ensuring the new HTTPS domain is used.

### Implementation Steps

1. **Update Global Configuration (`config.js`)**

   * Update `raccontixrm` production `apiUrl` to `https://xrm.racconti.in/api`.

2. **Refactor Build Script (`frontend/replace-env.js`)**

   * Remove the hardcoded `ipMappings` object and the manual IP selection logic.

   * Update `getApiUrl()` to directly return `brandConfig.app.apiUrl`, relying on `config.js` logic.

   * Update `{{CANONICAL_URL}}` generation to derive the URL dynamically from `brandConfig.app.port` and `brandConfig.app.apiUrl` (or similar properties) instead of hardcoded IPs.

3. **Refactor Upload URL Pipe (`frontend/src/app/pipes/upload-url.pipe.ts`)**

   * Remove the hardcoded IP block for `uploads/`.

   * Allow the pipe to rely on `this.brandConfig.getApiUrl()` to resolve the base URL dynamically.

4. **Update Brand Config Service (`frontend/src/app/services/brand-config.service.ts`)**

   * Update `getBrandKey()` to identify the `raccontixrm` brand by checking if the API URL contains "racconti", ensuring it works with the new domain.

