# About
Tiny search module based on `trie` and `aho-corasick` using TypeScript

# Installation
```shell
npm install tynisearch
```

# Example
## Insert keywords and search them in a sentence
```typescript
import { TyniSearch } from 'tynisearch';

const tyniSearch = new TyniSearch();

const wordList = ["fox", "dog"]
const titleToSearch = "The quick brown fox jumps over the lazy dog";

wordList.forEach(word => tyniSearch.insert(word));

tyniSearch.buildFailureLinks();

const result = tyniSearch.searchInSentence(titleToSearch); 
console.log(result); // ["fox", "dog"]
```

## Serialization and De-serialization
### Serialization
```typescript
const tyniSearch = new TyniSearch();

const wordList = ["fox", "dog"]
const titleToSearch = "The quick brown fox jumps over the lazy dog";

wordList.forEach(word => tyniSearch.insert(word));

tyniSearch.buildFailureLinks();

const result = tyniSearch.searchInSentence(titleToSearch);
console.log(result); // ["fox", "dog"]

// Basic way, make an object (Record<string, any>) recursively 
// except each trie nodes's failure links
const readyForBeParsedInJSON = tyniSearch.toJSON();
const stringified = JSON.stringify(readyForBeParsedInJSON);

// Iterative way, make object iteratively
const readyForBeParsedInJSONIteratively = tyniSearch.toJSONIteratively();
const stringifiedIteratively = JSON.stringify(readyForBeParsedInJSONIteratively);

// Recursive way, run recursive function with trampoline
const readyForBeParsedInJSONRecursively = tyniSearch.toJSONIteratively();
const stringifiedRecursively = JSON.stringify(readyForBeParsedInJSONRecursively);
```

### De-serialization
```typescript
// Getting one of the serialized results...
const tyniSearchFromSerialized = TyniSearch.fromJSON(readyForBeParsedInJSON);

// Also implemented the de-serialization 
// with iteration and recursion with trampoline
const tyniSearchFromSerializedIteratively = TyniSearch.fromJSONIteratively(readyForBeParsedInJSON);
const tyniSearchFromSerializedRecursively = TyniSearch.fromJSONRecursively(readyForBeParsedInJSON);

// Then, you can search with the de-serialized trie
// after building failure links again
tyniSearchFromSerialized.buildFailureLinks();

const titleToSearch = "The quick brown fox jumps over the lazy dog";

const result = tyniSearchFromSerialized.searchInSentence(titleToSearch);
console.log(result); // ["fox", "dog"]
```

---

# Points should be enhanced
## Can not save failure links in serialization and de-serialization
Because of the circular reference problem, I can not save failure links in serialization and de-serialization. And I think there must be a better way to solve this problem.

You should build failure links using `.buildFailureLinks()` again after de-serialization.

**Or, you can contribute to this project to solve this problem (I really want it!)**

## Calculate failure graph
I think it is also better way to calculate failure graph when building failure links. 

Currently, building failure graph is required after every insertion. In other words, you should call `.buildFailureLinks()` before run `searchInSentence(sentence: string)` method after any new words are inserted into.

**Or, you can contribute to this project to solve this problem (I really want it!)(2)**

---

# Contacts
## Email
- pravda.kracota@gmail.com
## github
- https://github.com/prravda
## LinkedIn
- https://www.linkedin.com/in/pravdakracota/