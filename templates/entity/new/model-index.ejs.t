---
inject: true
to: src/models/index.ts
append: true
---
export {default as <%= h.inflection.classify(name) %>} from './<%= h.inflection.classify(name) %>';