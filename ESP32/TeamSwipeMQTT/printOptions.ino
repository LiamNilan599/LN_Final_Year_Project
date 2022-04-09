void printOptions(bool menu)
{
  if (menu == false)
  {
    lcd.clear();
    lcd.setCursor(0, 1);
    lcd.print("Write New Card");
    lcd.setCursor(0, 2);
    lcd.print("Erase a card");
    lcd.setCursor(0, 3);
    lcd.print("Quit");
  }
  else
  {
    lcd.clear();
    lcd.setCursor(0, 1);
    lcd.print("Show Pay Earned");
    lcd.setCursor(0, 2);
    lcd.print("Show Total Pay");
    lcd.setCursor(0, 3);
    lcd.print("Quit");
  }
}
