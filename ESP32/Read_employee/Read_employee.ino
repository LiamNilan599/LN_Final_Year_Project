#include <SPI.h>
#include <MFRC522.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>

#if defined(ARDUINO) && ARDUINO >= 100
#define printByte(args)  write(args);
#else
#define printByte(args)  print(args,BYTE);
#endif

#define RST_PIN         17           // Configurable, see typical pin layout above
#define SS_PIN          5          // Configurable, see typical pin layout above

#define UD_PIN 33
#define RL_PIN 32

#define J_BTN 16

LiquidCrystal_I2C lcd(0x27, 20, 4); // set the LCD address to 0x27 for a 20 chars and 4 line display

MFRC522 mfrc522(SS_PIN, RST_PIN);   // Create MFRC522 instance


//Code is from the following tutorial: ESP32: Getting Started with Firebase (Realtime Database). Code source: https://randomnerdtutorials.com/esp32-firebase-realtime-database/#esp32-read-data-firebase
//Provide the token generation process info.
#include "addons/TokenHelper.h"
//Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

#define WIFI_SSID "Loans_Phone"
#define WIFI_PASSWORD "raid1paidrrf"

// Insert Firebase project API Key
#define API_KEY "AIzaSyBUYku_zqKT-3ivgUA4IqTrVf1An0yxwNQ"

// Insert RTDB URLefine the RTDB URL */
#define DATABASE_URL "https://react-2-21cb7-default-rtdb.europe-west1.firebasedatabase.app/"

//Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

boolean joyStickFlag = false, signupOK = false, logged = false;
int timeCounter = 0;
//End of tutorial code

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

void setup()
{
  timer = timerBegin(0, 80, true);
  timerAttachInterrupt(timer, &onTimer, true);
  timerAlarmWrite(timer, 250000, true);
  timerAlarmEnable(timer);
  //End of tutorial code

  Serial.begin(115200);
  SPI.begin();                                                  // Init SPI bus
  mfrc522.PCD_Init();                                              // Init MFRC522 card

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  Is_signed_in();
  Get_Database();

  Serial.println(F("Read personal data on a MIFARE PICC:"));    //shows in serial that it is ready to read
  lcd.init();                      // initialize the Screen
  lcd.backlight();
  pinMode(J_BTN, INPUT);

  LCD_init(lcd);
}

