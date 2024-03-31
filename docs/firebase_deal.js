import {initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js"
import {getDatabase, ref, push, onValue, set, update, get } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://spotifydatabase-3810b-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
//Grab from books objects
const tracksInDB = ref(database, "tracks");
const repeatInDB = ref(database, "repeat");

onValue(tracksInDB, function(snapshot) {
    const data = snapshot.val()
    let booksArray = Object.values(data)
    for (let book of booksArray) {
        console.log(book);
    }
})
onValue(repeatInDB, function(snapshot) {
    const data = snapshot.val()
    let repeatData = Object.values(data)
    for (let repeatValue of repeatData) {
        // console.log(repeatValue);
    }
})


export function addTrackToDataBase(track_object) {
    const trackId = track_object.trackId;
    update(tracksInDB, {[trackId] : track_object});
}

export function addRepeatToDataBase(repeat) {
    update(repeatInDB, repeat);
}

export async function getRepeatData() {
    const snapshot = await get(repeatInDB);
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        console.log('No data available');
        return null;
    }
}
export async function getTrackData() {
    const snapshot = await get(tracksInDB);
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        console.log('No data available');
        return null;
    }
}