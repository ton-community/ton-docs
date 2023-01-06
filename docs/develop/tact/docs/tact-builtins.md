# Built-ins

### Throwing exception

Exceptions can be thrown by conditional primitives `nativeThrowWhen`, and `nativeThrowUnless`, and by unconditional `throw`. The first argument is the error code; the second is the condition (`throw` has only one argument).
#### throw
```java
throw(code: Int)
```
Throw exception with error code equal `code`.

#### nativeThrowWhen
```java
nativeThrowWhen(code: Int, condition: Bool)
```
Throw exception with error code equal `code` when `condition` equal True.

#### nativeThrowUnless
```java
nativeThrowUnless(code: Int, condition: Bool)
```
Throw exception with error code equal `code` when `condition` equal False.
