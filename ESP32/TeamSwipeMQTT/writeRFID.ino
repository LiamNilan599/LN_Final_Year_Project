void writeRFID(String empName, String role, String ppsn)
{
  byte PPSN_BLOCK = 4, ROLE_BLOCK = 5, NAME_BLOCK = 6, LEN = 18;
  lcd.clear();
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
    Serial.println("No Card 2");
    return;
  }

  byte writeBuffer[LEN];
  MFRC522::StatusCode status;
  byte len;

  memset(writeBuffer, ' ', sizeof(writeBuffer));
  ppsn.getBytes(writeBuffer, LEN);
  len = ppsn.length();

  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, PPSN_BLOCK, &key, &(mfrc522.uid));
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("PCD_Authenticate() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    lcd.clear();
    lcd.setCursor(5, 1);
    lcd.print("Card Error");
    lcd.setCursor(3, 3);
    lcd.print("Click to Return");
    return;
  }

  status = mfrc522.MIFARE_Write(PPSN_BLOCK, writeBuffer, 16);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("MIFARE_Write() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    lcd.clear();
    lcd.setCursor(5, 1);
    lcd.print("Card Error");
    lcd.setCursor(3, 3);
    lcd.print("Click to Return");
    return;
  }

  memset(writeBuffer, ' ', sizeof(writeBuffer));
  role.getBytes(writeBuffer, LEN);
  len = role.length();

  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, ROLE_BLOCK, &key, &(mfrc522.uid));
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("PCD_Authenticate() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    lcd.clear();
    lcd.setCursor(5, 1);
    lcd.print("Card Error");
    lcd.setCursor(3, 3);
    lcd.print("Click to Return");
    return;
  }

  status = mfrc522.MIFARE_Write(ROLE_BLOCK, writeBuffer, 16);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("MIFARE_Write() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    lcd.clear();
    lcd.setCursor(5, 1);
    lcd.print("Card Error");
    lcd.setCursor(3, 3);
    lcd.print("Click to Return");
    return;
  }

  memset(writeBuffer, ' ', sizeof(writeBuffer));
  empName.getBytes(writeBuffer, LEN);
  len = empName.length();

  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, NAME_BLOCK, &key, &(mfrc522.uid));
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("PCD_Authenticate() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    lcd.clear();
    lcd.setCursor(5, 1);
    lcd.print("Card Error");
    lcd.setCursor(3, 3);
    lcd.print("Click to Return");
    return;
  }

  status = mfrc522.MIFARE_Write(NAME_BLOCK, writeBuffer, 16);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("MIFARE_Write() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    lcd.clear();
    lcd.setCursor(5, 1);
    lcd.print("Card Error");
    lcd.setCursor(3, 3);
    lcd.print("Click to Return");
    return;
  }
  else
  {
    lcd.clear();
    lcd.setCursor(4, 1);
    lcd.print("Data Written");
    lcd.setCursor(3, 3);
    lcd.print("Click to Return");
  }
  mfrc522.PICC_HaltA(); // Halt PICC
  mfrc522.PCD_StopCrypto1();  // Stop encryption on PCD
}
