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
                    <h3>Acerca de ...</h3>
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
                                Equipo
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
                    <h3>Ayuda</h3>
                    <ul>
                        <!--<li><a href="https://carpoolear.com.ar/tutoriales.php" target="_blank">Tutoriales de uso</a></li>-->
                        <li>
                            <a
                                href="https://carpoolear.com.ar/plataforma-preguntas-frecuentes"
                                target="_blank"
                            >
                                Preguntas frecuentas (FAQ)
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://carpoolear.com.ar/plataforma-recomendaciones"
                                target="_blank"
                            >
                                Recomendaciones
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="col-xs-6 col-md-6">
                    <h3>Encontranos en</h3>
                    <ul>
                        <li>
                            <a href="https://www.facebook.com/Carpoolear">
                                <i
                                    class="fa fa-facebook"
                                    aria-hidden="true"
                                ></i>
                                <span>Facebook</span>
                            </a>
                        </li>
                        <li>
                            <a href="https://twitter.com/carpoolear">
                                <i class="fa fa-twitter" aria-hidden="true"></i>
                                <span>Twitter</span>
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
                                <span>Instagram</span>
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com/STS-Rosario">
                                <i class="fa fa-github" aria-hidden="true"></i>
                                <span>Github</span>
                            </a>
                        </li>
                        <li>
                            <a href="mailto://carpoolear@stsrosario.org.ar">
                                <i
                                    class="fa fa-envelope-o"
                                    aria-hidden="true"
                                ></i>
                                <span>Correo</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="col-xs-6 col-md-6">
                    <h3>Información legal</h3>
                    <p>
                        En ruta desde el año 2013
                        <br />
                        <router-link :to="{ name: 'terms' }"
                            >Términos y condiciones</router-link
                        >
                    </p>
                </div>
            </div>
        </div>
    </footer>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import svgItem from '../SvgItem';

export default {
    name: 'footerApp',
    data() {
        return {};
    },
    computed: {
        ...mapGetters({
            footerButtons: 'actionbars/footerButtons',
            footerShow: 'actionbars/footerShow',
            notificationsCount: 'notifications/count',
            config: 'auth/appConfig'
        })
    },
    methods: {
        ...mapActions({
            onClick: 'actionbars/footerButtonClick'
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
