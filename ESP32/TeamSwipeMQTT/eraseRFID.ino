void eraseRFID()
{
  byte PPSN_BLOCK = 4, ROLE_BLOCK = 5, NAME_BLOCK = 6, LEN = 18;

  MFRC522::MIFARE_Key key;
  for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;

  // Look for new cards
  if ( ! mfrc522.PICC_IsNewCardPresent()) {
    lcd.clear();
    lcd.setCursor(7, 1);
    lcd.print("No Card");
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
    return;
  }

  // Select one of the cards
  if ( ! mfrc522.PICC_ReadCardSerial()) {
    lcd.clear();
    lcd.setCursor(7, 1);
    lcd.print("No Card");
    lcd.setCursor(3, 3);
    lcd.print("Click to Return");
    return;
  }

  byte spaceBuffer[LEN];
  memset(spaceBuffer, ' ', sizeof(spaceBuffer));
  MFRC522::StatusCode status;

  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, PPSN_BLOCK, &key, &(mfrc522.uid));
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("PCD_Authenticate() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  // Write block
  status = mfrc522.MIFARE_Write(PPSN_BLOCK, spaceBuffer, 16);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("MIFARE_Write() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, ROLE_BLOCK, &key, &(mfrc522.uid));
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("PCD_Authenticate() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  // Write block
  status = mfrc522.MIFARE_Write(ROLE_BLOCK, spaceBuffer, 16);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("MIFARE_Write() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, NAME_BLOCK, &key, &(mfrc522.uid));
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("PCD_Authenticate() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  // Write block
  status = mfrc522.MIFARE_Write(NAME_BLOCK, spaceBuffer, 16);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("MIFARE_Write() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }
  else
  {
    lcd.clear();
    lcd.setCursor(4, 1);
    lcd.print("Data Erased");
    lcd.setCursor(3, 3);
    lcd.print("Click to Return");
  }

  mfrc522.PICC_HaltA(); // Halt PICC
  mfrc522.PCD_StopCrypto1();  // Stop encryption on PCD
}