//*****************************************************************************************//
void loop() {

  // Prepare key - all keys are set to FFFFFFFFFFFFh at chip delivery from the factory.
  MFRC522::MIFARE_Key key;
  for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;

  //some variables we need
  String id , dataRole;
  byte block , len;
  MFRC522::StatusCode status;

  //-------------------------------------------

  // Look for new cards
  if ( ! mfrc522.PICC_IsNewCardPresent()) {
    return;
  }

  // Select one of the cards
  if ( ! mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  Serial.println(F("**Card Detected:**"));

  //-------------------------------------------

  mfrc522.PICC_DumpDetailsToSerial(&(mfrc522.uid)); //dump some details about the card

  //-------------------------------------------
  byte sector = 1;
  Serial.println(F("Current data in sector:"));
  mfrc522.PICC_DumpMifareClassicSectorToSerial(&(mfrc522.uid), &key, sector);
  Serial.println();

  byte buffer1[16];
  byte buffer2[16];
  byte buffer3[20];
  byte readRole[16];
  byte roleTemp[18];

  block = 4;
  len = 18;

  //------------------------------------------- GET ID
  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, 4, &key, &(mfrc522.uid)); //line 834 of MFRC522.cpp file
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Authentication failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  status = mfrc522.MIFARE_Read(block, buffer1, &len);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Reading failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  block = 5;

  status = mfrc522.MIFARE_Read(block, buffer2, &len);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Reading failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  memmove(buffer3, buffer1, sizeof(buffer1));
  uint8_t w = 0;
  for (uint8_t i = 16; i < 20; i++)
  {
    buffer3[i] = buffer2[w];
    w++;
  }

  //---------------------------------------- GET ROLE

  block = 6;

  // status = mfrc522.MIFARE_Read(block, readRole, &len);
  status = mfrc522.MIFARE_Read(block, roleTemp, &len);
  if (status != MFRC522::STATUS_OK)
  {
    Serial.print(F("Reading failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  memmove(readRole, roleTemp, sizeof(readRole));
  dataRole = String((char *)readRole);
  dataRole = dataRole.substring(0, 16);
  dataRole.trim();

  bool authorised = false;
  if (fbdo.dataType() == "json")
  {
    FirebaseJsonData result;

    id = String((char *)buffer3);
    id = id.substring(0, 20);
    FirebaseJson &json = fbdo.to<FirebaseJson>();
    json.get(result,  id + "/id");
    Serial.println("id: " + id);
    Serial.println("db: " + result.to<String>());
    if (result.success && id.equals( result.to<String>()))
    {
      authorised = true;
    }
    else
    {
      Serial.println("no sucess");
    }
  }
  FirebaseJsonData result;
  FirebaseJson &json = fbdo.to<FirebaseJson>();
  json.get(result,  id + "/role");

  if (dataRole.equals( result.to<String>()) && dataRole.equals("Manager") && authorised == true)
  {
    timeCounter = 0;
    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
    logged = true;
    json.get(result,  id + "/name");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Hello " + result.to<String>());
    for (uint8_t i = 0; i < 20; i++)
    {
      lcd.setCursor(i, 1);
      lcd.print((char)buffer3[i]);
    }
    lcd.setCursor(3, 3);
    lcd.print("Click for Menu");

    while (logged)
    {
      if (digitalRead(J_BTN) == LOW)
      {
        timeCounter = 0;
        Print_options();
        int line = 1;
        int page = 0;
        while (true)
        {
          if (joyStickFlag == true) // check flag
          {
            line = joystick(line);
            joyStickFlag = false;//reset flag
          }
          if (digitalRead(J_BTN) == LOW && line == 1)
          {
            timeCounter = 0;
            size_t Length = json.iteratorBegin();
            FirebaseJson::IteratorValue value;
            String List[150];
            int position = 0 , pages;
            for (size_t i = 0; i < Length; i += 7)
            {
              value = json.valueAt(i);
              List[position] = value.key;
              position++;
            }
            pages = position - 3;
            lcd.clear();
            while (digitalRead(J_BTN) != LOW)
            {
              if (joyStickFlag == true) // check flag
              {
                // page = Print_employees(pages, page, List, json);
                page = Print_employees(pages, page, List, json);
                line = joystick(line);
                joyStickFlag = false;//reset flag
              }
            }
            if (line == 1)
            {
              json.get(result,  List[page] + "/role");
              Serial.println(List[page]);
              Write_employee(List[page], result.to<String>());
            }
            else if (line == 2)
            {
              json.get(result,  List[page + 1] + "/role");
              Serial.println(List[page + 1]);
              Write_employee(List[page + 1], result.to<String>());
            }
            else if (line == 3)
            {
              json.get(result,  List[page + 2] + "/role");
              Serial.println(List[page + 2]);
              Write_employee(List[page + 2], result.to<String>());
            }
            while (digitalRead(J_BTN) != LOW) {}
            memset(List, 0, sizeof(List));
            Print_options();
            line = joystick(line);
            page = 0;
          }
          else if (digitalRead(J_BTN) == LOW && line == 2)
          {
            timeCounter = 0;
            Erase_rfid();
            while (digitalRead(J_BTN) != LOW) {}
            Print_options();
            line = joystick(line);
          }
          else if (digitalRead(J_BTN) == LOW && line == 3)
          {
            logged = false;
            break;
          }
        }
      }
    }
    LCD_init(lcd);
    Get_Database();
  }

  else
  {
    if ( authorised == true)
    {
      timeCounter = 0;
      mfrc522.PICC_HaltA();
      mfrc522.PCD_StopCrypto1();
      logged = true;
      json.get(result,  id + "/name");
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Hello " + result.to<String>());
      for (uint8_t i = 0; i < 20; i++)
      {
        lcd.setCursor(i, 2);
        lcd.print((char)buffer3[i]);
      }
      lcd.setCursor(3, 3);
      lcd.print("Click for Menu");
      Serial.println("Print Checked in/ checked out");
      while (logged)
      {
        if (digitalRead(J_BTN) == LOW)
        {
        }
      }
      LCD_init(lcd);
      Get_Database();
    }
    else
    {
      lcd.clear();
      lcd.setCursor(1, 1);
      lcd.print("Unauthorised Card");
    }
  }

  //show menu for checking money earned


  //    Serial.println(memcmp (readRole, role, sizeof(readRole)));
  //    for (uint8_t i = 0; i < 16; i++)
  //    {
  //      if (readRole[i] != 32)
  //      {
  //        Serial.write(readRole[i]);
  //      }
  //    }
  //    Serial.println();
  //    for (uint8_t i = 0; i < 16; i++)
  //    {
  //      if (role[i] != 32)
  //      {
  //        Serial.write(role[i]);
  //      }
  //    }



  //----------------------------------------

  Serial.println(F("\n**End Reading**\n"));

  delay(1000); //change value if you want to read cards faster

  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();
}
//*****************************************************************************************//
