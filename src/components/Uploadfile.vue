<template>
    <input ref="input" type="file" @change="onFileChange" v-show="false">
</template>

<script>
export default {
    name: 'uploadfile',
    data () {
        return {
        };
    },
    mounted () {
    },
    methods: {
        show () {
            this.$refs.input.click();
        },

        onFileChange () {
            /* eslint-disable no-undef */
            var data = new FormData();
            data.append(this.name, this.$refs.input.files[0]);
            this.$emit('change', data);
        }
    },
    props: ['name']
};
</script>
