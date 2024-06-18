# FunC migration guide

### From v0.4.x to v0.5.0

1. Download a new version of the compiler. If you use blueprint or func-js directly, just update a package to the latest version.
2. Download new [stdlib.fc](https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/stdlib.fc) and replace your current (in the future, stdlib will be available out of the box, you won't need to download and store it in your project).
3. Update your IDE plugin (available for JetBrains and VS Code).
4. Choose "FunC language level" to "v0.5.x" in plugin settings.
5. Prefer to use `// traditional` `/* comments */` instead of old Lisp-style. IDE will suggest you to replace existing comments.
6. Don't use `impure`, since all functions are impure by default. IDE will suggest you to remove existing specifiers.
7. Don't use `method_id`, use `get` keyword on the left: `get int seqno() { ... }`. IDE will suggest you to replace existing specifiers.
