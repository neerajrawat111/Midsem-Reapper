# Problem Statement

Your task is to complete the `writeDataFile()` function, which is inside the **`./index.js`** file.


##  Requirements

The function should perform the following:

- **Write** the text:  
  ```
  We will not miss the exam next time
  ```
- into a file named **`file.txt`** in the **same directory** as the `index.js` file.
- Use the **absolute path** while writing to the file.
- Use the **synchronous method** from the Node.js **`fs`** module.

---

##  Example

After calling:

```javascript
writeDataFile();
```

A file named **`file.txt`** should exist in the same folder as your `index.js`, containing the text:

```
We will not miss the exam next time
```
