<template>
    <h1 class="app-page-title">
        <slot>{{ title }}</slot>
    </h1>
</template>

<script>
export default {
    name: 'AppPageTitle',
    props: {
        title: {
            type: String,
            default: ''
        }
    }
};
</script>
