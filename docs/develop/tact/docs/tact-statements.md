# Statements

## Variable declaration

Declaring variable always requires initial value and an explicit type:

```java
let value: Int = 123;
```

## Static function call

Anywhere in the function body a static functions can be called:

```java
let expiration: Int = now() + 1000; // now() is stdlib static function
```

## Extension function call

Some functions are defined only for specific types, they can be called this way:

```java
let some: String = 95.toString(); // toString() is a stdlib function that is defined on Int type
```

## Operators

TACT supports operations:

* `!!` suffix operator - enforce non-null value, defined only for nullable types.
* `!` - logical inversion, defined only for `Bool` type.
* `/`, `*`, `%` - division and multiplication operations, defined only for `Int` type
* `-`, `+` - arithmetic operations, defined only for `Int` type
* !=, == - equality operations
* _>_, _<_, _>=_, _<=_ - compare operations, defined only for `Int` type
* `&&`, `||` - logical `AND` and `OR`

## Loops

Repeat loop:

> **Note**
> Repeat number must be 32 bit int or out of range exception is thrown. Negative values are ignored.

```java
let a: Int = 1;
repeat(10) {
  a = a * a;
}
```

While loop:

```java
let x: Int = 10;
while(x > 0) {
  x = x - 1;
}
```

Until loop:

```java
let x: Int = 10;
do {
  x = x - 1;
} until (x > 0);
```

## If Statements

> **Warn**
> Curly brackets are required

```java
if (condition) {
  doSomething();
}
```

```java
if (condition) {
  doSomething();
} else {
  doSomething2();
}
```

```java
if (condition) {
  doSomething();
} else if (condition2) {
  doSomething2();
} else {
  doSomething3();
}
```

## initOf

Allows to compute init state for a contract:

```java
let state: StateInit = initOf Contract(123, 123);
```