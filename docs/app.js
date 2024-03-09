export function playerFunction(accessToken) {
    console.log("Web player is ready!")
    let token = accessToken;
    let intervalId = -1;

    const player = new Spotify.Player({
        name: 'Web Playback SDK Player',
        getOAuthToken: cb => { cb(token); },
        volume: 1
    });
    console.log("New player!")


    // Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
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
    };



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
    
    function startCallbackInterval() { 
        intervalId = setInterval(() => checkAndSeek(player), 500);
        console.log(intervalId)
    }
    
    player.connect();

    };
    


  