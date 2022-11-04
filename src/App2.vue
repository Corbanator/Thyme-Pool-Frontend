<!-- eslint-disable vue/multi-word-component-names -->
<script setup>

</script>

<template>
    <div id="app2">
        <header>
            <b-navbar toggleable = 'sm' type="dark" variant="primary">
                <b-navbar-brand>Thyme Pool</b-navbar-brand>

                <b-navbar-toggle target = 'navbar-collapseable'>
                    <template #default="{ expanded }">
                        <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
                        <b-icon v-else icon="chevron-bar-down"></b-icon>
                    </template>
                </b-navbar-toggle>
                <b-collapse is-nav id="navbar-collapseable">

                    <b-navbar-nav>
                        <b-nav-item-dropdown text="TestNav" Right>
                            <b-dropdown-item to='/Test'>Test 1</b-dropdown-item>
                            <b-dropdown-item to='/RoomsList'>Rooms</b-dropdown-item>
                            <b-dropdown-item to='/GameView'>Game Test</b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-navbar-nav>
                    <!-- Right aligned nav items -->
                    <b-navbar-nav class = "ml-auto">
                        
                    </b-navbar-nav>
                </b-collapse>
            </b-navbar>
        </header>
        <body>
            <router-view></router-view>
        </body>
        
    </div>
</template>

<style scoped>

</style>