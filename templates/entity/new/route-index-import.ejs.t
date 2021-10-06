---
inject: true
to: src/routes/index.ts
before: export
---
import <%= h.inflection.classify(name) %> from './<%= h.inflection.classify(name) %>Route';
