let GetDataStructure = (fields) =>{
  var obj = {};
  fields.map((field,index)=>{
    switch(field.Type){
      case "string":
        obj[field.Name] = "";
        break;
      case "number":
        obj[field.Name] = 0
        break;
      case "boolean":
        obj[field.Name] = false;
        break;
      case "array":
        switch (field.ArrayType){
          case "string":
            if(field.ArrayItems.length > 0)
              obj[field.Name] = field.ArrayItems;
            else
              obj[field.Name] = [""];
            break;
          case "number":
            if(field.arrayItems.length > 0)
              obj[field.Name] = field.ArrayItems;
            else
              obj[field.Name] = [0];
            break;
          case "boolean":
            if(field.ArrayItems.length > 0)
              obj[field.Name] = field.ArrayItems;
            else
              obj[field.Name] = [false];
            break;
          case "object":
            var x = GetDataStructure(field.Fields);
            obj[field.Name] = [x];
            break;
        }
        break;
      case "object":
        obj[field.Name] = GetDataStructure(field.Fields);
        break;
    }
  });
  return obj;
}

export default GetDataStructure;
