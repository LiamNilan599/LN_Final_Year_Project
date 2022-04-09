void dataSorter(String &Json, int i) {
  int idx1, idx2;
  String empName, role, ppsn, working;
  idx1 = Json.indexOf("name");
  idx2 = Json.indexOf(",", idx1);
  empName = Json.substring(idx1 + 7, idx2 - 1);
  idx1 = Json.indexOf("role");
  idx2 = Json.indexOf(",", idx1 + 1);
  role = Json.substring(idx1 + 7, idx2 - 1);
  idx1 = Json.indexOf("ppsn");
  idx2 = Json.indexOf(",", idx1 + 1);
  ppsn = Json.substring(idx1 + 7, idx2 - 1);
  idx1 = Json.indexOf("working");
  idx2 = Json.indexOf(",", idx1 + 1);
  working = Json.substring(idx1 + 9, idx2);
  nameList[i] = empName;
  roleList[i] = role;
  ppsnList[i] = ppsn;
  if(working.equals("true"))
  {
    loggedList[i] = true;
  }
  else
  {
    loggedList[i] = false;
  }
}
