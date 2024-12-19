# Code style

Use `typescript` and `eslint` rules provided in this project. Do not turn off any rules until you discuss it with all team members.

If you use vscode, it is recommended to install [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extensions. Also it will be helpful to enable auto-format on save:
```json
// settings.json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.codeActionsOnSave.mode": "problems",
  "eslint.validate": ["javascript", "typescript"]
}
```

### File format
- Use UTF-8 encoding for all text files.
- Space character (0x20) is the only allowed whitespace. Do not use tabs.
- Use `LF` line ending (unix style), do not use `CRLF`.
- Use 2-spaces indentation. Do not use 4-spaces or any other style.
- Always add new line at the end of file.
### Export/import
- Do not use default export. Prefer named export instead.
```typescript
// Bad:
export default class Elephant {}

// Good:
export class Elephant {}
```
- Default import is only allowed for external libraries.
- Prefer absolute import path. Use tsconfig-path if you can:
```typescript
// Bad:
import { Item } from '../../../../item';

// Good:
import { Item } from 'src/common/item';

// Better:
import { Item } from '@common/item';
```

- Use `index.ts` for exported directories:
```
src
└── features
    └── users
        ├── index.ts
        ├── users.module.ts
        └── users.service.ts
```
Where `index.ts` contains
```typescript
export * from './users.module';
export * from './users.service';
```
So you can import these files as follows:
```typescript
import { UsersService, UsersModule } from '@features/users';

```

### Container classes
Do not use container classes with static methods or properties for the sake of namespacing.
```typescript
// Bad
export class Container {
  static FOO = 1;
  static bar() { return 1; }
}

// Good
export const FOO = 1;
export function bar() { return 1; }
```

### Naming conventions

- Always give meaningful names for everything:
```typescript
// Bad:
class MyContainer {}
const j = 0;
function process(value: string): number;

// Good:
class TaskStack {}
const rowIndex = 0;
function countLetters(word: string): number;
```

- Do not use abbreviations unless these are part of domain language:
```typescript
// Bad:
const num = 2;
const nextVal = 3;
function calcFmt();

// Good:
const offset = 2;
const nextValue = 3;
function calculateAndFormat();
```

- Do not use type-specific prefixes:
```typescript
// Bad:
type TUser = {}
enum ERole = {}
interface IModel {}

// Good:
type User = {}
enum Role = {}
interface Model {}
```

- Use `SCREAM_CASE` only for shared constants or environment variables.
- Use `PascalCase` for types, interfaces, enums, classes.
- Use `camelCase` for functions, methods, properties, variables.

For relational database schemas: 
- use `PascalCase` for ORM model types.
- use `camelCase` for ORM model properties.
- use `snake_case` for tables and columns in actual database structure.
- use singular ORM model names and plural table names:
```prisma
// ORM model name
model Order {
  @@map("orders") // SQL table name
}
```

### Classes

- Do not mindlessly create getters and setters for every private field:
```typescript
// Bad:
class User {
  ...
  set name(value: string): void => this._name = value;
  get name(): string => this._name;

  set passwordHash(value: string) => this._passwordHash = value;
  get passwordHash(): string => this._passwordHash;
  ...
}

// Good:
class User {
  update(data: UserUpdate): void;
  updatePassword(oldPassword: string, newPassword: string): void;
  comparePassword(value: string): boolean;
}
```

- Use `readonly` if you don't plan to change property:
```typescript
// Bad:
class Repository {
  private database: Database;
  ...
}

// Good:
class Repository {
  private readonly database: Database;
}
```

- Define parameter properties if injecting them in constructor:
```typescript
class Repository {
  constructor(private readonly database: Database) {}
}
```

- Prefer `private` over `protected`. Use `protected` only if this is truly needed.
- Do not manipulate `prototype`. Use modern syntax.

### Functions

- Do not use `bind`, `call`, `apply`.
- Do not use `this` keyword if you are outside of class context.
- Do not use function expressions as arguments:
```typescript
// Bad:
bar(function() { ... })

// Good:
bar(() => { doSomething(); })
```

- Use `arrow functions` as callbacks.

### Type coercion
- Do not use `as` keyword, unless you are totally sure that there is no other solution. If two types are incompatible, it indicates that there is something wrong with your code.
```typescript
// Bad:
return result as ExpectedType;

// Good:
return result;
```

- Do not use `==`. It may be used only for `null` and `undefined` comparison, since it is the only predictable case of `==`.

### Control structures

- Prefer early-return over if-else statement:
```typescript
// Bad:
if (firstCase) {
  value = Case.First;
} else if (secondCase) {
  value = Case.Second;
}
return value;

// Good:
if (firstCase) {
  return Case.First;
}

return Case.Second;
```

- Use `AssertExhausted` pattern when dealing with enumerable cases:
```typescript
// Bad:
switch (type) {
  case Type.First: return processFirst();
  case Type.Second: return processSecond();
  default: throw new Error(`Unknown value: ${type}`); 
}

// Good:
// The key is `never`: when you forget to process a variant 
// - tsc will report an error during compile time.
function assertExhausted(type: never): never {
  throw new Error(`Unknown value: ${type}`);
}


switch (type) {
  case Type.First: return processFirst();
  case Type.Second: return processSecond();
  default: return assertExhausted(type); 
}
```

- Do not use `switch-case` without return after each case:
```typescript
// Bad:
switch (type) {
  case Type.One: value = 1; break;
  case Type.Two: value = 2; break;
  default: value = 0;
}

// Good:
switch (type) {
  case Type.One: return 1;
  case Type.Two: return 2;
}

return 0;
```

### File naming

- Do not create files with identical names. It makes searching hard:
```shell
# Bad:
features
├── users
|   └── dto
|       ├── create.ts
|       ├── update.ts
|       └── edit.ts
└── services
    └── dto
        ├── create.ts
        ├── update.ts
        └── edit.ts

# Good:
features
├── users
|   └── dto
|       ├── index.ts
|       ├── user-create.ts
|       ├── user-update.ts
|       └── user-edit.ts
└── services
    └── dto
        ├── index.ts
        ├── service-create.ts
        ├── service-update.ts
        └── service-edit.ts
```

- Use `kebab-case` for file names.

### Comments

- **Do not leave commented code in repository.** It makes other developers confused when they are reading your code.

- If the feature you work on is not finished yet, leave a special TODO comment:
```typescript
/** @todo Get actual user from auth service */
private getUser(id: string): Promise<User> {
  throw new Error('Not implemented');
}
```
- If you start writing description because your code needs explanation, stop and think. Perhaps you should rewrite this code, so it will describe itself better.

- Use [jsdoc](https://jsdoc.app/) rules if you need to describe something.
