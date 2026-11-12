<template>
    <AccountSettingsLayout page-title-key="unLitroParaCarpoolear">
        <div class="un-litro">
            <!-- 1. Hero -->
            <section class="un-litro__hero">
                <div class="un-litro__hero-main">
                    <div class="un-litro__hero-head">
                        <img
                            class="un-litro__can"
                            :src="$publicImg('bidon.png')"
                            alt="1L para carpoolear"
                            width="96"
                            height="96"
                        />
                        <h1 class="un-litro__title">¿Qué es 1 litro para Carpoolear?</h1>
                    </div>
                    <p class="un-litro__lead">Es el valor de 1 litro de nafta que se suma a los gastos compartidos del viaje, para sostener la comunidad.</p>
                    <p class="un-litro__body">Carpoolear es un proyecto sin fines de lucro de la asociación civil STS Rosario. Este aporte ayuda a mantener la plataforma, la mesa de ayuda y las mejoras para la comunidad.</p>
                </div>

                <aside class="un-litro__card un-litro__how">
                    <h2 class="un-litro__how-title">Así funciona</h2>
                    <ul>
                        <li class="un-litro__how-item">
                            <span class="un-litro__icon"><i class="fa fa-check" aria-hidden="true"></i></span>
                            <span>Tus 2 primeros viajes son sin cargo</span>
                        </li>
                        <li class="un-litro__how-item">
                            <span class="un-litro__icon"><i class="fa fa-plus" aria-hidden="true"></i></span>
                            <span>Desde el tercero se suma 1 litro</span>
                        </li>
                        <li class="un-litro__how-item">
                            <span class="un-litro__icon"><i class="fa fa-user" aria-hidden="true"></i></span>
                            <span>Se divide entre quienes viajan</span>
                        </li>
                        <li class="un-litro__how-item">
                            <span class="un-litro__icon"><i class="fa fa-map-marker" aria-hidden="true"></i></span>
                            <span>Sólo en algunos trayectos</span>
                        </li>
                    </ul>
                </aside>
            </section>

            <!-- 2. Un peaje más -->
            <section class="un-litro__section">
                <h2 class="un-litro__section-title">Un peaje más, para la comunidad</h2>
                <p class="un-litro__section-lead">Es el valor de 1 litro de nafta que se suma a los gastos compartidos del viaje.</p>
                <div class="un-litro__peaje">
                    <div class="un-litro__card">
                        <h3 class="un-litro__card-title">Gastos compartidos del viaje</h3>
                        <ul>
                            <li class="un-litro__row"><i class="fa fa-tint" aria-hidden="true"></i><span>Nafta</span></li>
                            <li class="un-litro__row"><i class="fa fa-ticket" aria-hidden="true"></i><span>Peajes</span></li>
                            <li class="un-litro__row un-litro__row--highlight">
                                <img
                                    class="un-litro__bidon-icon"
                                    :src="$publicImg('bidon.png')"
                                    alt=""
                                    width="28"
                                    height="28"
                                    aria-hidden="true"
                                />
                                <span>+ 1 litro para Carpoolear</span>
                            </li>
                            <li class="un-litro__row"><i class="fa fa-user" aria-hidden="true"></i><span>Todo se divide entre quienes viajan</span></li>
                        </ul>
                    </div>
                    <div class="un-litro__card">
                        <h3 class="un-litro__card-title">El dinero se usa para</h3>
                        <ul>
                            <li class="un-litro__use">
                                <span class="un-litro__icon"><i class="fa fa-th-large" aria-hidden="true"></i></span>
                                <span>
                                    <strong>Plataforma</strong>
                                    <span class="un-litro__use-text">Mantener el sitio y la app</span>
                                </span>
                            </li>
                            <li class="un-litro__use">
                                <span class="un-litro__icon"><i class="fa fa-headphones" aria-hidden="true"></i></span>
                                <span>
                                    <strong>Mesa de ayuda</strong>
                                    <span class="un-litro__use-text">Acompañar a las personas usuarias</span>
                                </span>
                            </li>
                            <li class="un-litro__use">
                                <span class="un-litro__icon"><i class="fa fa-star" aria-hidden="true"></i></span>
                                <span>
                                    <strong>Mejoras</strong>
                                    <span class="un-litro__use-text">Nuevas funciones y mejoras</span>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- 3. Se divide -->
            <section class="un-litro__section">
                <h2 class="un-litro__section-title">Se divide entre todas las personas que viajan</h2>
                <p class="un-litro__section-lead">El litro se reparte entre quien maneja y quienes lo acompañan.</p>
                <div class="un-litro__seats-wrap">
                    <div class="un-litro__seats">
                        <div class="un-litro__seat un-litro__seat--driver">
                            <span><i class="fa fa-car" aria-hidden="true"></i> Conductor</span>
                            <span class="un-litro__seat-amount">1/4 L</span>
                        </div>
                        <div class="un-litro__seat">
                            <span><i class="fa fa-user" aria-hidden="true"></i> Acompañante</span>
                            <span class="un-litro__seat-amount">1/4 L</span>
                        </div>
                        <div class="un-litro__seat">
                            <span><i class="fa fa-user" aria-hidden="true"></i> Trasero 1</span>
                            <span class="un-litro__seat-amount">1/4 L</span>
                        </div>
                        <div class="un-litro__seat">
                            <span><i class="fa fa-user" aria-hidden="true"></i> Trasero 2</span>
                            <span class="un-litro__seat-amount">1/4 L</span>
                        </div>
                    </div>
                    <div class="un-litro__card un-litro__seats-explainer">
                        <p>Quien conduce lo paga al publicar el viaje y después lo comparte, igual que la nafta y los peajes.</p>
                    </div>
                </div>
                <div class="un-litro__card un-litro__note">
                    <span class="un-litro__icon"><i class="fa fa-money" aria-hidden="true"></i></span>
                    <strong>Si nadie se sube a tu viaje, se aplica para el siguiente</strong>
                </div>
            </section>

            <!-- 4. Primeros viajes -->
            <section class="un-litro__section">
                <h2 class="un-litro__section-title">Tus 2 primeros viajes son sin cargo</h2>
                <div class="un-litro__card">
                    <p class="un-litro__trips-label">Tus primeros viajes</p>
                    <div class="un-litro__trips">
                        <div class="un-litro__trip">
                            <span class="un-litro__trip-icon"><i class="fa fa-check" aria-hidden="true"></i></span>
                            <span class="un-litro__trip-kicker">Primer viaje</span>
                            <span class="un-litro__trip-value">Sin cargo</span>
                        </div>
                        <div class="un-litro__trip">
                            <span class="un-litro__trip-icon"><i class="fa fa-check" aria-hidden="true"></i></span>
                            <span class="un-litro__trip-kicker">Segundo viaje</span>
                            <span class="un-litro__trip-value">Sin cargo</span>
                        </div>
                        <div class="un-litro__trip un-litro__trip--paid">
                            <span class="un-litro__trip-icon"><i class="fa fa-plus" aria-hidden="true"></i></span>
                            <span class="un-litro__trip-kicker">Tercer viaje</span>
                            <span class="un-litro__trip-value">Suma 1 litro</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 5. Banner -->
            <div class="un-litro__banner">
                <span class="un-litro__wordmark">carpoolear</span>
                <p>es y va a seguir siendo un proyecto sin fines de lucro, que se sostiene con trabajo voluntario.</p>
            </div>
        </div>
    </AccountSettingsLayout>
