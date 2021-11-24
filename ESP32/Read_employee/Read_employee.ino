#include <SPI.h>
#include <MFRC522.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>

#if defined(ARDUINO) && ARDUINO >= 100
#define printByte(args)  write(args);
#else
#define printByte(args)  print(args,BYTE);
#endif

//#define RST_PIN         22           // Configurable, see typical pin layout above
#define RST_PIN         17           // Configurable, see typical pin layout above
#define SS_PIN          5          // Configurable, see typical pin layout above

#define ANALOG_PIN 12
#define J_BTN 13

LiquidCrystal_I2C lcd(0x27, 20, 4); // set the LCD address to 0x27 for a 16 chars and 2 line display

hw_timer_t * timer = NULL;
portMUX_TYPE timerMux = portMUX_INITIALIZER_UNLOCKED;

MFRC522 mfrc522(SS_PIN, RST_PIN);   // Create MFRC522 instance

int sensorValue = 0, line = 1;        // value read from the pot
boolean joyStickFlag = false;
//*****************************************************************************************//
void IRAM_ATTR onTimer()
{ //timer interupt called every 25ms
  portENTER_CRITICAL_ISR(&timerMux);
  joyStickFlag = true;
  portEXIT_CRITICAL_ISR(&timerMux);

}
void setup() {
  timer = timerBegin(0, 80, true);
  timerAttachInterrupt(timer, &onTimer, true);
  timerAlarmWrite(timer, 250000, true);
  timerAlarmEnable(timer);
  //End of tutorial code
  Serial.begin(115200);                                           // Initialize serial communications with the PC
  SPI.begin();                                                  // Init SPI bus
  mfrc522.PCD_Init();                                              // Init MFRC522 card
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
  byte block , len;
  char *id[] = {"-MljZ3kXdtjqiuAvHy5g" , "-MmCtDesj_RKooBJq7O3", "-MmX7d-owf1wC1QYIesQ"};
  byte role[] = "Manager         ";
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

  //mfrc522.PICC_DumpToSerial(&(mfrc522.uid));      //uncomment this to see all blocks in hex

  //-------------------------------------------
  byte sector = 1;
  Serial.println(F("Current data in sector:"));
  mfrc522.PICC_DumpMifareClassicSectorToSerial(&(mfrc522.uid), &key, sector);
  Serial.println();

  byte buffer1[16];
  byte buffer2[16];
  byte buffer3[20];
  byte roleTemp[18];
  byte readRole[16];

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

  memcpy(buffer3, buffer1, sizeof(buffer1));
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

  memcpy(readRole, roleTemp, sizeof(readRole));

  bool authorised = false;
  for (uint8_t i = 0; i < 3; i++)
  {
    if (memcmp ( buffer3, id[i], sizeof(buffer3)) == 0)
    {
      authorised = true;
      break;
    }
  }

  if (memcmp (readRole, role, sizeof(readRole)) == 0)
  {
    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
    char c;
    bool logged = true;
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Hello manager");
    for (uint8_t i = 0; i < 20; i++)
    {
      lcd.setCursor(i, 1);
      lcd.print((char)buffer3[i]);
    }
    lcd.setCursor(3, 3);
    lcd.print("Click for Menu");

    while (logged)
    {
      if (digitalRead(J_BTN) == HIGH)
      {
        Print_options();
        line = 1;
        while (true)
        {
          if (joyStickFlag == true) // check flag
          {
            line = joystick(line);
            Serial.println(line);
            joyStickFlag = false;//reset flag
          }
          if (digitalRead(J_BTN) == HIGH && line == 1)
          {
            Write_employee();
            while(digitalRead(J_BTN) != HIGH){}
            Print_options();
            line = joystick(line);
          }
          else if (digitalRead(J_BTN) == HIGH && line == 2)
          {
            Erase_rfid();
            while(digitalRead(J_BTN) != HIGH){}
            Print_options();
            line = joystick(line);
          }
          else if (digitalRead(J_BTN) == HIGH && line == 3)
          {
            logged = false;
            break;
          }
        }
      }
    }
    LCD_init(lcd);

  }

  else
  {
    if ( authorised == true)
    {
      lcd.clear();
      lcd.setCursor(0, 1);
      lcd.print("Hello ");
      for (uint8_t i = 0; i < 20; i++)
      {
        lcd.setCursor(i, 2);
        lcd.print((char)buffer3[i]);
      }
    }
    else
    {
      lcd.clear();
      lcd.setCursor(1, 1);
      lcd.print("Unauthorised Card");
    }
    Serial.println("Print Checked in/ checked out");
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
  }


  //----------------------------------------

  Serial.println(F("\n**End Reading**\n"));

  delay(1000); //change value if you want to read cards faster

  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();
}
//*****************************************************************************************//
