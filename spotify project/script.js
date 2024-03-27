let currentSong = new Audio();

function convertSecondsToMinutesAndSeconds(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.round(seconds % 60);

    // Ensure leading zeros if necessary
    var minutesString = String(minutes).padStart(2, '0');
    var secondsString = String(remainingSeconds).padStart(2, '0');

    return minutesString + " : " + secondsString;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div"); 
    div.innerHTML = response; 
    let as = div.getElementsByTagName("a");
    let songs = [] ; 
    for(let index = 0 ; index < as.length ; index++){
        const element = as[index]; 
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1]); 
        }
    }
    return songs ; 
}

const playMusic = (track, pause = false)=>{
    // let audio = new Audio("/songs/" + track);
    if(!pause) {
        currentSong.play()
    }
    currentSong.src = "/songs/" + track
    play.src ="pause.svg";
    currentSong.play(); 
    document.querySelector(".songinfo").innerHTML = decodeURI(track.replaceAll(".mp3" , ""));
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main(){
    let songs = await  getSongs() ; 
    playMusic(songs[0], true)
    //show all the sonsg in the playlist  
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for(const song of songs){
        let changed = song
        .replaceAll("%20", " ")
        .replaceAll("%2", " ")
        .replaceAll("%5B", " ")
        .replaceAll("%5D", " ")
        .replaceAll("B", " ");
        songUL.innerHTML = songUL.innerHTML + `<li><div>${changed}</div></div><div class="playnow">
        <span>Play Now</span>
        <img class="invert" src="play.svg" >
    </div></li>` ; 
    }
    //play the first song 
    // var audio = new Audio(songs[0]);
    // audio.play();
    // audio.addEventListener("loadeddata" , ()=>{
    //     console.log(audio.duration , audio.currentSrc , audio.currentTime)
    // }) ;
    //Attach an event listener 
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click" , ()=>{
            console.log(e.getElementsByTagName("div")[0].innerHTML); 
            playMusic(e.getElementsByTagName("div")[0].innerHTML.trim());
        })
    })
    //Attach an event listener to play next previous
    play.addEventListener("click" , ()=>{
        if (currentSong.paused){
            currentSong.play();
            play.src ="pause.svg";
        }
        else{
            currentSong.pause();
            play.src = "play.svg";
        }
    })

    //listen for timeupdate event 
    currentSong.addEventListener("timeupdate" , ()=>{
        console.log(currentSong.currentTime , currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutesAndSeconds(currentSong.currentTime)} /
        ${convertSecondsToMinutesAndSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100  + "%";
    })

    //add event to seekbar 
    document.querySelector(".seekbar").addEventListener("click" , e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left =  percent + "%"; 
        currentSong.currentTime= ((currentSong.duration) * percent)/100 ;
    })
}
main() 