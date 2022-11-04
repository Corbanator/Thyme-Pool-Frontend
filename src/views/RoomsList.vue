<script>
    import { masterFetch } from '../scripts/masterfetch';
    import RoomJoinButton from '../components/RoomJoinButton.vue'
import DraggableProgress from '../components/DraggableProgress.vue';
   export default{
    data() {
        return {
            RoomList: null,
            fields: [
                { key: "roomName", label: "Room Name" },
                { key: "player1", label: "1st Player" },
                { key: "player2", label: "2nd Player" },
                {key:"Code", label:"Room ID"},
                "join"
            ],
            isBusy: true,
            pageNum:1,
            perPage:10
        };
    },
    async mounted() {
        this.RoomList = await masterFetch("get", "/Room");
        this.isBusy = false;
    },
    components: { RoomJoinButton, DraggableProgress },
    methods: {
        async newRoom(roomName) {
            let newID = await masterFetch("post","/Room",{name:roomName});
            return newID;
        },
        async reload(){
            this.isBusy = true;
            this.RoomList = await masterFetch("get", "/Room");
            this.isBusy = false;
        }
    }, 
    computed:{
        rows(){
            return this.RoomList.length;
        }
    }
};

</script>

<template>
    <div id="Rooms">
        <b-table id="room-list" dark :busy='isBusy' :fields="fields" :items="RoomList" :per-page="perPage" :current-page="pageNum">
            <template #cell(join)="data">
                <RoomJoinButton :RoomID='data.item.Code'></RoomJoinButton>
            </template>
        </b-table>
        <b-row no-gutters>
            <b-col>
                <b-button dark @click="newRoom(); reload();">Create Room</b-button>
            </b-col>
            <b-col>
                <b-button dark @click="reload()">Reload List</b-button>
            </b-col>
            <b-col>
                <b-pagination 
                    v-model="pageNum"
                    :total-rows="rows"
                    :per-page="perPage"
                    aria-controls="room-list"
                ></b-pagination>
            </b-col>
        </b-row>
        <b-modal id="room-create"><b-form>

        </b-form></b-modal>


        
        
    </div>
</template>

<style scoped>
    
</style>