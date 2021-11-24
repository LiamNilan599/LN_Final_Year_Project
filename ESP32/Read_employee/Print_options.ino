void Print_options(void)
{
  lcd.clear();
  lcd.setCursor(0, 1);
  lcd.print("Write New Card");
  lcd.setCursor(0, 2);
  lcd.print("Erase a card");
  lcd.setCursor(0, 3);
  lcd.print("Quit");
}
