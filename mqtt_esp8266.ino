#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

const char* ssid = "Vuuuuuu";
const char* password = "99998888";
const char* mqttServer = "192.168.43.173";
const int mqttPort = 1883;
const char* moistureTopic = "moisture";  // MQTT topic for soil moisture
const char* autoPumpTopic = "auto_pump";  // MQTT topic for automatic pump control
const char* manualPumpTopic = "manual_pump";  // MQTT topic for manual pump control

const int moistureSensorPin = A0;  // Pin for soil moisture sensor
const int pumpPin = D6;  // Pin for the water pump

WiFiClient espClient;
PubSubClient client(espClient);

bool pumpStatus = false;  // Initial pump status is off
bool autoPumpEnabled = false;

void setup() {
  pinMode(moistureSensorPin, INPUT);
  pinMode(pumpPin, OUTPUT);

  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Read soil moisture level
  int moistureLevel = analogRead(moistureSensorPin);

  // Publish soil moisture data to MQTT
  String moistureMessage = "{\"moisture\": " + String(moistureLevel) + "}";
  client.publish(moistureTopic, moistureMessage.c_str());
  Serial.println(moistureMessage);

  // Automatic pump control based on moisture level
  if (autoPumpEnabled && moistureLevel < 1000 && !pumpStatus) {
    // Bật bơm tự động khi có thỏa mãn các điều kiện
    digitalWrite(pumpPin, HIGH);  // Bật bơm
    Serial.println("Automatic pump control: Pump ON");
    pumpStatus = true;
  } else if (autoPumpEnabled && moistureLevel >= 1000 && pumpStatus) {
    // Tắt bơm tự động khi độ ẩm vượt quá ngưỡng và bơm đang bật
    digitalWrite(pumpPin, LOW);  // Tắt bơm
    Serial.println("Automatic pump control: Pump OFF");
    pumpStatus = false;
  }

  delay(3000);  // Send moisture data every 3 seconds
}

void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(": ");
  Serial.println(message);

  if (strcmp(topic, autoPumpTopic) == 0) {
    // Automatic pump control
    if (message.equals("ON")) {
      // Bật bơm tự động khi có thông điệp "ON"
      autoPumpEnabled = true;
      Serial.println("Automatic pump control: ON");
    } else if (message.equals("OFF")) {
      // Tắt bơm tự động khi có thông điệp "OFF"
      autoPumpEnabled = false;
      Serial.println("Automatic pump control: OFF");
    }
  }

  if (strcmp(topic, manualPumpTopic) == 0) {
    // Manual pump control
    if (message.equals("ON")) {
      digitalWrite(pumpPin, HIGH);  // Turn on the pump
      Serial.println("Manual pump control: ON");
    } else if (message.equals("OFF")) {
      digitalWrite(pumpPin, LOW);  // Turn off the pump
      Serial.println("Manual pump control: OFF");
    }
  }
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("WiFi connected - IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      client.subscribe(autoPumpTopic);
      client.subscribe(manualPumpTopic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}
