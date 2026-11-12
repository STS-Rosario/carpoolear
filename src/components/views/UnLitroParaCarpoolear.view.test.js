import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'UnLitroParaCarpoolear.vue');
const routesPath = path.resolve(__dirname, '../../router/routes.js');

describe('UnLitroParaCarpoolear page wiring', () => {
    it('registers an in-app route that loads the Vue page (not StaticHtmlPage)', () => {
        const routesSource = fs.readFileSync(routesPath, 'utf8');
        expect(routesSource).toContain("path: '/un-litro-para-carpoolear'");
        expect(routesSource).toContain("name: 'un_litro_para_carpoolear'");
        expect(routesSource).toContain('UnLitroParaCarpoolear');
        expect(routesSource).not.toMatch(
            /path:\s*'\/un-litro-para-carpoolear'[\s\S]*?pageSlug:\s*'un-litro-para-carpoolear'/
        );
    });

    it('wraps content with AccountSettingsLayout without a duplicate page title', () => {
        const viewSource = fs.readFileSync(viewPath, 'utf8');
        expect(viewSource).toContain('AccountSettingsLayout');
        expect(viewSource).not.toContain('page-title-key');
        expect(viewSource).not.toContain('pageTitleKey');
    });

    it('renders the informational sections from the Un litro mockup', () => {
        const viewSource = fs.readFileSync(viewPath, 'utf8');
        expect(viewSource).toContain('¿Qué es 1 litro para Carpoolear?');
        expect(viewSource).toContain(
            'Carpoolear es un proyecto colaborativo <strong>sin fines de lucro</strong> de la asociación civil STS Rosario. Ese litro ayuda a mantener la plataforma, la mesa de ayuda y las mejoras.'
        );
        expect(viewSource).toContain('Así funciona');
        expect(viewSource).toContain('M50.06,47.98');
        expect(viewSource).toContain('viewBox="0 0 64 80"');
        expect(viewSource).toMatch(
            /\.un-litro__icon\s+\.un-litro__fuel-pump\s*\{[^}]*width:\s*20px/
        );
        expect(viewSource).toMatch(
            /\.un-litro__trip-icon\s+\.un-litro__fuel-pump\s*\{[^}]*width:\s*14px/
        );
        expect(viewSource).toContain('Un peaje más, para la comunidad');
        expect(viewSource).toContain(
            'Mantener en funcionamiento el sitio y la app para que sigas encontrando y compartiendo viajes.'
        );
        expect(viewSource).toContain(
            'Responder las consultas y resolver los problemas de quienes usan Carpoolear.'
        );
        expect(viewSource).toContain(
            'Desarrollar nuevas funcionalidades y mejorar las que ya existen.'
        );
        expect(viewSource).toContain(
            'Se divide entre todas las personas que viajan'
        );
        expect(viewSource).toContain(
            'Quien maneja lo paga al publicar y lo comparte, como la nafta y los peajes.'
        );
        expect(viewSource).toContain(
            'Es decir: el litro se adelanta al crear el viaje y después se divide entre todas las personas que viajan, conductor incluido.'
        );
        expect(viewSource).toContain('* Ejemplo con 4 personas viajando.');
        expect(viewSource).toContain('un-litro__seats-explainer');
        expect(viewSource).toMatch(
            /un-litro__seats-explainer[\s\S]*?un-litro__icon/
        );
        expect(viewSource).toContain('Tus 2 primeros viajes son sin cargo');
        expect(viewSource).toContain('Para probar la plataforma.');
        expect(viewSource).toContain(
            'Es el valor de 1 litro de nafta, dentro de los gastos compartidos del viaje.'
        );
        expect(viewSource).toContain(
            'Quien maneja lo paga al publicar y lo comparte con las demás personas.'
        );
        expect(viewSource).toContain(
            'Se cobra en los trayectos más viajados y compartidos.'
        );
        expect(viewSource).toContain('¼ L');
        expect(viewSource).toContain('un-litro__seat--driver');
        expect(viewSource).toContain('un-litro__seat-meta');
        expect(viewSource).toContain('un-litro__seat-label');
        expect(viewSource).toMatch(
            /\.un-litro__seat-meta\s*\{[^}]*flex-direction:\s*column/
        );
        expect(viewSource).toContain('background: #f4f3f1');
        expect(viewSource).toContain('background: #E7F1FB');
        expect(viewSource).toContain('border: 2px solid #1e609d');
        expect(viewSource).toContain(
            'Si nadie se sube a tu viaje, se aplica para el siguiente'
        );
        expect(viewSource).toContain(
            'Si nadie reservó un lugar, no tenés que volver a pagarlo: el litro se traslada directo a tu siguiente viaje publicado.'
        );
        expect(viewSource).toContain('No se suma ningún litro.');
        expect(viewSource).toContain('Tampoco se suma ningún litro.');
        expect(viewSource).toContain(
            'Desde acá se suma el equivalente a 1 litro de nafta.'
        );
        expect(viewSource).toMatch(
            /\.un-litro__trip--paid\s+\.un-litro__trip-value\s*\{[^}]*color:\s*#8B2129/
        );
    });
});
