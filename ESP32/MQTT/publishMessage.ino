void publishMessage()
{
  //Create a JSON document of size 200 bytes, and populate it
  //See https://arduinojson.org/
  StaticJsonDocument<200> doc;
  doc["elapsed_time"] = millis() - t1;
  doc["value"] = random(1000);
  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer); // print to mqtt_client

  //Publish to the topic
  mqtt_client.publish(AWS_IOT_PUBLISH_TOPIC, jsonBuffer);
  Serial.println("Sent a message");
}
