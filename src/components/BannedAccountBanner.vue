<template>
    <div class="banned-account-banner" role="status">
        {{ $t('cuentaDesactivadaMesaAyuda') }}
    </div>
</template>

<script>
export default {
    name: 'banned-account-banner'
};
</script>

<style scoped>
.banned-account-banner {
    position: sticky;
    top: 0;
    z-index: 9998;
    padding: 10px 14px;
    background: #fde2e2;
    border-bottom: 1px solid #f5b5b5;
    color: #842029;
    font-size: 14px;
    line-height: 1.4;
}
</style>
