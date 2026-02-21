import { ref, reactive, computed } from 'vue';
import { defineStore } from 'pinia';

let appName = import.meta.env.VITE_TARGET_APP || 'Carpoolear';
if (appName && appName.length) {
    appName = appName.charAt(0).toUpperCase() + appName.slice(1);
}

export const useActionbarsStore = defineStore('actionbars', () => {
    const title = ref(appName);
    const titleLink = ref({});
    const subTitle = ref('');
    const imgTitle = ref('');
    const showMenu = ref(false);

    const headerButtons = reactive([
        { id: 'back', icon: 'fa-angle-left', show: false, position: 'left' },
        { id: 'clear', icon: 'fa-times', show: false, position: 'right' },
        { id: 'share', icon: 'fa-share-alt', show: false, position: 'right' },
        { id: 'search', icon: 'fa-search', show: false, position: 'right' }
    ]);

    const headerLogoVisibility = ref(true);
    const footerVisibility = ref(true);

    const footerButtons = reactive([
        { id: 'home', icon: 'home', url: 'trips', active: true },
        { id: 'profile', icon: 'contact', url: 'profile', active: false },
        { id: 'new-trip', icon: 'add', url: 'new-trip', active: false },
        { id: 'conversations', icon: 'message', url: 'conversations-list', active: false },
        { id: 'notifications', icon: 'bell', url: 'notifications', active: false }
    ]);

    const leftHeaderButton = computed(() =>
        headerButtons.filter((item) => item.position === 'left')
    );
    const rightHeaderButton = computed(() =>
        headerButtons.filter((item) => item.position === 'right')
    );

    function setTitle(newTitle = '') {
        title.value = newTitle;
        if (document) {
            const configAppName = appName;
            document.title =
                newTitle +
                (newTitle !== configAppName
                    ? (newTitle !== '' ? ' - ' : '') + configAppName
                    : '');
        }
    }

    function setTitleLink(newTitleLink = {}) {
        titleLink.value = newTitleLink;
    }

    function setSubTitle(newSubTitle = '') {
        subTitle.value = newSubTitle;
    }

    function setImgTitle(newImgTitle = '') {
        imgTitle.value = newImgTitle;
    }

    function setHeaderButtons(items) {
        headerButtons.forEach((item) => {
            const index = items.findIndex((id) => id === item.id);
            item.show = index >= 0;
        });
        showMenu.value = items.includes('menu');
    }

    function showHeaderLogo(show = true) {
        headerLogoVisibility.value = show;
    }

    function showFooter(show) {
        footerVisibility.value = show;
    }

    function setActiveFooter(id) {
        footerButtons.forEach((item) => {
            item.active = item.id === id;
        });
    }

    function footerButtonClick(item, router, tripsStore) {
        const params = {};
        if (item.url === 'profile') {
            params.id = 'me';
        }
        if (item.url === 'trips') {
            params.clearSearch = true;
            tripsStore.tripsSearch({ is_passenger: false });
            tripsStore.refreshList(true);
        }
        router.push({ name: item.url, params });
    }

    return {
        title,
        titleLink,
        subTitle,
        imgTitle,
        showMenu,
        headerButtons,
        headerLogoVisibility,
        footerVisibility,
        footerButtons,
        leftHeaderButton,
        rightHeaderButton,
        setTitle,
        setTitleLink,
        setSubTitle,
        setImgTitle,
        setHeaderButtons,
        showHeaderLogo,
        showFooter,
        setActiveFooter,
        footerButtonClick
    };
});
