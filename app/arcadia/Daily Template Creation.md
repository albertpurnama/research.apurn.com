Required plugins:
- Daily notes
- Obsidian tasks
- Dataview

Used Dataview mostly to generate the [[daily#Stats]] section

```javascript
const yesterday = new Date(new Date().setDate(new Date().getDate()-1)).toISOString().slice(0, 10);
```

^ the above is a one-liner to create a yesterday's date in `YYYY-MM-DD` format.

For yesterday's stat the dataview logic is the following
```javascript
dv.pages().file.tasks.where(t => t.completed).where(t => t.text.includes('✅ ' + new Date(new Date('{{date:YYYY-MM-DD}}') - 86400000).toISOString().slice(0, 10))).length
```

It will result in an error in the template, but it's fine. it will work whenever Daily notes are created

For the **tasks completed this month** stat. The query is:
```javascript
$= dv.pages().file.tasks.where(t => t.completed).where(t => t.text.includes('✅ ' + new Date(new Date('{{date:YYYY-MM-DD}}').setDate(1)).toISOString().slice(0, 7))).length
```

Notice that we only take up to 7 characters of the date. For example, the date '2023-04-15' -> '2023-04'

Pseudocode of the above:
1. Take tasks that's done.
2. Take the current date
3. Take YYYY-MM string
4. Find tasks that has ✅ YYYY-MM

This should filter the tasks done this month