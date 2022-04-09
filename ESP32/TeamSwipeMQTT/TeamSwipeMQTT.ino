#include "config.h"
#include <SPI.h>
#include <MFRC522.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>
#include <WiFiClientSecure.h>
#include <MQTTClient.h> //MQTT Library Source: https://github.com/256dpi/arduino-mqtt

#include <ArduinoJson.h> //ArduinoJson Library Source: https://github.com/bblanchon/ArduinoJson
#include "WiFi.h"

// MQTT topics for the device
#define AWS_IOT_PUBLISH_TOPIC   "TeamSwipe_ESP32/pub"

#define RST_PIN         17          
#define SS_PIN          5       

#define UD_PIN 33
#define RL_PIN 32

#define J_BTN 16

#if defined(ARDUINO) && ARDUINO >= 100 //depending on if you are using an arduino or not printByte works differently
#define printByte(args)  write(args);
#else
#define printByte(args)  print(args,BYTE);
#endif

LiquidCrystal_I2C lcd(0x27, 20, 4); // set the LCD address to 0x27 for a 20 chars and 4 line display
MFRC522 mfrc522(SS_PIN, RST_PIN);   // Create MFRC522 instance
WiFiClientSecure wifi_client = WiFiClientSecure();
MQTTClient mqtt_client = MQTTClient(4000); //256 indicates the maximum size for packets being published and received.

String nameList[100];
String roleList[100];
String ppsnList[100];
boolean loggedList[100];
String clockOutPay = "0.0";
String totalPay = "0.0";
boolean joyStickFlag = false, logged = false;
int timeCounter = 0 , employeeCount = 0;

//Code is from the following tutorial: ESP32 Arduino: Timer interrupts. Code source: https://techtutorialsx.com/2017/10/07/esp32-arduino-timer-interrupts/
hw_timer_t * timer = NULL;
portMUX_TYPE timerMux = portMUX_INITIALIZER_UNLOCKED;

//*****************************************************************************************//
void IRAM_ATTR onTimer()
{ //timer interupt called every 25ms
  portENTER_CRITICAL_ISR(&timerMux);
  timeCounter++;
  if (timeCounter == 480)
  {
    logged = false;
    timeCounter = 0;
  }
  joyStickFlag = true;
  portEXIT_CRITICAL_ISR(&timerMux);

}
//*****************************************************************************************//

void setup() {
  Serial.begin(115200);
  SPI.begin();       
  pinMode(J_BTN, INPUT);                                           
  mfrc522.PCD_Init();
  connectAWS(); 
  enableInterrupt();
  //End of tutorial code
  lcd.init();                    
  lcd.backlight();
  lcdInit();
}

void loop() {
  mqtt_client.loop();
  readRFID();
  if (!mqtt_client.connected()) {
    Serial.println("AWS IoT Timeout!");
    connectAWS();
  }
}
