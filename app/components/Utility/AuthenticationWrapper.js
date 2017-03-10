export function encodeObjectToUriString(obj) {
  var str = "";
  for (var key in obj) {
      if (str != "") {
          str += "&";
      }else{
        str += "?"
      }
      str += key + "=" + encodeURIComponent(obj[key]);
  }
  return str;
}
