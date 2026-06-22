function(doc) {
    if(doc.hasOwnProperty("source") && doc["source"] === 'jira'){
      if(!doc["archived"]){
            emit(doc['_id'], doc['card_id']);
      }
    }
  }