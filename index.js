
const response = {
    events: [],
    responses: [{
        text: ""
    }]
};

let lastResp = {}; 

Array.prototype.randomDiffResp = function(last) {
   if (this.length == 0) {
      return;
   } else if (this.length == 1) {
      return this[0];
   } else {
      let num = 0;
      do {
         num = Math.floor(Math.random() * this.length);
      } while (this[num] == last);
      return this[num];
   }
}


const handleFormAction = (requiredSlots, entities, slots, templates, submitAction, senderId='')=>{
return new Promise((resolve, reject)=>{
const nextUtter = 'utter_ask_', respData = JSON.parse(JSON.stringify(response));
        const nextSlot = ()=>{
            try{
                const maxIter = requiredSlots.length - 1;
                for (let i in requiredSlots){
                    const currSlot = requiredSlots[i];
                    if (slots[currSlot] === null){
                        const nextSlotName = nextUtter+currSlot;
                        if(senderId === ''){
                            respData.responses[0].text = templates[nextSlotName].randomDiffResp().text;   
                        }
                        else{
                            if(!(senderId in lastResp)){
                               lastResp[senderId] = {};
                               lastResp[senderId][nextSlotName] = '';
                            }
                            else if(!(nextSlotName in lastResp[senderId])){
                            	lastResp[senderId][nextSlotName] = '';
                            }
                            const last = lastResp[senderId][nextSlotName];
                            const nextReply = templates[nextSlotName].randomDiffResp(last).text;
                            respData.responses[0].text = nextReply;
                            lastResp[senderId][nextSlotName] = nextReply;
                        }
                        respData.events.push({event: "slot",name: "components",value:'text_msg'});
                        respData.events.push({event:"slot", name:"requested_slot", value:currSlot});
                        resolve(respData);
                        break;
                    }
                    else if(maxIter == i){
                        //got all slots - submit function
                        respData.events.push({event: "followup", name: submitAction});
                        resolve(respData);
                    }
                }
            }
            catch(e){
                reject(e);
            }
        }

    if(entities.length){
        const num_entities = entities.length - 1;
        for(let x in entities){
            const ner = entities[x];
            if(requiredSlots.includes(ner.entity)){
                respData.events.push({event:"slot", name:ner.entity, value:ner.value});
                slots[ner.entity] = ner.value;
            }
            if(num_entities == x){
                nextSlot();
            }
        }
    }
    else{
        nextSlot();
    }
});
}


module.exports.handleFormAction = handleFormAction;

module.exports.response = response;