# Comments
FunC has single-line comments which start with `;;` (double `;`). For example:
```cpp
int x = 1; ;; assign 1 to x
```

It also has multi-line comments which start with `{-` and end with `-}`. Note that unlike in many other languages, FunC multi-line comments can be nested. For example:
```cpp
{- This is a multi-line comment
    {- this is a comment in the comment -}
-}
```
