String stringifyCardData(byte dataBuffer[18])
{
  String dataOutput;
  dataOutput = String((char *)dataBuffer);
  dataOutput = dataOutput.substring(0, 16);
  dataOutput.trim();
  return dataOutput;
}
