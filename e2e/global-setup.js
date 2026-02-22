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
    const resetUsers = `docker compose exec -T app php artisan tinker --execute="` +
        `\\STS\\Models\\User::where('email','like','user%@g.com')->update(['banned'=>false,'on_boarding_view'=>1,'image'=>'https://via.placeholder.com/150','description'=>'Test user for e2e','autoaccept_requests'=>false]);` +
        `echo 'OK';"`;

    // Clean up friendships between user6-user9 (IDs 7-10) to avoid test pollution
    const cleanFriends = `docker compose exec -T app php artisan tinker --execute="` +
        `\\Illuminate\\Support\\Facades\\DB::table('friends')->where(function(\\$q){\\$q->whereIn('user_id',[7,8,9,10])->whereIn('friend_id',[7,8,9,10]);})->delete();` +
        `echo 'OK';"`;

    try {
        const output = execSync(resetUsers, { cwd: backendDir, timeout: 15000, encoding: 'utf-8' });
        if (output.includes('OK')) {
            console.log('Global setup: test users reset successfully');
        } else {
            console.warn('Global setup: unexpected output:', output);
        }
    } catch (err) {
        console.warn('Global setup: could not reset test users (backend may not be running):', err.message);
    }

    try {
        const output = execSync(cleanFriends, { cwd: backendDir, timeout: 15000, encoding: 'utf-8' });
        if (output.includes('OK')) {
            console.log('Global setup: friendships cleaned for user6-user9');
        }
    } catch (err) {
        console.warn('Global setup: could not clean friendships:', err.message);
    }

    // Delete all trips created by user8 and user9 (IDs 9, 10) to reset the trip creation counter
    // This prevents the ban triggered by creating >5 trips in 24 hours
    const cleanTrips = `docker compose exec -T app php artisan tinker --execute="` +
        `\\STS\\Models\\Trip::whereIn('user_id',[9,10])->delete();` +
        `echo 'OK';"`;

    try {
        const output = execSync(cleanTrips, { cwd: backendDir, timeout: 15000, encoding: 'utf-8' });
        if (output.includes('OK')) {
            console.log('Global setup: trips cleaned for user8-user9');
        }
    } catch (err) {
        console.warn('Global setup: could not clean trips:', err.message);
    }
}
