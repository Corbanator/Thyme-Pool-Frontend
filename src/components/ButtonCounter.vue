<script>
    export default {
        props:{
            label:String
        },
        data() {
        return{
            count:0
        }
    }
    }
</script>

<template>
    <b-button @click = count++>
        {{label}}: {{ count }}
    </b-button>
</template>