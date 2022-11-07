<script>
import { onRenderTracked } from 'vue';
import DraggableProgress from '../components/DraggableProgress.vue';
const WSURL = import.meta.env.VITE_SOCKET_PATH;
export default{
    props: ["roomID"],
    data() {
        return {
            canvas: null,
            ctx: null,
            ws: null,
            sim:[],
            ballSet:null,
            ratio:0.5,
            barHeight:20,
            gridWidth:1000,
            gridRatio:null,
            heightAdjust:56 + 6,
            totalAdjust: .97,
            waiting:false,
            slider:null,
            frameNum:0,
            frameTime:null,
            simTime:0,
            selected:-1,
            mouseX:0,
            mouseY:0,
            clicking:false,
            playing:false,
            action:"shove",
            currentPower: 0,
            loading:true,
            turn:false,
            player:0
        };
    },
    methods: {
        resize(){
            if((window.innerHeight - this.heightAdjust)* this.totalAdjust - this.barHeight*2.2 < window.innerWidth * this.totalAdjust * this.ratio){
                this.canvas.height= (window.innerHeight - this.heightAdjust) * this.totalAdjust- this.barHeight*2.2;
                this.canvas.width = this.canvas.height/this.ratio;
            } else {
                this.canvas.width = window.innerWidth * this.totalAdjust;
                this.canvas.height = this.canvas.width*this.ratio;
            }
            this.gridRatio = this.canvas.width/this.gridWidth;
        },
        async join(roomNum){
            this.waiting=true;
            this.ws.send(JSON.stringify({type:'join', room:roomNum}));
            return this.waitSim();
        },
        async waitSim(){
            this.loading = true;
            return new Promise((resolve, reject) => {
                this.sim = null;
                

                const maxNumberOfAttempts = 10;
                const intervalTime = 200; //ms

                let currentAttempt = 0;
                const interval = setInterval(() => {
                    if (currentAttempt > maxNumberOfAttempts - 1) {
                        clearInterval(interval);
                        reject(new Error('Maximum number of attempts exceeded'));
                    } else if (!this.waiting) {
                        this.loading = false;
                        clearInterval(interval);
                        this.loading = false;
                        resolve();
                    }
                    currentAttempt++
                }, intervalTime)
            })
        },
        waitForOpenConnection (socket) {
            return new Promise((resolve, reject) => {
                const maxNumberOfAttempts = 10
                const intervalTime = 200 //ms

                let currentAttempt = 0
                const interval = setInterval(() => {
                    if (currentAttempt > maxNumberOfAttempts - 1) {
                        clearInterval(interval)
                        reject(new Error('Maximum number of attempts exceeded'))
                    } else if (socket.readyState === socket.OPEN) {
                        clearInterval(interval)
                        resolve()
                    }
                    currentAttempt++
                }, intervalTime)
            })
        },
        changeFrame(num){
            this.frameNum=num;
            this.progress.value=num;
            requestAnimationFrame(this.rend);
        },
        rend(){
            this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
            let lighten;
            for( let i = 0;i<this.ballSet.pos.length;i++){
                lighten = 0;
                if(i==this.selected){
                    lighten = 20;
                }
                this.ctx.fillStyle= 'hsl(' + this.ballSet.pos[i].color.h + ',' + this.ballSet.pos[i].color.s + '%,' + (this.ballSet.pos[i].color.l + lighten) + '%)';
                this.ctx.beginPath();
                this.ctx.arc(this.sim[this.frameNum].pos[i].x * this.gridRatio, this.sim[this.frameNum].pos[i].y * this.gridRatio, this.ballSet.pos[i].radius * this.gridRatio, 0, Math.PI * 2,0);
                this.ctx.fill();
            }
            if(this.selected >=0 && this.clicking){
                this.drawArrow(this.mouseX,this.mouseY,this.sim[this.frameNum].pos[this.selected].x,this.sim[this.frameNum].pos[this.selected].y);
                this.currentPower=this.getDistance(this.mouseX,this.mouseY,this.sim[this.frameNum].pos[this.selected].x,this.sim[this.frameNum].pos[this.selected].y);
            }
        },
        moveMouse(e){
            let bounds = this.canvas.getBoundingClientRect();
            this.mouseX = (e.x-bounds.left)/this.gridRatio;
            this.mouseY = (e.y-bounds.top)/this.gridRatio;
            this.clicking = (e.buttons%2 == 1);
            let sel = false;
            if(!this.clicking && !this.playing){
                for(let i=0;i<this.ballSet.pos.length;i++){
                    if(Math.sqrt(Math.pow(this.sim[this.frameNum].pos[i].x - this.mouseX, 2) + Math.pow(this.sim[this.frameNum].pos[i].y - this.mouseY, 2)) < this.ballSet.pos[i].radius){
                        this.selected = i;
                        sel = true;
                        break;
                    }
                }
                if(!sel){
                    this.selected = -1;
                }
            }
            if(this.mouseX<0 || this.mouseX>this.gridWidth || this.mouseY<0 || this.mouseY > this.gridWidth*this.ratio){
                this.selected = -1;
            }
            this.rend();
        },
        playPause(){
            this.playing = !this.playing;
            this.playButton.style.display = this.playing ? "none" : "block";
            this.pauseButton.style.display = this.playing ? "block" : "none";
            requestAnimationFrame(this.playLoop);
        },
        playLoop(){
            if(this.playing){
                this.changeFrame(1+ parseInt(this.frameNum));
                setTimeout(requestAnimationFrame(this.playLoop), 1000*this.frameTime);
            }
        },
        drawArrow(fromx, fromy, tox, toy){
            //variables to be used when creating the arrow
            const scale = .005 * this.getDistance(fromx,fromy,tox,toy);
            const width = 22 * this.gridRatio * scale;
            var headlen = 10* this.gridRatio * scale;
            fromx = fromx * this.gridRatio;
            tox = tox * this.gridRatio;
            fromy = fromy * this.gridRatio;
            toy = toy * this.gridRatio;
            // This makes it so the end of the arrow head is located at tox, toy, don't ask where 1.15 comes from
            var angle = Math.atan2(toy-fromy,tox-fromx);
            tox -= Math.cos(angle) * ((width*1.15));
            toy -= Math.sin(angle) * ((width*1.15));

            
            //starting path of the arrow from the start square to the end square and drawing the stroke
            this.ctx.beginPath();
            this.ctx.moveTo(fromx, fromy);
            this.ctx.lineTo(tox, toy);
            this.ctx.strokeStyle = "#cc0000";
            this.ctx.lineWidth = width;
            this.ctx.stroke();
            
            //starting a new path from the head of the arrow to one of the sides of the point
            this.ctx.beginPath();
            this.ctx.moveTo(tox, toy);
            this.ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));
            
            //path from the side point of the arrow, to the other side point
            this.ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),toy-headlen*Math.sin(angle+Math.PI/7));
            
            //path from the side point back to the tip of the arrow, and then again to the opposite side point
            this.ctx.lineTo(tox, toy);
            this.ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

            //draws the paths created above
            this.ctx.strokeStyle = "#cc0000";
            this.ctx.lineWidth = width;
            this.ctx.stroke();
            this.ctx.fillStyle = "#cc0000";
            this.ctx.fill();
            },
            getDistance(x1, y1, x2, y2){
                return Math.sqrt((Math.pow((x1-x2),2)) + (Math.pow((y1-y2),2)))
            },
            execute(){
                if(this.selected >=0 
                && this.turn == true
                ){
                    switch (this.action) {
                        case "shove":
                                let toSend = {};
                                toSend.magnitude = this.currentPower;
                                toSend.target = this.selected;
                                toSend.direction = Math.atan2((this.mouseY-this.sim[this.frameNum].pos[this.selected].y),(this.mouseX-this.sim[this.frameNum].pos[this.selected].x)) + Math.PI;
                                toSend.type = "action";
                                toSend.actionType= this.action;
                                toSend.frame = parseInt(this.frameNum);
                                console.log(toSend);
                                this.ws.send(JSON.stringify(toSend));
                                this.waitSim();
                            break;
                    
                        default:
                            break;
                    }
                }
            }
    },
    mounted() {
        this.canvas = document.getElementById("display");
        this.canvas.height = this.canvas.width / 2;
        this.ctx = this.canvas.getContext("2d");
        this.resize();
        window.addEventListener('resize',this.resize);
        this.canvas.addEventListener('mousemove', this.moveMouse);
        this.progress = document.getElementById('progress');
        console.log(this.progress.value);
        document.addEventListener('mousemove', e=>{this.changeFrame(this.progress.value);this.moveMouse(e)});
        document.addEventListener('mousedown', e=>{this.changeFrame(this.progress.value)});
        this.play=document.getElementById('play');
        this.play.addEventListener('click',this.playPause);
        this.playButton=document.getElementById('playButton');
        this.pauseButton = document.getElementById('pauseButton');
        this.progress.addEventListener('mousedown',e=>{if(this.playing){this.playPause()}});
        document.addEventListener("mouseup", this.execute);
    },
    components: { DraggableProgress },
    async created(){
        this.ws=new WebSocket(WSURL);
        try {
            await this.waitForOpenConnection(this.ws);
            this.ws.addEventListener("message", e=> {
                let message= JSON.parse(e.data);
                if(message.type == "new-sim"){
                    this.waiting=false;
                    this.sim=message.sim.frames;
                    this.simTime = message.sim.simTime;
                    this.turn = this.player == message.turn;
                }
                if(message.type == "join-confirmation"){
                    console.log(message);
                    this.waiting=false;
                    this.sim=message.sim.frames;
                    this.ballSet = message.sim.ballSet;
                    this.frameTime = message.sim.frameTime;
                    this.simTime = message.sim.simTime;
                    this.player = message.player;
                    this.turn = message.player==message.turn;
                }
            })
            await this.join(this.roomID)
        } catch(e){
            console.log(e);
        }
    }
}
</script>

<template>
    
        <div id="game" style="height:100%">
           
                <div style="text-align:center">
                    <b-overlay :show="this.loading">
                        <canvas id="display" :disabled="this.loading"></canvas>
                    </b-overlay>
                </div>
            
        <div>
                    <b-button id="play" :disabled="this.loading"><b-icon id="playButton" icon="play-fill" style="display:block"></b-icon> <b-icon id="pauseButton" style="display:none" icon="pause-fill"></b-icon></b-button>

                    <input type="range" min='0' :max="this.sim.length-1" id="progress" class="slider" value="0" :disabled="this.loading">
        </div>
                
                    

        </div>
    
</template>

<style scoped>
#game{
    margin:2%; 
    margin-bottom:.5%; 
    margin-top:.5%;
    size:fit-content;
}
    #display{
        background-color:gray;
        display:inline;
        margin-bottom:0;
        float:left;
    }
    #progress{
        width:97%;
        float:right;
    }
    #play{
        position:relative;
        float:left;
    }
</style>