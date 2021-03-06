  var AWS = require('aws-sdk');
  AWS.config.loadFromPath('./config.json');
  
  var db = new AWS.DynamoDB();
  
  function keyvaluestore(table) {
    this.LRU = require("lru-cache");
    this.cache = this.LRU({ max: 500 });
    this.tableName = table;
  };
  
  /**
  * Initialize the tables
  * 
  */
  keyvaluestore.prototype.init = function(whendone) {
    
    var tableName = this.tableName;
    var self = this;
    var params = {TableName: tableName};
    db.describeTable(params,(err,data) => {
      if (err) {
        console.log("La tabla " +tableName+ " no existe ");
        console.log("Crea la tabla antes de empezar.");
        throw err;
      }

      whendone(); //Call Callback function.
    });    
  };
  
  /**
  * Get result(s) by key
  * 
  * @param search
  * 
  * Callback returns a list of objects with keys "inx" and "value"
  */
  
  keyvaluestore.prototype.get = function(search, callback) {
    var self = this;

    if (self.cache.get(search))
    callback(null, self.cache.get(search));
    else {
      
      /*
      * 
      * La función QUERY debe generar un arreglo de objetos JSON son cada
      * una de los resultados obtenidos. (inx, value, key).
      * Al final este arreglo debe ser insertado al cache. Y llamar a callback
      * 
      * Ejemplo:
      *    var items = [];
      *    items.push({"inx": data.Items[0].inx.N, "value": data.Items[0].value.S, "key": data.Items[0].key});
      *    self.cache.set(search, items)
      *    callback(err, items);
      */
     var params = {
      ExpressionAttributeValues: {
       ":v1": {
         S: search
        }
      }, 
      KeyConditionExpression: "keyword = :v1", 
      TableName: self.tableName
     };

      console.log(params);
      db.query(params, (err,data) => {
        if(err) throw err;
        
        console.log(data);
        
        
        var items = data.Items.map( i => {
          return {  "inx":i.inx.N, "value": i.value.S, "key": i.keyword }
        });

        self.cache.set(search, items)
        callback(err, items);
      })
    }
  };
  
  
  module.exports = keyvaluestore;
  