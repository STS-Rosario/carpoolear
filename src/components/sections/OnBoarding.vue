<template>
    <div
        ref="overlay"
        class="on-boarding--overlay"
        :style="styleContainerObject"
        :class="onBoardingVisibilityClass"
    >
        <template v-if="cardsLength > 0">
            <div
                :style="styleCardObject"
                v-for="number in cardsLength"
                :key="number"
                class="on-boarding--container"
            >
                <div class="on-boarding--top-container">
                    <img class="on-boarding--img" :src="srcCard(number)" />
                    <h1>{{ $t(`onBoardingcardMessage${number}`) }}</h1>
                </div>
                <div class="on-boarding--bottom-container">
                    <AppButton
                        v-if="number > 1"
                        class="on-boarding--prev"
                        variant="secondary"
                        @click="goPrev"
                    >
                        {{ $t('anterior') }}
                    </AppButton>
                    <AppButton
                        v-if="number === cardsLength"
                        variant="primary"
                        @click="complete"
                    >
                        {{ $t('comenzar') }}
                    </AppButton>
                    <AppButton
                        v-else
                        variant="primary"
                        @click="goNext"
                    >
                        {{ $t('siguiente') }}
                    </AppButton>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { useDeviceStore } from '../../stores/device';
import AppButton from '../ui/AppButton.vue';

export default {
    name: 'onBoarding',
    components: {
        AppButton
    },
    data() {
        return {
            cardNumber: 1,
            cardsLength: 0,
            onBoardingVisibilityClass: '',
            styleContainerObject: {},
            styleCardObject: {}
        };
    },
    mounted() {
        setTimeout(() => {
            this.onBoardingVisibilityClass = 'show';
            this.$refs.overlay.addEventListener(
                'transitionend',
                this.firstTransitionEnd,
                false
            );
        }, 600);
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    },
    beforeUnmount() {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
    },
    computed: {
        ...mapState(useAuthStore, {
            appConfig: 'appConfig'
        })
    },
    methods: {
        ...mapActions(useDeviceStore, {
            setFirstTimeAppOpenInDevice: 'setFirstTimeAppOpenInDevice'
        }),
        srcCard(number) {
            let src =
                process.env.ROUTE_BASE +
                `img/onBoarding/${process.env.TARGET_APP}_placa${number}.jpg`;
            return src;
        },
        goPrev() {
            if (this.cardNumber > 1) {
                this.cardNumber -= 1;
            }
        },
        goNext() {
            if (this.cardNumber < this.cardsLength) {
                this.cardNumber += 1;
            }
        },
        firstTransitionEnd() {
            this.cardsLength =
                this.appConfig.module_on_boarding_new_user &&
                this.appConfig.module_on_boarding_new_user.cards;
            this.styleContainerObject = {
                width: `${this.cardsLength * 100}%`,
                transform: 'translate(0)',
                transition: 'transform 0.5s'
            };
            this.styleCardObject = {
                width: '100vw'
            };
            this.$refs.overlay.removeEventListener(
                'transitionend',
                this.firstTransitionEnd,
                false
            );
        },
        complete() {
            this.cardsLength = 0;
            this.styleContainerObject = {
                transition: 'none'
            };
            this.styleCardObject = {};
            this.$nextTick(() => {
                this.styleContainerObject = {};
                this.$nextTick(() => {
                    this.onBoardingVisibilityClass = '';
                    this.$refs.overlay.addEventListener(
                        'transitionend',
                        this.finalTransitionEnd,
                        false
                    );
                });
            });
        },
        finalTransitionEnd() {
            this.$refs.overlay.removeEventListener(
                'transitionend',
                this.finalTransitionEnd,
                false
            );
            this.endActions();
        },
        endActions() {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            this.setFirstTimeAppOpenInDevice();
        }
    },
    watch: {
        cardNumber(value) {
            this.styleContainerObject.transform = `translate(${(value - 1) * -100}vw)`;
        }
    }
};
</script>

<style scoped>
.on-boarding--prev {
    margin-right: 1em;
}

.on-boarding--bottom-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
}
</style>
