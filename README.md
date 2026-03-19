# 🛡 SpeakSafe – AI Voice Emergency Assistant

## 📌 Overview
SpeakSafe is a voice-enabled emergency assistance system designed for critical situations where users may not be able to interact with their devices manually. 
The system detects distress commands such as "Help" or "Emergency", captures the user's location, and generates an immediate response with a shareable map link.

---

## 🚨 Problem Statement
In emergency situations, individuals often do not have enough time or ability to type messages or navigate mobile applications. There is a need for a fast, hands-free solution that can trigger
alerts and share location instantly.

---

## 💡 Solution
SpeakSafe provides a real-time voice-based emergency alert system that:

- Listens for predefined panic keywords
- Detects emergency situations automatically
- Captures user location using browser APIs
- Sends alert data to a backend server
- Generates a Google Maps link for quick response

---

## ✨ Key Features

- 🎤 Voice Command Detection (Hands-free interaction)
- 🚨 Panic Keyword Recognition
- 📍 Real-time Location Capture
- 🗺 Google Maps Integration
- 📊 Backend Alert Logging Dashboard
- ⚡ Fast and Lightweight System
- 🌐 Easy to deploy and run locally

---

## 🛠 Tech Stack

### Frontend
- HTML
- CSS
- JavaScript
- Web Speech API (Speech Recognition)

### Backend
- Python
- Flask
- Flask-CORS

### APIs & Services
- Browser Geolocation API
- Google Maps

---

## ⚙️ How It Works

1. User activates the system (or auto-listening mode)
2. Voice input is captured using the browser
3. Speech is converted to text
4. System checks for emergency keywords
5. Location is retrieved using geolocation API
6. Data is sent to Flask backend
7. Backend logs alert and generates map link
8. Google Maps opens with the user's location


