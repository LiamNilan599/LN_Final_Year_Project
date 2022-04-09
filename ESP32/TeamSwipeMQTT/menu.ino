void menu(bool menuType) {
  while (logged)
  {
    if (digitalRead(J_BTN) == LOW)
    {
      while (digitalRead(J_BTN) != HIGH)
      {
        mqtt_client.loop();
      }
      timeCounter = 0;
      printOptions(menuType);
      int line = 1;
      int page = 0;
      while (true)
      {
        if (logged == false)
        {
          break;
        }
        if (joyStickFlag == true) // check flag
        {
          line = joystick(line);
          joyStickFlag = false;//reset flag
        }
        if (digitalRead(J_BTN) == LOW && line == 1)
        {
          while (digitalRead(J_BTN) != HIGH)
          {
            mqtt_client.loop();
          }
          if (menuType == false)
          {
            timeCounter = 0;
            int pages = employeeCount -3;
            lcd.clear();
            while (digitalRead(J_BTN) != LOW)
            {
              if (joyStickFlag == true) // check flag
              {
                page = printEmployees(pages, page);
                line = joystick(line);
                joyStickFlag = false;//reset flag
              }
              mqtt_client.loop();
            }
            if (line == 1)
            {
              //Serial.println(nameList[(line - 1) + page]);
              writeRFID(nameList[(line - 1) + page], roleList[(line - 1) + page], ppsnList[(line - 1) + page]);
            }
            else if (line == 2)
            {
              //Serial.println(nameList[(line - 1) + page]);
              writeRFID(nameList[(line - 1) + page], roleList[(line - 1) + page], ppsnList[(line - 1) + page]);
            }
            else if (line == 3)
            {
              //Serial.println(nameList[(line - 1) + page]);
              writeRFID(nameList[(line - 1) + page], roleList[(line - 1) + page], ppsnList[(line - 1) + page]);
            }
          }
          else
          {
            lcd.clear();
            lcd.setCursor(0, 0);
            lcd.print("Pay Earned Today");
            lcd.setCursor(0, 2);
            lcd.print("Pay: $" + clockOutPay);
            lcd.setCursor(3, 3);
            lcd.print("Click to return");
          }
          while (digitalRead(J_BTN) != LOW)
          {
            mqtt_client.loop();
          }
          while (digitalRead(J_BTN) != HIGH)
          {
            mqtt_client.loop();
          }
          printOptions(menuType);
          line = joystick(line);
          page = 0;
        }
        else if (digitalRead(J_BTN) == LOW && line == 2)//erase
        {
          while (digitalRead(J_BTN) != HIGH)
          {
            mqtt_client.loop();
          }
          timeCounter = 0;
          if (menuType == false)
          {
            eraseRFID();
          }
          else
          {      
            lcd.clear();
            lcd.setCursor(0, 0);
            lcd.print("Pay Earned Total");
            lcd.setCursor(0, 2);
            lcd.print("Pay: $" + totalPay);
            lcd.setCursor(3, 3);
            lcd.print("Click to return");
          }
          while (digitalRead(J_BTN) != LOW)
          {
            mqtt_client.loop();
          }
          while (digitalRead(J_BTN) != HIGH)
          {
            mqtt_client.loop();
          }
          printOptions(menuType);
          line = joystick(line);
        }
        else if (digitalRead(J_BTN) == LOW && line == 3)//exit
        {
          logged = false;
          break;
        }
      }
    }
  }
  lcdInit();
  publishMessage("TeamSwipe_ESP32/request-employee-array", "Null");
}
