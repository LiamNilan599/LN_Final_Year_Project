int Print_employees(int page_Total, int page, String List[], FirebaseJson json)
{
  int sensorValue = map(analogRead(RL_PIN), 0, 1023, 0, 255);        // value read from the pot and line position
  FirebaseJsonData result;
  // change the analog out value:
  if (sensorValue == 1021)
  {
    Serial.println("right");
    if (page > 0)
    {
      page--;
    }
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Choose Employee");
    json.get(result,  List[page] + "/name");
    lcd.setCursor(0, 1);
    lcd.print(result.to<String>());
    json.get(result,  List[page + 1] + "/name");
    lcd.setCursor(0, 2);
    lcd.print(result.to<String>());
    json.get(result,  List[page + 2] + "/name");
    lcd.setCursor(0, 3);
    lcd.print(result.to<String>());
    return page;
  }
  else if (sensorValue == 0)
  {
    Serial.println("left");
    if (page < page_Total)
    {
      page++;
    }
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Choose Employee");
    json.get(result,  List[page] + "/name");
    lcd.setCursor(0, 1);
    lcd.print(result.to<String>());
    json.get(result,  List[page + 1] + "/name");
    lcd.setCursor(0, 2);
    lcd.print(result.to<String>());
    json.get(result,  List[page + 2] + "/name");
    lcd.setCursor(0, 3);
    lcd.print(result.to<String>());
    return page;
  }
  else
  {
    lcd.setCursor(0, 0);
    lcd.print("Choose Employee");
    json.get(result,  List[page] + "/name");
    lcd.setCursor(0, 1);
    lcd.print(result.to<String>());
    json.get(result,  List[page + 1] + "/name");
    lcd.setCursor(0, 2);
    lcd.print(result.to<String>());
    json.get(result,  List[page + 2] + "/name");
    lcd.setCursor(0, 3);
    lcd.print(result.to<String>());
    return page;
  }
}
