---
tags: daily
mood: <empty>
---

## 🧨 Tasks
```tasks
not done
(scheduled before {{date:YYYY-MM-DD}}) OR (due before {{date:YYYY-MM-DD}})
```

## 📈 Stats 
*Things to celebrate on!*

### 🏆 Tasks completed

|Month|Yesterday|Today|
|------|----------|------|
|`$= dv.pages().file.tasks.where(t => t.completed).where(t => t.text.includes('✅ ' + new Date(new Date('{{date:YYYY-MM-DD}}').setDate(1)).toISOString().slice(0, 7))).length`|`$= dv.pages().file.tasks.where(t => t.completed).where(t => t.text.includes('✅ ' + new Date(new Date('{{date:YYYY-MM-DD}}') - 86400000).toISOString().slice(0, 10))).length`|`$= dv.pages().file.tasks.where(t => t.completed).where(t => t.text.includes('✅ {{date:YYYY-MM-DD}}')).length`|


## 🥳 Done Today!
```tasks
done {{date:YYYY-MM-DD}}
```


## 🪵 Log
*What's on my mind today?*


