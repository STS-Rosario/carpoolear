/**
 * Patch OpenFreeMap Liberty (and compatible styles) so place labels prefer OSM
 * Spanish names (name:es) and show Puerto Argentino instead of Stanley.
 */

export function spanishPlaceNameExpression() {
    return [
        'case',
        [
            'any',
            ['==', ['get', 'name'], 'Stanley'],
            ['==', ['get', 'name:en'], 'Stanley']
        ],
        'Puerto Argentino',
        ['coalesce', ['get', 'name:es'], ['get', 'name:latin'], ['get', 'name_en'], ['get', 'name']]
    ];
}

function isNameEnNameCoalesce(node) {
    return (
        Array.isArray(node) &&
        node[0] === 'coalesce' &&
        node.length >= 3 &&
        Array.isArray(node[1]) &&
        node[1][0] === 'get' &&
        node[1][1] === 'name_en' &&
        Array.isArray(node[2]) &&
        node[2][0] === 'get' &&
        node[2][1] === 'name'
    );
}

export function patchTextFieldExpression(expr) {
    if (!Array.isArray(expr)) {
        return expr;
    }
    if (isNameEnNameCoalesce(expr)) {
        return spanishPlaceNameExpression();
    }
    return expr.map((item) => patchTextFieldExpression(item));
}

export function patchLibertyStyleForSpanishLabels(style) {
    const next = JSON.parse(JSON.stringify(style));
    (next.layers || []).forEach((symbolLayer) => {
        if (symbolLayer.type !== 'symbol' || !symbolLayer.layout) {
            return;
        }
        const textField = symbolLayer.layout['text-field'];
        if (!Array.isArray(textField)) {
            return;
        }
        symbolLayer.layout['text-field'] = patchTextFieldExpression(textField);
    });
    return next;
}
