function wrapElement(el) {
    const orgHtml = el.outerHTML;
    const newHtml =
        '<div class="fancy-cbx">' +
        orgHtml +
        '<span class="cbx-before"></span><span class="cbx-after"></span></div>';
    el.outerHTML = newHtml;
}

export default {
    mounted: function (el, binding, node) {
        wrapElement(el);
    },
    updated: function (el, binding, node) {
        // wrapElement(el);
    },
    unmounted: function (el, binding, node) {}
};
