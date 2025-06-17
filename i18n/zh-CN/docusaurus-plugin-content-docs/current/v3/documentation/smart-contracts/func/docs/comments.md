import Feedback from '@site/src/components/Feedback';

# Comments

FunC supports both single-line and multi-line comments.

**Single-line** comments start with `;;` (double semicolon). Example:

```func
int x = 1; ;; assign 1 to x
```

**Multi-line** comments begin with `{-` and end with `-}`.
Unlike other languages, FunC allows nested multi-line comments.
Example:

```func
{- This is a multi-line comment
    {- this is a comment in the comment -}
-}
```

此外，多行注释中可以有单行注释，且单行注释 `;;` 比多行注释 `{- -}`“更强”。换句话说，在以下示例中： In the following example:

```func
{-
  Start of the comment

;; this comment ending is itself commented -> -}

const a = 10;
;; this comment begining is itself commented -> {-

  End of the comment
-}
```

`const a = 10;` 在多行注释内，因此被注释掉了。 <Feedback />

