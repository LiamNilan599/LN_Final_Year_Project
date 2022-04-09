void readRFID()
{
  byte PPSN_BLOCK = 4, ROLE_BLOCK = 5, NAME_BLOCK = 6, LEN = 18;

  String cardName, cardRole, cardPPSN;
  MFRC522::MIFARE_Key key;
  for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;

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
  byte sector = 1;
  Serial.println(F("Current data in sector:"));
  mfrc522.PICC_DumpMifareClassicSectorToSerial(&(mfrc522.uid), &key, sector);

  //-------------------------------------------
  byte ppsnBuffer[LEN];

  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, 4, &key, &(mfrc522.uid)); //line 834 of MFRC522.cpp file
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Authentication failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  status = mfrc522.MIFARE_Read(PPSN_BLOCK, ppsnBuffer, &LEN);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Reading failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  Serial.println();

  //---------------------------------------- GET ROLE

  byte roleBuffer[LEN];

  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, 5, &key, &(mfrc522.uid)); //line 834
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Authentication failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  status = mfrc522.MIFARE_Read(ROLE_BLOCK, roleBuffer, &LEN);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Reading failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  //---------------------------------------- GET NAME

  byte nameBuffer[LEN];

  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, 6, &key, &(mfrc522.uid)); //line 834
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Authentication failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  status = mfrc522.MIFARE_Read(NAME_BLOCK, nameBuffer, &LEN);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Reading failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();

  cardName = stringifyCardData(nameBuffer);
  cardRole = stringifyCardData(roleBuffer);
  cardPPSN = stringifyCardData(ppsnBuffer);

  memset(nameBuffer, 0, sizeof(nameBuffer));
  memset(roleBuffer, 0, sizeof(roleBuffer));
  memset(ppsnBuffer, 0, sizeof(ppsnBuffer));

  int i = 0;
  while (i < employeeCount)
  {
    if (cardName.equals(nameList[i]) && cardRole.equals(roleList[i]) && cardPPSN.equals(ppsnList[i]))
    {
      logged = true;
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Hello " + cardName);
      if (loggedList[i] == false)
      {
        lcd.setCursor(0, 1);
        lcd.print("Clocked-in");
      }
      else
      {
        lcd.setCursor(0, 1);
        lcd.print("Clocked-out");
      }
      lcd.setCursor(0, 2);
      lcd.print("Role: " + cardRole);
      lcd.setCursor(3, 3);
      lcd.print("Click for Menu");
      break;
    }
    else
    {
      i++;
    }
  }
  if ( i == employeeCount && logged != true)
  {
    lcd.clear();
    lcd.setCursor(1, 1);
    lcd.print("Unauthorised Card");
    lcd.setCursor(3, 3);
    lcd.print("Click to Return");
    while (digitalRead(J_BTN) != LOW)
    {
      mqtt_client.loop();
    }
    while (digitalRead(J_BTN) != HIGH)
    {
      mqtt_client.loop();
    }
    lcdInit();
  }
  else
  {
    if (loggedList[i] == false)
    {
      publishMessage("TeamSwipe_ESP32/clock-in", cardName);
      publishMessage("TeamSwipe_ESP32/request-employee-earned", cardName);
      clockOutPay = "0.0";
    }
    if (loggedList[i] == true)
    {
      publishMessage("TeamSwipe_ESP32/clock-out", cardName);
      publishMessage("TeamSwipe_ESP32/request-employee-earned", cardName);
    }
    if (roleList[i].equals("Manager") && cardRole.equals("Manager"))
    {
      menu(false);
      logged = false;
    }
    else
    {
      menu(true);
      logged = false;
    }
  }
}