</template>

<script>
import AccountSettingsLayout from '../layouts/AccountSettingsLayout.vue';
import router from '../../router';
import bus from '../../services/bus-event.js';

export default {
    name: 'UnLitroParaCarpoolear',
    components: { AccountSettingsLayout },
    mounted() {
        bus.on('back-click', this.onBackClick);
    },
    beforeUnmount() {
        bus.off('back-click', this.onBackClick);
    },
    methods: {
        onBackClick() {
            router.back();
        }
    }
};
</script>

<style scoped>
.un-litro {
    --ul-red: #D32F2F;
    --ul-red-soft: #FDE7E7;
    --ul-blue: #1976D2;
    --ul-blue-soft: #E8F1FB;
    --ul-banner: #1565C0;
    --ul-green: #2E7D32;
    --ul-text: #22211F;
    --ul-muted: #5f6368;
    --ul-card-bg: #ffffff;
    --ul-grey: #F1F1F1;
    box-sizing: border-box;
    width: 100%;
    max-width: 1040px;
    margin: 0 auto;
    padding: 2.5em 1.25em 4em;
    color: var(--ul-text);
    font-family: 'Barlow', sans-serif;
    font-size: 16px;
    line-height: 1.45;
}
.un-litro *,
.un-litro *::before,
.un-litro *::after {
    box-sizing: border-box;
}
.un-litro :where(h1, h2, h3, p, ul, li) {
    margin: 0;
    padding: 0;
    font-family: inherit;
    letter-spacing: normal;
    color: inherit;
}
.un-litro ul {
    list-style: none;
}
.un-litro__section {
    margin-top: 3.5em;
}
.un-litro__section-title {
    font-size: 1.9em;
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: 0.35em;
}
.un-litro__section-lead {
    color: var(--ul-muted);
    margin-bottom: 1.25em;
}
.un-litro__card {
    background: var(--ul-card-bg);
    border: 1px solid #E6E8EC;
    border-radius: 14px;
    box-shadow: 0 2px 10px rgba(20, 30, 50, 0.06);
    padding: 1.5em;
}
.un-litro__card-title {
    font-size: 1.15em;
    font-weight: 600;
    margin-bottom: 0.9em;
}

