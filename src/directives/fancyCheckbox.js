function wrapElement(el) {
    if (el.parentNode && !el.parentNode.classList.contains('fancy-cbx')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'fancy-cbx';
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
        const before = document.createElement('span');
        before.className = 'cbx-before';
        wrapper.appendChild(before);
        const after = document.createElement('span');
        after.className = 'cbx-after';
        wrapper.appendChild(after);
    }
}

export default {
    mounted: function (el) {
        wrapElement(el);
    },
    updated: function () {},
    unmounted: function () {}
};
