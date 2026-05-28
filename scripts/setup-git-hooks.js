const { existsSync } = require('fs');
const { execSync } = require('child_process');

if (existsSync('.git')) {
    execSync('git config core.hooksPath .githooks', { stdio: 'inherit' });
}
