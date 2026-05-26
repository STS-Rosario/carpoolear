import { describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import nodeVm from 'node:vm';
import { parse } from '@vue/compiler-sfc';

const componentPath = path.resolve(__dirname, 'RatePending.vue');

function loadComponent(dialogs) {
    const source = fs.readFileSync(componentPath, 'utf8');
    const { descriptor } = parse(source);
    const script = descriptor.script.content
        .replace(/^import .*;\n/gm, '')
        .replace('export default', 'component =');
    const context = {
        component: null,
        mapState: () => ({}),
        mapActions: () => ({}),
        useRatesStore: () => ({}),
        useAuthStore: () => ({}),
        dialogs,
        dayjs: () => {}
    };

    nodeVm.runInNewContext(script, context);
    return context.component;
}

function makeRate() {
    return {
        id: 23,
        to: {
            id: 42,
            name: 'Ada'
        },
        trip: {
            id: 99,
            points: [
                {
                    json_address: {
                        ciudad: 'Rosario'
                    }
                }
            ]
        }
    };
}

describe('RatePending blank comments', () => {
    it('shows an error instead of submitting a positive rating without a comment', () => {
        const emitted = [];
        const submitted = [];
        const dialogs = {
            message: vi.fn()
        };
        const component = loadComponent(dialogs);
        const componentVm = {
            ...component.data(),
            rate: makeRate(),
            trip: makeRate().trip,
            to: makeRate().to,
            vote: 1,
            comment: '',
            $t: (key) => key,
            $emit: (...args) => emitted.push(args),
            emit: (data) => {
                submitted.push(data);
                return Promise.resolve();
            }
        };

        component.methods.makeVote.call(componentVm);

        expect(dialogs.message).toHaveBeenCalledWith(
            'ratePendingComentarioNoPuedeEstarVacio',
            { duration: 10, estado: 'error' }
        );
        expect(emitted).toEqual([]);
        expect(submitted).toEqual([]);
        expect(componentVm.sending).toBe(false);
    });
});
