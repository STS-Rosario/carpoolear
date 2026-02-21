<template>
    <footer class="footer-component">
        <div class="actionbar actionbar-bottom visible-xs" v-if="footerShow">
            <div
                class="actionbar_item"
                v-for="item in footerButtons"
                :class="{ active: item.active }"
                @click="onClick(item)"
            >
                <span
                    :class="{
                        big: item.id === 'new-trip',
                        'width-badges': item.id === 'notifications'
                    }"
                    class=""
                >
                    <svgItem size="26" :icon="item.icon"></svgItem>
                    <span
                        class="badge"
                        v-if="
                            notificationsCount > 0 &&
                            item.id === 'notifications'
                        "
                    >
                        {{ notificationsCount }}
                    </span>
                </span>
            </div>
        </div>
        <div class="container hidden-xs" v-if="config.enable_footer">
            <div class="row">
                <div class="col-xs-6 col-md-6">
                    <h3>{{ t('footerAcercaDe') }}</h3>
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
                                {{ t('footerEquipo') }}
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
                    <h3>{{ t('footerAyuda') }}</h3>
                    <ul>
                        <li>
                            <a
                                href="https://carpoolear.com.ar/plataforma-preguntas-frecuentes"
                                target="_blank"
                            >
                                {{ t('footerPreguntasFrecuentes') }}
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://carpoolear.com.ar/plataforma-recomendaciones"
                                target="_blank"
                            >
                                {{ t('footerRecomendaciones') }}
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="col-xs-6 col-md-6">
                    <h3>{{ t('footerEncontranosEn') }}</h3>
                    <ul>
                        <li>
                            <a href="https://www.facebook.com/Carpoolear">
                                <i
                                    class="fa fa-facebook"
                                    aria-hidden="true"
                                ></i>
                                <span>{{ t('footerFacebook') }}</span>
                            </a>
                        </li>
                        <li>
                            <a href="https://twitter.com/carpoolear">
                                <i class="fa fa-twitter" aria-hidden="true"></i>
                                <span>{{ t('footerTwitter') }}</span>
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
                                <span>{{ t('footerInstagram') }}</span>
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com/STS-Rosario">
                                <i class="fa fa-github" aria-hidden="true"></i>
                                <span>{{ t('footerGithub') }}</span>
                            </a>
                        </li>
                        <li>
                            <a :href="'mailto:' + config.admin_email">
                                <i
                                    class="fa fa-envelope-o"
                                    aria-hidden="true"
                                ></i>
                                <span>{{ t('footerCorreo') }}</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="col-xs-6 col-md-6">
                    <h3>{{ t('footerInformacionLegal') }}</h3>
                    <p>
                        {{ t('footerEnRutaDesde') }}
                        <br />
                        <router-link :to="{ name: 'terms' }"
                            >{{ t('footerTerminosCondiciones') }}</router-link
                        >
                    </p>
                </div>
            </div>
        </div>
    </footer>
</template>
<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useActionbarsStore } from '@/stores/actionbars';
import { useNotificationsStore } from '@/stores/notifications';
import { useAuthStore } from '@/stores/auth';
import svgItem from '../SvgItem';

const { t } = useI18n();
const actionbarsStore = useActionbarsStore();
const notificationsStore = useNotificationsStore();
const authStore = useAuthStore();

const footerButtons = computed(() => actionbarsStore.footerButtons);
const footerShow = computed(() => actionbarsStore.footerShow);
const notificationsCount = computed(() => notificationsStore.count);
const config = computed(() => authStore.appConfig);

function onClick(item) {
    actionbarsStore.footerButtonClick(item);
}
</script>

<style scoped>
h3 {
    font-size: 18px;
}
.width-badges {
    position: relative;
}
.badge {
    position: absolute;
    background-color: red;
    right: 5px;
    bottom: 3px;
    font-size: 10px;
    height: auto;
    width: auto;
    padding: 3px 4px !important;
}
</style>