/* Hero */
.un-litro__hero {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 2.5em;
}
.un-litro__hero-main {
    flex: 1 1 55%;
    min-width: 0;
}
.un-litro__hero-head {
    display: flex;
    align-items: center;
    gap: 1.25em;
    margin-bottom: 1.25em;
}
.un-litro__can {
    flex: 0 0 auto;
    width: 96px;
    height: auto;
    display: block;
    object-fit: contain;
}
.un-litro__bidon-icon {
    flex: 0 0 auto;
    width: 28px;
    height: 28px;
    object-fit: contain;
    display: block;
}
.un-litro__title {
    font-size: 2.5em;
    font-weight: 600;
    line-height: 1.1;
}
.un-litro__lead {
    font-size: 1.15em;
    font-weight: 500;
    margin-bottom: 0.9em;
}
.un-litro__body {
    color: var(--ul-muted);
}
.un-litro__how {
    flex: 0 1 38%;
    min-width: 0;
    box-shadow: 0 8px 28px rgba(20, 30, 50, 0.12);
}
.un-litro__how-title {
    font-size: 1.35em;
    font-weight: 600;
    margin-bottom: 1em;
}
.un-litro__how-item {
    display: flex;
    align-items: center;
    gap: 0.85em;
    font-weight: 600;
    padding: 0.55em 0;
}

/* Icon bubbles */
.un-litro__icon {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: var(--ul-blue-soft);
    color: var(--ul-blue);
    font-size: 14px;
}
/* Peaje */
.un-litro__peaje {
    display: flex;
    flex-direction: row;
    gap: 1.5em;
    align-items: stretch;
}
.un-litro__peaje > .un-litro__card {
    flex: 1 1 50%;
    min-width: 0;
}
.un-litro__row {
    display: flex;
    align-items: center;
    gap: 0.85em;
    padding: 0.7em 0.75em;
    border-radius: 10px;
    font-weight: 500;
}
.un-litro__row--highlight {
    background: var(--ul-red-soft);
    color: var(--ul-red);
    font-weight: 700;
}
.un-litro__row .fa {
    width: 1.4em;
    text-align: center;
    color: var(--ul-blue);
}
.un-litro__row--highlight .fa {
    color: var(--ul-red);
}
.un-litro__row--highlight .un-litro__bidon-icon {
    width: 28px;
    height: 28px;
}
.un-litro__use {
    display: flex;
    align-items: flex-start;
    gap: 0.85em;
    padding: 0.6em 0;
}
.un-litro__use strong {
    display: block;
    font-weight: 700;
}
.un-litro__use span.un-litro__use-text {
    color: var(--ul-muted);
    font-size: 0.95em;
}

