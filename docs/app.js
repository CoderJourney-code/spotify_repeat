/*
TODO: Make it so we have all the controls. 
TODO: Make it so we can change the volume.
TODO: Make it so we can change the song. - DONE
TODO: Make it so we can change the song position.
TODO: Make it so when we log out it kills the player instance 
or close the broswer. -- DONE
TODO: Have fresh token and logout be seperated some more.
TODO: Have gradients floating around when song plays and only changes when differnet song - DONE.
TODO: Have set interval as callback. I can't go back to not doing this. It not only doesn't
grab html elements live, but it also doesn't auto repeat. it only detects when you activally change either
play pause or rewind. or manually seeking. So it won't auto repeat. 

*/

/* Credit goes to luukdv for the color aspect of this code. https://github.com/luukdv/color.js/ */

import { drawCanvas } from './canvas.js';

// This function will be called when the tab is closed or the user logs out
export function cleanupPlayer() {
    if (player) {
      player.disconnect(); // Disconnect the player
    }
  }

  let player = null;
  let playerStateChangeListener = null;
  let intervalId = null;
  
  // Call cleanupPlayer when the tab is closed
  window.onbeforeunload = cleanupPlayer;
  
  // Call cleanupPlayer when the user logs out
  // Replace 'logoutButton' with the actual ID of your logout button
//   document.getElementById('logout-button').onclick = function() {
//     // Perform logout actions...
    
//     cleanupPlayer();
//   };

let cur_song = null;


let start_time, end_time;

function grabTimes() {
    start_time = document.getElementById('start_time').value;
    end_time = document.getElementById('end_time').value;
}

// Call grabTimes every 500 milliseconds
setInterval(grabTimes, 500);

export function playerFunction(accessToken) {
    console.log("Web player is ready!")
    let token = accessToken;
    let playing= false;
    player = new Spotify.Player({
        name: "Web Playback SDK",
        volume: 1.0,
        getOAuthToken: cb => { cb(token); }
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
        // startCallbackInterval();
        localStorage.setItem('repeat', 'on');
    };

    document.getElementById('repeat_off').onclick = function() {
        // clearInterval(intervalId);
        intervalId = null;
        localStorage.setItem('repeat', 'off');
    }

    document.getElementById('togglePlay').onclick = function() {
        player.togglePlay();

    };

    document.getElementById('fastForward').onclick = function() {
        player.nextTrack();
    }

    document.getElementById('rewind').onclick = function() {
        if(localStorage.getItem('repeat') == 'off') {
            player.previousTrack();
        }

        else if (localStorage.getItem('repeat') == 'on') { 
            localStorage.setItem('repeat', 'off');
            stopCallbackInterval();
            for (let i = 0; i < 2; i++) {
                setTimeout(() => {
                    player.previousTrack();
                }, 350 * i);
            }
            setTimeout(() => {
                localStorage.setItem('repeat', 'on');
                startCallbackInterval();
            }, 350);

        }
        
    }

    player.addListener('player_state_changed', imageManipulation);

    function imageManipulation(state) {
        const images = ['images/pause_button.png', 'images/play_button2.png']
        const image = document.getElementById('togglePlayImage');
        image.src = images[playing ? 0 : 1];
        const cur_image = state.track_window.current_track.album.images[0].url;
        document.getElementById('current-track').src = cur_image;
        //set body style background to transparent. 
        document.body.style.background = 'transparent';
        document.documentElement.style.background = 'transparent';
        document.getElementById('current-track-name').textContent = state.track_window.current_track.name;
        let before_song = cur_song;
        cur_song = state.track_window.current_track.id;
        if(cur_song != before_song) {
            colorjs.prominent(cur_image, {amount: 6, group: 30, sample: 5}).then(color => {
                drawCanvas(color);});
        }
    }

    function startCallbackInterval() { 
        intervalId = setInterval(() => {
            player.getCurrentState().then(state => {
                checkAndSeek(state);
        
                if (state.paused) {
                    playing = false;
                } else {
                    playing = true;
                }
            });
        }, 500); // Call checkAndSeek every 500 milliseconds
    }
    
    function stopCallbackInterval() {
        clearInterval(intervalId);
        intervalId = null;
    }
    
    function checkAndSeek(state) {
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
        let currentPosition = state.position / 1000;
        if(localStorage.getItem('repeat') == 'on') {
            if(currentPosition < start_sec || currentPosition > end_sec) {
                player.seek(start_sec*1000);
            }
        }
       

    }
    

    player.connect();

    };
    


  