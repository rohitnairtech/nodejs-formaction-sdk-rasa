#FormAction SDK for Rasa


###Installation :
```
npm i nodejs-formaction-sdk-rasa
```
###Usage:
```javascript
const {handleFormAction} = require('nodejs-formaction-sdk-rasa');
handleFormAction(<REQUIRED_SLOTS_ARRAY>, <ENTITIES_ARRAY>, <SLOT_ARRAY>, <TEMPLATE_ARRAY>, <NEXT_ACTION_NAME>);
```
####OR
```javascript
const formAction = require('nodejs-formaction-sdk-rasa');
formAction.handleFormAction(<REQUIRED_SLOTS_ARRAY>, <ENTITIES_ARRAY>, <SLOT_ARRAY>, <TEMPLATE_ARRAY>, <NEXT_ACTION_NAME>);
```

###Example:
```javascript
const {handleFormAction} = require('nodejs-formaction-sdk-rasa');

const request = req.body; // from express endpoint in external nodejs actions endpoint
const required_slot = ['origin', 'destination', 'date'];
const entites = request.tracker.latest_message.entities;
const slots = request.tracker.slots;
const templates = request.domain.templates;
const nextAction = 'utter_flight_details';


const formHandle = handleFormAction(required_slot, entities, slots, templates, nextAction);
formHandle.then(resp=>{
	console.log(resp);
	//send the response back to rasa python agent
}).catch(err=>{
	console.log(err);
});
```

NOTES:
- TURN OFF AUTOFILL for SLOTS in domain, but use the same name as the ENTITIES for SLOTS - SlotFilling happens in the module
- Register utter_ask_<SLOT_NAME> this is used to dynamically utter a question back to the user.
- Register nextAction name - utterance/custom action name in domain. That action will called upon successfully completing slot filling.