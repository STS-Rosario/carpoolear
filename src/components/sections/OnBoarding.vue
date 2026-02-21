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
                    <h1>{{ t(`onBoardingcardMessage${number}`) }}</h1>
                </div>
                <div class="on-boarding--bottom-container">
                    <button
                        class="btn btn-secondary"
                        v-if="number > 1"
                        @click="number > 1 && cardNumber--"
                    >
                        {{ t('anterior') }}
                    </button>
                    <button
                        class="btn btn-success"
                        @click="complete"
                        v-if="number === cardsLength"
                    >
                        {{ t('comenzar') }}
                    </button>
                    <button
                        v-else
                        class="btn btn-primary"
                        @click="number < cardsLength && cardNumber++"
                    >
                        {{ t('siguiente') }}
                    </button>
                </div>
            </div>
        </template>
        <template v-else>
            <div :style="styleCardObject" class="on-boarding--container">
                <div class="on-boarding--top-container">
                    <img class="on-boarding--img" :src="srcCard(cardNumber)" />
                    <h1>{{ t(`onBoardingcardMessage${cardNumber}`) }}</h1>
                </div>
                <div class="on-boarding--bottom-container">
                    <button class="btn btn-secondary" v-if="cardNumber > 1">
                        {{ t('anterior') }}
                    </button>
                    <button class="btn btn-success" v-if="cardNumber > 1">
                        {{ t('comenzar') }}
                    </button>
                    <button class="btn btn-primary" v-else>{{ t('siguiente') }}</button>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { useDeviceStore } from '@/stores/device';

const { t } = useI18n();
const authStore = useAuthStore();
const deviceStore = useDeviceStore();

const ROUTE_BASE = import.meta.env.VITE_ROUTE_BASE || '/';
const TARGET_APP = import.meta.env.VITE_TARGET_APP || 'carpoolear';

const overlay = ref(null);
const cardNumber = ref(1);
const cardsLength = ref(0);
const onBoardingVisibilityClass = ref('');
const styleContainerObject = ref({});
const styleCardObject = ref({});

const appConfig = computed(() => authStore.appConfig);

function srcCard(number) {
    let src = ROUTE_BASE + `static/img/onBoarding/${TARGET_APP}_placa${number}.jpg`;
    console.log('src', src);
    return src;
}

function firstTransitionEnd() {
    cardsLength.value =
        appConfig.value.module_on_boarding_new_user &&
        appConfig.value.module_on_boarding_new_user.cards;
    styleContainerObject.value = {
        width: `${cardsLength.value * 100}%`,
        transform: 'translate(0)',
        transition: 'transform 0.5s'
    };
    styleCardObject.value = {
        width: '100vw'
    };
    overlay.value.removeEventListener(
        'transitionend',
        firstTransitionEnd,
        false
    );
}

function complete() {
    cardsLength.value = 0;
    styleContainerObject.value = {
        transition: 'none'
    };
    styleCardObject.value = {};
    nextTick(() => {
        styleContainerObject.value = {};
        nextTick(() => {
            onBoardingVisibilityClass.value = '';
            overlay.value.addEventListener(
                'transitionend',
                finalTransitionEnd,
                false
            );
        });
    });
}

function finalTransitionEnd() {
    overlay.value.removeEventListener(
        'transitionend',
        finalTransitionEnd,
        false
    );
    endActions();
}

function endActions() {
    document.documentElement.style.overflow = 'auto';
    document.body.scroll = 'yes';
    deviceStore.setFirstTimeAppOpenInDevice();
}

watch(cardNumber, (value) => {
    styleContainerObject.value = {
        ...styleContainerObject.value,
        transform: `translate(${(value - 1) * -100}vw)`
    };
});

onMounted(() => {
    setTimeout(() => {
        onBoardingVisibilityClass.value = 'show';
        overlay.value.addEventListener(
            'transitionend',
            firstTransitionEnd,
            false
        );
    }, 600);
    document.documentElement.style.overflow = 'hidden';
    document.body.scroll = 'no';
});
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
    border: 2px solid #ffffff;
    text-transform: uppercase;
    font-size: 0.9rem;
    border-radius: 0;
    padding: 1em;
}
.btn-success:hover {
    border-color: #fff;
}
</style>
