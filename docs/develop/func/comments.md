# Comments

FunC has traditional comments: `//` for single-line and `/* ... */` for multi-line:
```func
/*
  Just an assignment
*/
int x = 1; // assign 1 to x
```

They are not nested, like in C, JavaScript, and many other languages.

:::caution
Before v0.5.0, FunC had Lisp-style comments (`;;` and `{- ... -}`).  
Although they are still supported, they might be removed in future versions.
:::
