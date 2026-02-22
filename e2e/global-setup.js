/**
 * Playwright global setup: ensure test users are in a clean state before running tests.
 *
 * The backend bans users who create more than 4 trips in 24 hours (TripsManager).
 * Since multiple tests create trips as user1, running the suite repeatedly in the
 * same day can trigger this ban. This setup resets banned status and ensures profiles
 * are complete (required by the profileComplete route guard).
 */
import { execSync } from 'child_process';

export default async function globalSetup() {
    const backendDir = new URL('../../carpoolear_backend', import.meta.url).pathname;
    const cmd = `docker compose exec -T app php artisan tinker --execute="` +
        `\\STS\\Models\\User::where('email','like','user%@g.com')->update(['banned'=>false,'on_boarding_view'=>1,'image'=>'https://via.placeholder.com/150','description'=>'Test user for e2e']);` +
        `echo 'OK';"`;

    try {
        const output = execSync(cmd, { cwd: backendDir, timeout: 15000, encoding: 'utf-8' });
        if (output.includes('OK')) {
            console.log('Global setup: test users reset successfully');
        } else {
            console.warn('Global setup: unexpected output:', output);
        }
    } catch (err) {
        console.warn('Global setup: could not reset test users (backend may not be running):', err.message);
    }
}
