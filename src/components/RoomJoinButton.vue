<script>
export default {
    props:['RoomID']
}
</script>

<template>
    <div id="RoomJoinButton">
        <b-button :to="'/gameview/' + this.RoomID.toString()">
            Join Room
        </b-button>
    </div>
</template>

<style scoped>

</style>