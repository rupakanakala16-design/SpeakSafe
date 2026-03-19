from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

alert_count = 0
alerts = []

# 🔐 Put your real Murf API key here
MURF_API_KEY = "ap2_4a3beb12-a1ec-48fb-a62e-6f174a57b671"


@app.route("/")
def home():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>SpeakSafe Backend</title>

        <style>
        body{
            margin:0;
            font-family:Arial;
            background:#0f2027;
            display:flex;
            justify-content:center;
            align-items:center;
            height:100vh;
            color:white;
        }

        .card{
            background:#1f3247;
            padding:40px;
            border-radius:15px;
            text-align:center;
            box-shadow:0 0 30px rgba(0,0,0,0.6);
            width:350px;
        }

        h1{
            margin-bottom:10px;
        }

        .status{
            background:#28a745;
            padding:10px;
            border-radius:8px;
            margin-top:20px;
            font-weight:bold;
        }

        .info{
            margin-top:15px;
            opacity:.8;
        }
        </style>
    </head>

    <body>
        <div class="card">
            <h1>🛡 SpeakSafe</h1>
            <p class="info">AI Voice Emergency Assistant Backend</p>

            <div class="status">
                ✅ Server Running Successfully
            </div>

            <p class="info">
                Waiting for emergency alerts...
            </p>
        </div>
    </body>
    </html>
    """


# 🚨 ALERT API
@app.route("/alert", methods=["POST"])
def alert():

    global alert_count

    data = request.json
    location = data.get("location")

    alert_count += 1

    map_link = f"https://maps.google.com/?q={location}"

    alerts.append({
        "id": alert_count,
        "location": location,
        "map": map_link
    })

    print("\n========== EMERGENCY ALERT ==========")
    print("Alert Number :", alert_count)
    print("Location :", location)
    print("Map Link :", map_link)
    print("=====================================\n")

    return jsonify({
        "map": map_link
    })


# 🎙 MURF TEXT TO SPEECH API
@app.route("/speak", methods=["POST"])
def speak():

    data = request.json
    text = data.get("text")

    try:
        response = requests.post(
            "https://api.murf.ai/v1/speech/generate",
            headers={
                "Content-Type": "application/json",
                "api-key": MURF_API_KEY
            },
            json={
                "text": text,
                "voiceId": "en-US-natalie",
                "format": "mp3"
            }
        )

        # 🔍 Debug full response
        print("Status Code:", response.status_code)
        print("Raw Response:", response.text)

        murf_data = response.json()

        # 🔥 Handle both possible keys
        audio_url = murf_data.get("audio_url") or murf_data.get("audioFile")

        if not audio_url:
            return jsonify({
                "error": "No audio URL received from Murf",
                "full_response": murf_data
            })

        return jsonify({
            "audio": audio_url
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        })


# 📊 VIEW ALERTS (optional)
@app.route("/alerts", methods=["GET"])
def get_alerts():
    return jsonify(alerts)


if __name__ == "__main__":

    print("🚀 SpeakSafe Backend Started...")

    app.run(debug=True)
