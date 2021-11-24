int joystick(int line)
{
  sensorValue = map(analogRead(ANALOG_PIN), 0, 1023, 0, 255);
  // change the analog out value:

  if (sensorValue == 1021)
  {
    Serial.println("up");
    if (line > 1)
    {
      line--;
    }
    for (int i = 1; i < 4; i++)
    {
      lcd.setCursor(15, i);
      lcd.print("  ");
    }
    lcd.setCursor(15, line);
    lcd.print("<-");
    return line;
    //    Serial.print("line = ");
    //    Serial.println(line);
  }
  else if (sensorValue == 0)
  {
    Serial.println("down");
    if (line < 3)
    {
      line++;
    }
    for (int i = 1; i < 4; i++)
    {
      lcd.setCursor(15, i);
      lcd.print("  ");
    }
    lcd.setCursor(15, line);
    lcd.print("<-");
    return line;
  }
  else 
  {
    for (int i = 1; i < 4; i++)
    {
      lcd.setCursor(15, i);
      lcd.print("  ");
    }
    lcd.setCursor(15, line);
    lcd.print("<-");
    return line;
  }
}
