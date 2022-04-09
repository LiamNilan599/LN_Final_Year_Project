int printEmployees(int page_Total, int page)
{
  int sensorValue = map(analogRead(RL_PIN), 0, 1023, 0, 255);        // value read from the pot and line position
  // change the analog out value:
  if (sensorValue == 1021)
  {
    if (page > 0)
    {
      page--;
    }
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Choose Employee");
    lcd.setCursor(0, 1);
    lcd.print(nameList[page]);
    lcd.setCursor(0, 2);
    lcd.print(nameList[page + 1]);
    lcd.setCursor(0, 3);
    lcd.print(nameList[page + 2]);
    return page;
  }
  else if (sensorValue == 0)
  {
    if (page < page_Total)
    {
      page++;
    }
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Choose Employee");
    lcd.setCursor(0, 1);
    lcd.print(nameList[page]);
    lcd.setCursor(0, 2);
    lcd.print(nameList[page + 1]);
    lcd.setCursor(0, 3);
    lcd.print(nameList[page + 2]);
    return page;
  }
  else
  {
    lcd.setCursor(0, 0);
    lcd.print("Choose Employee");
    lcd.setCursor(0, 1);
    lcd.print(nameList[page]);
    lcd.setCursor(0, 2);
    lcd.print(nameList[page + 1]);
    lcd.setCursor(0, 3);
    lcd.print(nameList[page + 2]);
    return page;
  }
}
