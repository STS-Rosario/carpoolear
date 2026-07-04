import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const appDelegatePath = path.resolve(
    __dirname,
    '../../ios/App/App/AppDelegate.swift'
);
const podfilePath = path.resolve(__dirname, '../../ios/App/Podfile');
const mainPath = path.resolve(__dirname, '../main.js');

const appDelegateSource = fs.readFileSync(appDelegatePath, 'utf8');
const podfileSource = fs.readFileSync(podfilePath, 'utf8');
const mainSource = fs.readFileSync(mainPath, 'utf8');

describe('native iOS push wiring', () => {
    it('bridges APNs registration through Firebase Messaging before posting to Capacitor', () => {
        expect(appDelegateSource).toContain('import FirebaseCore');
        expect(appDelegateSource).toContain('import FirebaseMessaging');
        expect(appDelegateSource).toContain('FirebaseApp.configure()');
        expect(appDelegateSource).toContain(
            'Messaging.messaging().apnsToken = deviceToken'
        );
        expect(appDelegateSource).toContain(
            'Messaging.messaging().token(completion:'
        );
        expect(appDelegateSource).toContain(
            '.capacitorDidRegisterForRemoteNotifications'
        );
    });

    it('installs Firebase Messaging on iOS', () => {
        expect(podfileSource).toContain("pod 'Firebase/Messaging'");
    });

    it('avoids duplicate native push initialization in main.js', () => {
        expect(mainSource).not.toContain('await initializePushNotifications()');
        expect(mainSource).not.toContain('const initializePushNotifications = async () =>');
    });
});
