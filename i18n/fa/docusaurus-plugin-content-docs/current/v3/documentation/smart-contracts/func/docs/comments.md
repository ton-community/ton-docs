import Feedback from '@site/src/components/Feedback';

# نظرات

FunC supports both single-line and multi-line comments.

**Single-line** comments start with `;;` (double semicolon). Example:

```func
int x = 1; ;; assigns 1 to x
```

**Multi-line** comments begin with `{-` and end with `-}`.
Unlike other languages, FunC allows nested multi-line comments.
Example:

```func
{- This is a multi-line comment
    {- This is a comment inside a comment -}
-}
```

Additionally, single-line comments `;;` can appear inside multi-line comments, and they take precedence over multi-line comments `{- -}`. In the following example:

```func
{-
  Start of the comment

;; This comment’s ending is itself commented out -> -}

const a = 10;

;; This comment’s beginning is itself commented out -> {-

  End of the comment
-}
```

Here, `const a = 10;` is inside a multi-line comment and is effectively commented out. <Feedback />

