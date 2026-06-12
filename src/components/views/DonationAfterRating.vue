<template>
    <div class="donation-after-rating container"></div>
</template>

<script>
export default {
    name: 'donation-after-rating',
    props: {
        tripId: {
            type: [String, Number],
            required: true
        }
    }
};
</script>
