/*
TODO: Make it so we have all the controls. 
TODO: Make it so we can change the volume.
TODO: Make it so we can change the song.
TODO: Make it so we can change the song position.
TODO: Make it so when we log out it kills the player instance
or close the broswer. 
TODO: Have fresh token and logout be seperated some more.

*/

// window.Spotify.getPlayerInstances().forEach(player => {
//     player.disconnect();
// });

// window.addEventListener('beforeunload', function() {
//     window.Spotify.getPlayerInstances().forEach(player => {
//         player.disconnect();
//     });
// });


export function playerFunction(accessToken) {
    console.log("Web player is ready!")
    let token = accessToken;
    let intervalId = -1;
    let playing= false;

    const player = new Spotify.Player({
        name: 'Web Playback SDK Player',
        getOAuthToken: cb => { cb(token); },
        volume: 1
    });
    console.log("New player!")


    // Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        player.getCurrentState().then(state => {
            if (!state) { return; } 
            
        });
        startCallbackInterval();
        
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    player.addListener('initialization_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('authentication_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('account_error', ({ message }) => {
        console.error(message);
    });


    //Document handling
    document.getElementById('repeat_on').onclick = function() {
        startCallbackInterval();
    };

    document.getElementById('repeat_off').onclick = function() {
        clearInterval(intervalId);
    }

    document.getElementById('togglePlay').onclick = function() {
        player.togglePlay();
        const images = ['images/pause_button.png', 'images/play_button2.png']
        const image = document.getElementById('togglePlayImage');
        image.src = images[playing ? 1 : 0];
        playing = !playing;
    };

    document.getElementById('fastForward').onclick = function() {
        player.nextTrack();
    }

    document.getElementById('rewind').onclick = function() {
        player.previousTrack();
    }



    function checkAndSeek(player) {
        player.getCurrentState().then(state => {
            if (!state) {
                console.error('User is not playing music through the Web Playback SDK');
                return;
            }
            let [start_min, start_sec] = document.getElementById('start_time').value.split(':');
            let [end_min, end_sec] = document.getElementById('end_time').value.split(":");
            start_min = parseFloat(start_min);
            start_sec = parseFloat(start_sec);
            end_min = parseFloat(end_min);
            end_sec = parseFloat(end_sec);
            start_sec += start_min*60;
            end_sec += end_min*60;
            const currentPosition = state.position / 1000;
            if(currentPosition < start_sec || currentPosition > end_sec) {
                player.seek(start_sec*1000);
            }

        });
    }

    player.addListener('player_state_changed', state => {
        document.getElementById('current-track').src = state.track_window.current_track.album.images[0].url;
        document.getElementById('current-track-name').textContent = state.track_window.current_track.name;
    });
    
    function startCallbackInterval() { 
        intervalId = setInterval(() => checkAndSeek(player), 500);
        console.log(intervalId)
    }
    // function checkAndSeek(state) {
    //     if (!state) {
    //         console.error('User is not playing music through the Web Playback SDK');
    //         return;
    //     }
    //     let [start_min, start_sec] = document.getElementById('start_time').value.split(':');
    //     let [end_min, end_sec] = document.getElementById('end_time').value.split(":");
    //     start_min = parseFloat(start_min);
    //     start_sec = parseFloat(start_sec);
    //     end_min = parseFloat(end_min);
    //     end_sec = parseFloat(end_sec);
    //     start_sec += start_min*60;
    //     end_sec += end_min*60;
    //     let currentPosition = state.position / 1000;
    //     if(currentPosition < start_sec || currentPosition > end_sec) {
    //         player.seek(start_sec*1000);
    //     }
    //     console.log(end_sec);

    // }
    
    // player.addListener('player_state_changed', checkAndSeek);

    player.connect();

    };
    


  