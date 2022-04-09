void incomingMessageHandler(String &topic, String &payload) {
  int idx1 = 0, idx2 = 0, arrayEnd, i = 0;
  Serial.println("Message received!");
  Serial.println("Topic: " + topic);
  Serial.println("Payload: " + payload);

  arrayEnd = payload.indexOf("]");
  while (idx2 < arrayEnd)
  {
    String emp;
    idx1 = payload.indexOf("{", idx2);
    idx2 = payload.indexOf("}", idx1);
    emp = payload.substring(idx1, idx2 +1);
    dataSorter(emp, i);
    idx1++;
    idx2 ++;
  }
  Serial.println(nameList[i]);
  Serial.println(roleList[i]);
  Serial.println(ppsnList[i]);
}
