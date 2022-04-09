#include "config.h"

#include <WiFiClientSecure.h>
#include <MQTTClient.h> //MQTT Library Source: https://github.com/256dpi/arduino-mqtt

#include <ArduinoJson.h> //ArduinoJson Library Source: https://github.com/bblanchon/ArduinoJson
#include "WiFi.h"

// MQTT topics for the device
#define AWS_IOT_PUBLISH_TOPIC   "TeamSwipe_ESP32/pub"
#define AWS_IOT_SUBSCRIBE_TOPIC "TeamSwipe_ESP32/sub"

WiFiClientSecure wifi_client = WiFiClientSecure();
MQTTClient mqtt_client = MQTTClient(4000); //256 indicates the maximum size for packets being published and received.

uint32_t t1;
String nameList[150];
String roleList[150];
String ppsnList[150];

void setup() {
  Serial.begin(115200);
  t1 = millis();
  connectAWS();
}

void loop() {
  //publishMessage();
  mqtt_client.loop();
  delay(4000);
}