/* Seats */
.un-litro__seats-wrap {
    display: flex;
    flex-direction: row;
    gap: 1.5em;
    align-items: stretch;
}
.un-litro__seats {
    flex: 1 1 60%;
    min-width: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1em;
}
.un-litro__seat {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.5em;
    min-height: 92px;
    padding: 1em 1.1em;
    border-radius: 12px;
    border: 1.5px solid var(--ul-blue);
    background: var(--ul-blue-soft);
    font-weight: 600;
}
.un-litro__seat--driver {
    border-color: #E0E0E0;
    background: var(--ul-grey);
}
.un-litro__seat-amount {
    align-self: flex-end;
    color: var(--ul-red);
    font-size: 1.9em;
    font-weight: 700;
    line-height: 1;
}
.un-litro__seats-explainer {
    flex: 1 1 40%;
    min-width: 0;
}
.un-litro__seats-explainer p {
    font-size: 1.1em;
    font-weight: 600;
}
.un-litro__note {
    display: flex;
    align-items: center;
    gap: 1em;
    margin-top: 1.25em;
}
.un-litro__note strong {
    font-weight: 700;
}

/* Free trips */
.un-litro__trips-label {
    font-size: 0.8em;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--ul-muted);
    text-transform: uppercase;
    margin-bottom: 1em;
}
.un-litro__trips {
    display: flex;
    flex-direction: row;
    gap: 1.5em;
}
.un-litro__trip {
    flex: 1 1 0;
    min-width: 0;
}
.un-litro__trip-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    font-size: 11px;
    color: #fff;
    background: var(--ul-green);
    margin-bottom: 0.5em;
}
.un-litro__trip--paid .un-litro__trip-icon {
    background: var(--ul-red);
}
.un-litro__trip-kicker {
    display: block;
    font-size: 0.75em;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ul-green);
}
.un-litro__trip--paid .un-litro__trip-kicker {
    color: var(--ul-red);
}
.un-litro__trip-value {
    display: block;
    font-size: 1.6em;
    font-weight: 600;
    line-height: 1.2;
}

/* Banner */
.un-litro__banner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.9em;
    margin-top: 3em;
    padding: 1.1em 1.5em;
    border-radius: 14px;
    background: var(--ul-banner);
    color: #fff;
    font-weight: 500;
    text-align: center;
}
.un-litro__banner p {
    color: #fff;
}
.un-litro__wordmark {
    flex: 0 0 auto;
    font-size: 1.5em;
    font-weight: 700;
    letter-spacing: 0.01em;
    text-transform: lowercase;
}

@media (max-width: 991px) {
    .un-litro {
        padding: 1.5em 1em 3em;
    }
    .un-litro__section {
        margin-top: 2.5em;
    }
    .un-litro__section-title {
        font-size: 1.5em;
    }
    .un-litro__hero,
    .un-litro__peaje,
    .un-litro__seats-wrap,
    .un-litro__trips {
        flex-direction: column;
    }
    .un-litro__hero {
        gap: 1.75em;
    }
    .un-litro__how {
        flex-basis: auto;
        width: 100%;
    }
    .un-litro__title {
        font-size: 1.9em;
    }
    .un-litro__can {
        width: 72px;
        height: auto;
    }
    .un-litro__seats {
        grid-template-columns: repeat(2, 1fr);
        width: 100%;
    }
    .un-litro__trips {
        gap: 1.25em;
    }
    .un-litro__banner {
        flex-direction: column;
    }
}
</style>
