import { beforeEach, describe, expect, it, vi } from 'vitest';

const { alertDialog, alertFn, notifyFn } = vi.hoisted(() => {
    const alertDialog = {
        set: vi.fn(function () {
            return this;
        })
    };
    return {
        alertDialog,
        alertFn: vi.fn(() => alertDialog),
        notifyFn: vi.fn()
    };
});

vi.mock('alertifyjs/build/alertify.min.js', () => ({
    default: { alert: alertFn, notify: notifyFn }
}));

vi.mock('../cordova/toast.js', () => ({
    default: { toast: vi.fn() }
}));

describe('dialogs.alert', () => {
    beforeEach(() => {
        alertFn.mockClear();
        alertDialog.set.mockClear();
    });

    it('opens a closable alert dialog instead of a timed snackbar', async () => {
        const dialogs = (await import('./dialogs.js')).default;
        const onClose = vi.fn();

        dialogs.alert('Conflict message', { okLabel: 'Entendido' }, onClose);

        expect(alertFn).toHaveBeenCalledWith('Conflict message', onClose);
        expect(alertDialog.set).toHaveBeenCalledWith('closable', true);
        expect(alertDialog.set).toHaveBeenCalledWith('closableByDimmer', false);
        expect(alertDialog.set).toHaveBeenCalledWith('label', 'Entendido');
        expect(notifyFn).not.toHaveBeenCalled();
    });
});
