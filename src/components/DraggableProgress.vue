<script>
    export default{
        props:["Max", "height"],
        data(){
            return{
                value:0,
                pos:null,
                buttons:null,
                mouseX:null,
                bar:null,
                clicked:false
            }
        },
        methods:{
            moveBar(){
                if([1,3,5,9,17].includes(this.buttons) && this.clicked == true){
                    this.value=Math.min(Math.max(this.Max*((this.mouseX-this.pos.x)/this.pos.width),0),this.Max);
                    console.log(this.value);
                    let inBar= document.getElementById("inBar");
                    let outBar = document.getElementById("outBar");
                    let scrub = document.getElementById("scrub");
                    inBar.style.width= this.value/this.Max * 100 + "%";
                    scrub.style.left= this.value/this.Max * outBar.getBoundingClientRect().width - .5* scrub.getBoundingClientRect().width + "px";
                    this.$emit("frame-change", this.value);
                } else{
                    this.clicked=false;
                }
            },

            resize(){
                this.pos = document.getElementById("outBar").getBoundingClientRect();
                let outBar = document.getElementById("outBar");
                    let scrub = document.getElementById("scrub");
                    scrub.style.left= this.value/this.Max * outBar.getBoundingClientRect().width - .5* scrub.getBoundingClientRect().width + "px";
            }
        },
        mounted(){
            this.resize();
            window.addEventListener("resize",e =>{
                this.resize();
            });
            document.addEventListener("mousemove", e=>{
                this.mouseX=e.x;
                this.buttons=e.buttons;
                this.moveBar();
            });
            document.addEventListener("mouseup",e=>{
                this.clicked=false;
            });
            document.getElementById("outBar").addEventListener("mousedown", e=>{
                this.clicked=true;
                this.buttons=e.buttons;
                console.log(e);
                this.mouseX=e.x;
                this.moveBar();
            });
        },
        computed:{
            cssVars(){
                return{
                    '--height':this.height,
                }
            },
            scrubHeight(){
                return{
                    '--height':this.height
                }
            }
        }
    }
</script>

<template>
    <div id="dragProgress">
        <div id="outBar" :style="cssVars">
            <div id="inBar" draggable="false"></div>
            <div id="scrub" :style="scrubHeight" v-b-tooltip.hover :title="Math.floor(this.value/60) + ':' + (( '0' + Math.floor(this.value-Math.floor(this.value/60)*60)).slice(-2))"></div>
        </div>
    </div>
</template>

<style scoped>
    #outBar{
        height:var(--height);
        background-color: gray;
        position:relative;
        border-radius:1000px;
        margin:calc(.6*var(--height));
    }
    #inBar{
        background-color: lightblue;
        position:relative;
        height:100%;
        width:0%;
        border-radius:1000px;
    }
    #scrub{
        position:absolute;
        height:calc(var(--height)*1.2);
        width:calc(var(--height)*1.2);
        top: calc(var(--height)*-.1);
        border-radius:1000px;
        background-color: blue;
        overflow:hidden;
    }
</style>