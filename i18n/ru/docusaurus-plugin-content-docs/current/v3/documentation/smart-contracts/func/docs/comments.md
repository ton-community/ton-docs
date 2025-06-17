import Feedback from '@site/src/components/Feedback';

# Комментарии

FunC supports both single-line and multi-line comments.

FunC имеет однострочные комментарии, которые начинаются с `;;` (двойной `;`). Например:

```func
int x = 1; ;; assign 1 to x
```

Он также имеет многострочные комментарии, которые начинаются с `{-` и заканчиваются на `-}`.
Обратите внимание, что в отличие от многих других языков, многострочные комментарии FunC могут быть вложенными.
Например:

```func
{- This is a multi-line comment
    {- this is a comment in the comment -}
-}
```

Более того, внутри многострочных комментариев могут быть однострочные, а однострочные комментарии `;;` "сильнее" многострочных `{- -}`. Другими словами, в следующем примере:

```func
{-
  Start of the comment

;; this comment ending is itself commented -> -}

const a = 10;
;; this comment begining is itself commented -> {-

  End of the comment
-}
```

`const a = 10;` находится внутри многострочного комментария и закомментирован. <Feedback />

