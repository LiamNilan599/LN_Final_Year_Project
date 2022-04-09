void incomingMessageHandler(String &topic, String &payload)
{
  Serial.println("Message received!");
  Serial.println("Topic: " + topic);
  Serial.println("Payload: " + payload);
  if (topic.equals("TeamSwipe_ESP32/return-data"))
  {
    int idx1 = 0, idx2 = 0, arrayEnd, i = 0;
    arrayEnd = payload.indexOf("]");
    while (idx2 < arrayEnd)
    {
      String emp;
      idx1 = payload.indexOf("{", idx2);
      idx2 = payload.indexOf("}", idx1);
      emp = payload.substring(idx1, idx2 + 1);
      dataSorter(emp, i);
      idx1++;
      idx2 ++;
      i++;
    }
    employeeCount = i;
  }
  else if (topic.equals("TeamSwipe_ESP32/return-employee-pay"))
  {
    int idx1 = 0, idx2 = 0;
    idx1 = payload.indexOf("pay");
    idx2 = payload.indexOf(".", idx1);
    clockOutPay = payload.substring(idx1 + 5, idx2 + 3);
  }
  else if (topic.equals("TeamSwipe_ESP32/return-employee-earned"))
  {
    int idx1 = 0, idx2 = 0;
    idx1 = payload.indexOf("totalPay");
    idx2 = payload.indexOf(".", idx1);
    totalPay = payload.substring(idx1 + 10, idx2 + 3);
  }
}
