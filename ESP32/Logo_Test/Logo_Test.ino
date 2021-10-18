#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#if defined(ARDUINO) && ARDUINO >= 100
#define printByte(args)  write(args);
#else
#define printByte(args)  print(args,BYTE);
#endif

uint8_t T[8] = {0xff, 0x0, 0x1b, 0x1b, 0x1b, 0x1b, 0x1b, 0xff};;
uint8_t E[8] = {0xff, 0x0, 0xf, 0x01, 0x01, 0xf, 0x0, 0xff};
uint8_t A[8] = {0xff, 0x1b, 0x15, 0x0e, 0x0, 0x0e, 0x0e, 0xff};
uint8_t M[8] = {0xff, 0x0e, 0x04, 0x0a, 0x0e, 0x0e, 0x0e, 0xff};
uint8_t S[8] = {0xff, 0x10, 0x0f, 0x0f, 0x11, 0x1e, 0x01, 0xff};
uint8_t W[8] = {0xff, 0x0e, 0x0e, 0x0e, 0x0a, 0x0a, 0x15, 0xff};
uint8_t I[8] = {0xff, 0x11, 0x1b, 0x1b, 0x1b, 0x1b, 0x11, 0xff};
uint8_t P[8] = {0xff, 0x01, 0x0e, 0x0e, 0x01, 0x0f, 0x0f, 0xff};

LiquidCrystal_I2C lcd(0x27, 20, 4); // set the LCD address to 0x27 for a 16 chars and 2 line display

void setup()
{
  lcd.init();                      // initialize the lcd
  lcd.backlight();

  lcd.createChar(0, T);
  lcd.createChar(1, E);
  lcd.createChar(2, A);
  lcd.createChar(3, M);
  lcd.createChar(4, S);
  lcd.createChar(5, W);
  lcd.createChar(6, I);
  lcd.createChar(7, P);
  lcd.home();
  displayKeyCodes();

}

// display all keycodes
void displayKeyCodes(void)
{
  lcd.setCursor(5, 1);
  lcd.printByte(0);
  lcd.printByte(1);
  lcd.printByte(2);
  lcd.printByte(3);
  lcd.printByte(4);
  lcd.printByte(5);
  lcd.printByte(6);
  lcd.printByte(7);
  lcd.printByte(1);
  lcd.printByte('~');
  lcd.setCursor(3, 2);
  lcd.print("Please Tap Card");
}

void loop()
{

}
