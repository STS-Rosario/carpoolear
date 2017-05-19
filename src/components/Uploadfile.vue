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

        onFileChange (e) {
            let files = e.target.files || e.dataTransfer.files;
            if (!files.length) {
                return;
            }
            this.createImage(files[0]);
        },

        createImage (file) {
            /* eslint-disable no-undef */
            let reader = new FileReader();
            let vm = this;
            reader.onload = (e) => {
                let image = e.target.result;
                let data = {};
                data[vm.name] = image;
                vm.$emit('change', data);
            };
            reader.readAsDataURL(file);
        }
    },
    props: ['name']
};
</script>
