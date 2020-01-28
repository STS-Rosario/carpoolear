<template>
    <div ref="overlay" class="on-boarding--overlay" :style="styleContainerObject" :class="onBoardingVisibilityClass">
        <template v-if="cardsLength > 0">
            <div :style="styleCardObject" v-for="number in cardsLength" :key="number" class="on-boarding--container">
                <div class="on-boarding--top-container">
                    <img class="on-boarding--img" :src="srcCard(number)" />
                    <h1>{{$t(`onBoardingcardMessage${number}`)}}</h1>
                </div>
                <div class="on-boarding--bottom-container">
                    <button class="btn btn-secondary" v-if="number > 1" @click="(number > 1) && cardNumber--">Anterior</button>
                    <button class="btn btn-success" @click="complete" v-if="number === cardsLength">
                        ¡Comenzar!
                    </button>
                    <button v-else class="btn btn-primary" @click="(number < cardsLength) && cardNumber++">
                        Siguiente
                    </button>
                </div>
            </div>
        </template>
        <template v-else>
            <div :style="styleCardObject" class="on-boarding--container">
                <div class="on-boarding--top-container">
                    <img class="on-boarding--img" :src="srcCard(cardNumber)" />
                    <h1>{{$t(`onBoardingcardMessage${cardNumber}`)}}</h1>
                </div>
                <div class="on-boarding--bottom-container">
                    <button class="btn btn-secondary" v-if="cardNumber > 1">Anterior</button>
                    <button class="btn btn-success" v-if="cardNumber > 1">
                        ¡Comenzar!
                    </button>
                    <button class="btn btn-primary" v-else>
                        Siguiente
                    </button>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'onBoarding',
    data () {
        return {
            cardNumber: 1,
            cardsLength: 0,
            onBoardingVisibilityClass: '',
            styleContainerObject: {},
            styleCardObject: {}
        };
    },
    mounted () {
        setTimeout(() => {
            this.onBoardingVisibilityClass = 'show';
            this.$refs.overlay.addEventListener('transitionend', this.firstTransitionEnd, false);
        }, 600);
        document.documentElement.style.overflow = 'hidden';
        document.body.scroll = 'no';
    },
    computed: {
        ...mapGetters({
            appConfig: 'auth/appConfig'
        })
    },
    methods: {
        ...mapActions({
            setFirstTimeAppOpenInDevice: 'device/setFirstTimeAppOpenInDevice'
        }),
        srcCard (number) {
            return `/static/img/onBoarding/${process.env.TARGET_APP}_placa${number}.jpg`;
        },
        firstTransitionEnd () {
            this.cardsLength = this.appConfig.module_on_boarding_new_user && this.appConfig.module_on_boarding_new_user.cards;
            this.styleContainerObject = {
                width: `${this.cardsLength * 100}%`,
                transform: 'translate(0)',
                transition: 'transform 0.5s'
            };
            this.styleCardObject = {
                width: '100vw'
            };
            this.$refs.overlay.removeEventListener('transitionend', this.firstTransitionEnd, false);
        },
        complete () {
            this.cardsLength = 0;
            this.styleContainerObject = {
                transition: 'none'
            };
            this.styleCardObject = {};
            this.$nextTick(() => {
                this.styleContainerObject = {};
                this.$nextTick(() => {
                    this.onBoardingVisibilityClass = '';
                    this.$refs.overlay.addEventListener('transitionend', this.finalTransitionEnd, false);
                });
            });
        },
        finalTransitionEnd () {
            this.$refs.overlay.removeEventListener('transitionend', this.finalTransitionEnd, false);
            this.endActions();
        },
        endActions () {
            this.$set(document.documentElement.style, 'overflow', 'auto');
            this.$set(document.body, 'scroll', 'yes');
            this.setFirstTimeAppOpenInDevice();
        }
    },
    watch: {
        cardNumber (value) {
            this.$set(this.styleContainerObject, 'transform', `translate(${(value - 1) * -100}vw)`);
        }
    }
};
</script>

<style scoped>
.btn-secondary {
    margin-right: 1em;
    background-color: transparent;
}
.btn-success {
    position: relative;
    min-width: 5rem;
    min-height: 42px;
    border: 2px solid #FFFFFF;
    text-transform: uppercase;
    font-size: 0.9rem;
    border-radius: 0;
    padding: 1em;
}
.btn-success:hover {
    border-color: #fff;
}
</style>