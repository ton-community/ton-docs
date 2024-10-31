# Comments
FunC has single-line comments which start with `;;` (double `;`). For example:
```func
int x = 1; ;; assign 1 to x
```

It also has multi-line comments which start with `{-` and end with `-}`. Note that unlike in many other languages, FunC multi-line comments can be nested. For example:
```func
{- This is a multi-line comment
    {- this is a comment in the comment -}
-}
```

Moreover, there can be one-line comments inside multi-line ones, and one-line comments `;;` are "stronger" than multiline `{- -}`. In other words in the following example:

```func
{-
  Start of the comment

;; this comment ending is itself commented -> -}

const a = 10;
;; this comment begining is itself commented -> {-

  End of the comment
-}
```

`const a = 10;` is inside multiline comment and is commented out.
