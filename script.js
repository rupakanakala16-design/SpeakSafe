const panicWords = [
"help","emergency","save me","danger",
"attack","accident","i am in danger","call police"
];

let recognition;
let audioUnlocked = false;

// 🔓 Unlock audio (REQUIRED for Chrome)
document.body.addEventListener("click", () => {
    if (!audioUnlocked) {
        const unlock = new Audio("beep.wav");
        unlock.play().then(() => {
            audioUnlocked = true;
            console.log("Audio unlocked ✅");
        }).catch(()=>{});
    }
}, { once: true });


function startListening() {

    const output = document.getElementById("output");
    const alertBox = document.getElementById("alertBox");

    // 🔊 Play beep (your local file)
    const beep = new Audio("beep.wav");

    beep.play()
    .then(() => console.log("Beep working ✅"))
    .catch(err => console.log("Beep blocked ❌", err));

    output.innerText = "Listening...";

    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onresult = async function (event) {

        let text = event.results[event.results.length - 1][0].transcript.toLowerCase();

        output.innerText = "Detected: " + text;

        let detected = panicWords.some(word => text.includes(word));

        if (detected) {

            alertBox.style.display = "block";

            recognition.stop();

            // 🎙 Murf voice
            await speakWithMurf("Emergency detected. Sending alert now.");

            // 📍 Location
         navigator.geolocation.getCurrentPosition(

    (pos) => {

        let lat = pos.coords.latitude;
        let lon = pos.coords.longitude;
        let accuracy = pos.coords.accuracy;

        console.log("Location:", lat, lon);
        console.log("Accuracy (meters):", accuracy);

        // 🚨 FILTER BAD LOCATION
        if (accuracy > 1000) {
            alert("Location not accurate. Try again or move to open area.");
            return;
        }

        let loc = lat + "," + lon;

        fetch("http://127.0.0.1:5000/alert", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({ location: loc })
        })
        .then(r => r.json())
        .then(d => {
            if (d.map) window.open(d.map);
        });

    },

    (err) => {
        alert("Enable location permission");
    },

    {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
    }
);

        }

    };

    recognition.start();
}


// 🎙 MURF VOICE (FINAL FIX)
async function speakWithMurf(text) {

    try {

        const res = await fetch("http://127.0.0.1:5000/speak", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({ text })
        });

        const data = await res.json();

        console.log("Murf Response:", data);

        if (data.audio) {

            // 🟢 REMOVE OLD AUDIO IF EXISTS
            let old = document.getElementById("murfPlayer");
            if (old) old.remove();

            // 🔥 CREATE AUDIO PLAYER (VISIBLE)
            const audio = document.createElement("audio");
            audio.id = "murfPlayer";
            audio.src = data.audio;
            audio.controls = true;
            audio.autoplay = true;

            document.body.appendChild(audio);

            // 🔥 FORCE PLAY
            audio.play().catch(err => {
                console.log("Autoplay blocked ❌", err);
            });

        } else {
            console.error("No audio URL ❌");
        }

    } catch (e) {
        console.error("Murf error:", e);
    }
}