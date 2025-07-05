# 🩺 Smart Health Monitoring System

This repository contains the code, design, and simulation data for our **Smart Health Monitoring System** — an IoT and edge-computing based system to monitor and visualize patient health data in real time.

Built using:
- **ESP32**: Simulates and publishes health data over MQTT
- **Raspberry Pi 4B**: Acts as edge server for processing, alerting, and cloud sync
- **AWS DynamoDB**: Cloud-based storage of processed data
- **Streamlit Dashboard**: For real-time data visualization

---

## 📌 Project Overview

- Collects data (simulated or live) on:
  - ECG
  - Body temperature
  - Heart rate & SpO₂
  - Falls (via accelerometer)
  - GPS location
  - Meal & medication intake (via NFC)
- Processes data locally on Raspberry Pi to detect anomalies
- Publishes structured summaries and alerts to AWS DynamoDB
- Displays data on a **live Streamlit dashboard**

---

## 🛠️ Components Used

| S.No | Component                 | Function                                      |
|-----|---------------------------|-----------------------------------------------:|
| 1   | Raspberry Pi 4B           | Edge server for data processing                |
| 2   | ESP32                     | Sensor controller & MQTT publisher             |
| 3   | MAX30205                  | Temperature sensing                            |
| 4   | MAX30102                  | Heart rate & SpO₂ sensing                      |
| 5   | MPU6050                   | Fall detection via acceleration data           |
| 6   | AD8232                    | ECG signal acquisition                         |
| 7   | PN532 NFC Reader          | Meal & medicine intake detection               |
| 8   | Neo-6M GPS Module         | Patient location tracking                      |
| 9   | Jumper wires & Breadboard | Prototyping                                    |

---

## ⚙️ Data Flow & Architecture

- **ESP32**: Reads/simulates CSV data → Publishes via MQTT
- **Raspberry Pi**:
  - Subscribes via `paho-mqtt`
  - Runs logic to detect falls, abnormal vitals
  - Publishes alerts & summaries to **AWS DynamoDB**
- **Dashboard**: Fetches data from DynamoDB → displays in real time

---

## 🚀 How to Run

1️⃣ **Clone repository:**

git clone https://github.com/yourusername/smart-health-monitoring.git
cd smart-health-monitoring
2️⃣ ESP32 (simulate sensor data):

Open esp32_code in Arduino IDE

Install required libraries

Upload to ESP32

3️⃣ Edge server on Raspberry Pi:

bash
Copy
Edit
cd edge_server
pip install -r requirements.txt
python mqtt_processor.py
4️⃣ Run dashboard locally:

bash
Copy
Edit
cd dashboard
pip install -r requirements.txt
streamlit run dashboard.py

---

🧰 Tools & Libraries Used
Arduino IDE (ESP32)

Python (Raspberry Pi & Dashboard)

Libraries:

paho-mqtt, boto3, numpy, pandas, streamlit, plotly, etc.

Cloud: AWS DynamoDB

---

✍️ Contributing
Suggestions, improvements, and new features are welcome!
Feel free to fork this repo and open a pull request.

📜 License
Released under the MIT License.
Free to use for learning, research, and non-commercial applications.

