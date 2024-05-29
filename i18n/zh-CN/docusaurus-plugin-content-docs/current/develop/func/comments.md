# 注释

FunC 有单行注释，以 `;;`（双分号）开始。例如：

```func
int x = 1; ;; assign 1 to x
```

它还有多行注释，以 `{-` 开始并以 `-}` 结束。请注意，与许多其他语言不同的是，FunC 的多行注释可以嵌套。例如：

```func
{- This is a multi-line comment
    {- this is a comment in the comment -}
-}
```

此外，多行注释中可以有单行注释，且单行注释 `;;` 比多行注释 `{- -}`“更强”。换句话说，在以下示例中：

```func
{-
  Start of the comment

;; this comment ending is itself commented -> -}

const a = 10;
;; this comment begining is itself commented -> {-

  End of the comment
-}
```

`const a = 10;` 在多行注释内，因此被注释掉了。
