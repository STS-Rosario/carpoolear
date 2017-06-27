<template>
    <div>  
        <template v-if="data != null">
            <slot v-if="data.length > 0"> 

            </slot>
            <slot name="no-data" v-else>
                <p class="alert alert-warning"  role="alert">No hay viajes</p>    
            </slot>
        </template>
        <slot name="loading" v-else>
            <p class="alert alert-info" role="alert">Cargando viajes ...</p>
        </slot> 
    </div>  
</template>

<script>
export default {
    name: 'loading',
    mounted () {
        // this.search();
    },
    props: [
        'data'
    ]
};
</script>
