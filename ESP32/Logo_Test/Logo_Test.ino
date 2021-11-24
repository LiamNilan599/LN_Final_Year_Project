#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <SPI.h>
#include <MFRC522.h>

#if defined(ARDUINO) && ARDUINO >= 100
#define printByte(args)  write(args);
#else
#define printByte(args)  print(args,BYTE);
#endif

//#define RST_PIN         22           // Configurable, see typical pin layout above
#define RST_PIN         17           // Configurable, see typical pin layout above
#define SS_PIN          5          // Configurable, see typical pin layout above

MFRC522 mfrc522(SS_PIN, RST_PIN);   // Create MFRC522 instance

const int analogInPin = 12;  // Analog input pin that the potentiometer is attached to

int sensorValue = 0, line = 1;        // value read from the pot
boolean joyStickFlag = false;


uint8_t T[8] = {0xff, 0x0, 0x1b, 0x1b, 0x1b, 0x1b, 0x1b, 0xff};;
uint8_t E[8] = {0xff, 0x0, 0xf, 0x01, 0x01, 0xf, 0x0, 0xff};
uint8_t A[8] = {0xff, 0x1b, 0x15, 0x0e, 0x0, 0x0e, 0x0e, 0xff};
uint8_t M[8] = {0xff, 0x0e, 0x04, 0x0a, 0x0e, 0x0e, 0x0e, 0xff};
uint8_t S[8] = {0xff, 0x10, 0x0f, 0x0f, 0x11, 0x1e, 0x01, 0xff};
uint8_t W[8] = {0xff, 0x0e, 0x0e, 0x0e, 0x0a, 0x0a, 0x15, 0xff};
uint8_t I[8] = {0xff, 0x11, 0x1b, 0x1b, 0x1b, 0x1b, 0x11, 0xff};
uint8_t P[8] = {0xff, 0x01, 0x0e, 0x0e, 0x01, 0x0f, 0x0f, 0xff};

LiquidCrystal_I2C lcd(0x27, 20, 4); // set the LCD address to 0x27 for a 16 chars and 2 line display
//Code is from the following tutorial: ESP32 Arduino: Timer interrupts. Code source: https://techtutorialsx.com/2017/10/07/esp32-arduino-timer-interrupts/
hw_timer_t * timer = NULL;
portMUX_TYPE timerMux = portMUX_INITIALIZER_UNLOCKED;

void IRAM_ATTR onTimer()
{ //timer interupt called every 25ms
  portENTER_CRITICAL_ISR(&timerMux);
  joyStickFlag = true;
  portEXIT_CRITICAL_ISR(&timerMux);

}
void setup()
{
//  timer = timerBegin(0, 80, true);
//  timerAttachInterrupt(timer, &onTimer, true);
//  timerAlarmWrite(timer, 250000, true);
//  timerAlarmEnable(timer);
  //End of tutorial code
  Serial.begin(115200);

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

void printOptions(void)
{
  lcd.clear();
  lcd.setCursor(0, 1);
  lcd.print("Write New Card <-");
  lcd.setCursor(0, 2);
  lcd.print("Erase a card");
  lcd.setCursor(0, 3);
  lcd.print("Quit");
}
void joystick(void)
{
  sensorValue = map(analogRead(analogInPin), 0, 1023, 0, 255);
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
    //    Serial.print("line = ");
    //    Serial.println(line);
  }
}


void loop()
{
  char c;
  c = Serial.read();
  if (c == 'L' || c == 'l')
  {
    printOptions();

  }
  else if (c == 'W' || c == 'w')
  {
    WriteTest();
  }
  else
  {
    if (joyStickFlag == true) // check flag
    {
      joystick();
      joyStickFlag = false;//reset flag
    }
  }
}
