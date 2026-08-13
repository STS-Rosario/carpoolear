<template>
    <footer class="footer-component">
        <div class="mobile-footer-bar visible-xs" v-if="footerShow">
            <div
                class="mobile-footer-bar__item"
                v-for="item in footerButtons"
                :key="item.id"
                :class="[
                    { active: item.active },
                    `mobile-footer-bar__item--${item.id}`
                ]"
                @click="onClick(item)"
            >
                <span
                    class="mobile-footer-bar__icon"
                    :class="{
                        'mobile-footer-bar__icon--badged':
                            item.id === 'my-trips' || item.id === 'messages'
                    }"
                >
                    <svgItem size="40" :icon="item.icon"></svgItem>
                    <span
                        class="mobile-footer-bar__badge"
                        v-if="
                            item.id === 'my-trips' && myTripsBadgeCount > 0
                        "
                    ></span>
                    <span
                        class="mobile-footer-bar__badge"
                        v-if="
                            item.id === 'messages' && messagesBadgeCount > 0
                        "
                    ></span>
                </span>
                <span class="mobile-footer-bar__label">{{ $t(item.labelKey) }}</span>
                <span
                    v-if="item.active"
                    class="mobile-footer-bar__indicator"
                    aria-hidden="true"
                ></span>
            </div>
        </div>
        <div class="container hidden-xs" v-if="config.enable_footer">
            <div class="row">
                <div class="col-xs-6 col-md-6">
                    <h3>{{ $t('footerAcercaDe') }}</h3>
                    <ul>
                        <li>
                            <router-link tag="a" :to="{ name: 'acerca_de' }">
                                Carpoolear
                            </router-link>
                        </li>
                        <li>
                            <a
                                href="https://carpoolear.com.ar/acerca-de-equipo"
                                target="_blank"
                            >
                                {{ $t('footerEquipo') }}
                            </a>
                        </li>
                        <li>
                            <a
                                href="http://www.stsrosario.org.ar/"
                                target="_blank"
                                >STS Rosario</a
                            >
                        </li>
                    </ul>
                </div>
                <div class="col-xs-6 col-md-6">
                    <h3>{{ $t('footerAyuda') }}</h3>
                    <ul>
                        <!--<li><a href="https://carpoolear.com.ar/tutoriales.php" target="_blank">Tutoriales de uso</a></li>-->
                        <li>
                            <router-link :to="{ name: 'faq' }">
                                {{ $t('footerPreguntasFrecuentes') }}
                            </router-link>
                        </li>
                        <li>
                            <a
                                href="https://carpoolear.com.ar/plataforma-recomendaciones"
                                target="_blank"
                            >
                                {{ $t('footerRecomendaciones') }}
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="col-xs-6 col-md-6">
                    <h3>{{ $t('footerEncontranosEn') }}</h3>
                    <ul>
                        <li>
                            <a href="https://www.facebook.com/Carpoolear">
                                <i
                                    class="fa fa-facebook"
                                    aria-hidden="true"
                                ></i>
                                <span>{{ $t('footerFacebook') }}</span>
                            </a>
                        </li>
                        <li>
                            <a href="https://twitter.com/carpoolear">
                                <i class="fa fa-twitter" aria-hidden="true"></i>
                                <span>{{ $t('footerTwitter') }}</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.instagram.com/carpoolear/?hl=en"
                            >
                                <i
                                    class="fa fa-instagram"
                                    aria-hidden="true"
                                ></i>
                                <span>{{ $t('footerInstagram') }}</span>
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com/STS-Rosario">
                                <i class="fa fa-github" aria-hidden="true"></i>
                                <span>{{ $t('footerGithub') }}</span>
                            </a>
                        </li>
                        <li>
                            <a :href="'mailto:' + config.admin_email">
                                <i
                                    class="fa fa-envelope-o"
                                    aria-hidden="true"
                                ></i>
                                <span>{{ $t('footerCorreo') }}</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="col-xs-6 col-md-6">
                    <h3>{{ $t('footerInformacionLegal') }}</h3>
                    <p>
                        {{ $t('footerEnRutaDesde') }}
                        <br />
                        <router-link :to="{ name: 'terms' }"
                            >{{ $t('footerTerminosCondiciones') }}</router-link
                        >
                    </p>
                </div>
            </div>
        </div>
    </footer>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useActionbarsStore } from '../../stores/actionbars';
import { useNotificationsStore } from '../../stores/notifications';
import { useAuthStore } from '../../stores/auth';
import svgItem from '../SvgItem';

export default {
    name: 'footerApp',
    data() {
        return {};
    },
    computed: {
        ...mapState(useActionbarsStore, {
            footerButtons: 'footerButtons',
            footerShow: 'footerShow'
        }),
        ...mapState(useNotificationsStore, {
            myTripsBadgeCount: 'myTripsCount',
            messagesBadgeCount: 'messagesCount'
        }),
        ...mapState(useAuthStore, {
            config: 'appConfig'
        })
    },
    methods: {
        ...mapActions(useActionbarsStore, {
            onClick: 'footerButtonClick'
        })
    },
    components: {
        svgItem
    }
};
</script>

<style scoped>
h3 {
    font-size: 18px;
}
.mobile-footer-bar__icon--badged {
    position: relative;
    display: inline-flex;
}
.mobile-footer-bar__badge {
    position: absolute;
    top: 2px;
    right: 0;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #e53935;
}
.mobile-footer-bar__label {
    display: block;
    font-size: 13px;
    line-height: 1.1;
    margin-top: 2px;
    color: inherit;
}
.mobile-footer-bar__item.active .mobile-footer-bar__label {
    font-weight: 600;
}
.mobile-footer-bar__icon {
    color: inherit;
}
.mobile-footer-bar__icon :deep(.svgItem svg) {
    display: block;
}
.mobile-footer-bar__icon :deep(.svgItem svg[fill='none']) {
    color: inherit;
}
.mobile-footer-bar__icon :deep(.svgItem svg[fill='none'] path) {
    fill: currentColor;
    stroke: none;
}
</style>
