#include <SPI.h>
#include <MFRC522.h>

#define RST_PIN         22           // Configurable, see typical pin layout above
#define SS_PIN          5          // Configurable, see typical pin layout above

MFRC522 mfrc522(SS_PIN, RST_PIN);   // Create MFRC522 instance

//*****************************************************************************************//
void setup() {
  Serial.begin(115200);                                           // Initialize serial communications with the PC
  SPI.begin();                                                  // Init SPI bus
  mfrc522.PCD_Init();                                              // Init MFRC522 card
  Serial.println(F("Read personal data on a MIFARE PICC:"));    //shows in serial that it is ready to read
}

//*****************************************************************************************//
void loop() {

  // Prepare key - all keys are set to FFFFFFFFFFFFh at chip delivery from the factory.
  MFRC522::MIFARE_Key key;
  for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;

  //some variables we need
  byte block;
  byte len;

  //byte id[] = "-MljZ3kXdtjqiuAvHy5g";
<<<<<<< HEAD
  char *id[] = {"-MljZ3kXdtjqiuAvHy5g" , "-MmCtDesj_RKooBJq7O3", "-MmX7d-owf1wC1QYIesQ"};
=======
  char *id[] = {"-MljZ3kXdtjqiuAvHy5g" , "-MmCtDesj_RKooBJq7O3"};
>>>>>>> bf1332b (Add a login Page with differnt layout to other pages)
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
  Serial.print(F("Name: "));

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
  for (uint8_t i = 0; i < 20; i++)
  {
    Serial.write(buffer3[i]);
  }
  Serial.print(" ");
  bool authorised = false;
<<<<<<< HEAD
  for (uint8_t i = 0; i < 3; i++)
=======
  for (uint8_t i = 0; i < 2; i++)
>>>>>>> bf1332b (Add a login Page with differnt layout to other pages)
  {
    if (memcmp ( buffer3, id[i], sizeof(buffer3)) == 0)
    {
      authorised = true;
      break;
    }
  }
  if ( authorised == true)
  {
    Serial.println("Hello");
  }
  else
  {
    Serial.print("Unauthorised");
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
  
  if (memcmp (readRole, role, sizeof(readRole)) == 0)
  {
    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
    char c;
    bool logged = true;
    Serial.println("Hello manager");
    Serial.println("1\tWrite New Card\n2\tErase a card\n3\tQuit");
    while (logged)
    {
      if (Serial.available()>0)
      {
        c = Serial.read();
        if (c == '1')
        {
          Write_employee();
          Serial.println("1\tWrite New Card\n2\tErase a card\n3\tQuit");
        }
        else if (c == '2')
        {
          Erase_rfid();
          //Serial.println("1\tWrite New Card\n2\tErase a card\n3\tQuit");
          Serial.println("Cool 2");
        }
        else if (c == '3')
        {
          logged = false;
        }
        else
        {
          Serial.println("Invalid");
        }
      }
    }
  }

  else
  {
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
