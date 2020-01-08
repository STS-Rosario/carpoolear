

function wrapElement (el) {
    let orgHtml = el.outerHTML;
    let newHtml = '<div class="fancy-cbx">' + orgHtml + '<span class="cbx-before"></span><span class="cbx-after"></span></div>';
    el.outerHTML = newHtml;
}

export default {
    inserted: function (el, binding, node) {
        wrapElement(el);
    },
    update: function (el, binding, node) {
        // wrapElement(el);
    },
    unbind: function (el, binding, node) {
    }
};
