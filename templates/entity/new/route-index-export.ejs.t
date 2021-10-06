---
inject: true
to: src/routes/index.ts
after: export
---
  <%= h.inflection.classify(name) %> as any,