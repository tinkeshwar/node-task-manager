---
to: src/controllers/<%= h.inflection.classify(name) %>Controller.ts
---

import <%= h.inflection.classify(name) %> from '../models/<%= h.inflection.classify(name) %>';
import MasterController from '../master/MasterController';

class <%= h.inflection.classify(name) %>Controller extends MasterController<typeof <%= h.inflection.classify(name) %>> {
    
    constructor(){
        super(<%= h.inflection.classify(name) %>);
    }
}

<%= h.inflection.classify(name) %>Controller.options = {
    id: 'id',
    searchBy: ['id'],
    sortBy: ['created_at','desc'],
    createWith: ['id'],
    updateWith: ['status'],
    included: []
};

export default <%= h.inflection.classify(name) %>Controller;