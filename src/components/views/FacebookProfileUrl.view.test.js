import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const registerSource = fs.readFileSync(
    path.resolve(__dirname, 'Register.vue'),
    'utf8'
);
const updateProfileSource = fs.readFileSync(
    path.resolve(__dirname, '../sections/UpdateProfile.vue'),
    'utf8'
);
const profileInfoSource = fs.readFileSync(
    path.resolve(__dirname, '../sections/ProfileInfo.vue'),
    'utf8'
);
const adminDetailSource = fs.readFileSync(
    path.resolve(__dirname, 'AdminUserDetail.vue'),
    'utf8'
);
const adminEditSource = fs.readFileSync(
    path.resolve(__dirname, 'UsersCrud.vue'),
    'utf8'
);

describe('Facebook profile URL coverage in profile surfaces', () => {
    it('does not show a facebook profile url field on registration', () => {
        expect(registerSource).not.toContain('input-facebook-profile-url');
        expect(registerSource).not.toContain('Perfil de Facebook (opcional)');
        expect(registerSource).not.toContain('facebookProfileUrl');
    });

    it('shows a facebook profile url field on profile edit behind module flag', () => {
        expect(updateProfileSource).toContain('module_facebook_profile_url_enabled');
        expect(updateProfileSource).toContain('Perfil de Facebook (opcional)');
        expect(updateProfileSource).toContain('https://facebook.com/tuperfil');
        expect(updateProfileSource).toContain(
            'Opcional. Para generar confianza podés poner tu link a'
        );
        expect(updateProfileSource).toContain('tu perfil de Facebook');
    });

    it('shows the facebook profile url in profile detail and admin user detail', () => {
        expect(profileInfoSource).toContain('facebook_profile_url');
        expect(profileInfoSource).toContain('module_facebook_profile_url_enabled');

        expect(adminDetailSource).toContain('facebook_profile_url');
        expect(adminDetailSource).toContain('module_facebook_profile_url_enabled');
    });

    it('shows a facebook profile url field in admin user edit behind module flag', () => {
        expect(adminEditSource).toContain('facebook_profile_url');
        expect(adminEditSource).toContain('module_facebook_profile_url_enabled');
        expect(adminEditSource).toContain('Perfil de Facebook (opcional)');
        expect(adminEditSource).toContain('https://facebook.com/tuperfil');
    });
});
