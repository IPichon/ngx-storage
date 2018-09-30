#TODO

### Feature
 - ClearCache decorator 
    - remove all cached result for a given method 
    - remove the cache for one given call ( for instance deleteOne -> getOne ) 
    - remove all cached result for several method ??? ( for instance if some data are linked)
 - Add a life duration for stored data after which they should be removed
 - Store nested result by ref instead of directly

### Test
- tests should be more more generic and reusable
- use some test utils? 
- add test for StoreService

### Optimization
 - Use lz string to optimize localstorage use
 - store last used constructor in app to avoid looking in storage every time
 - store last function call in app to avoid looking in storage every time
 
### Refactor 
 - find better way to create key for localstorage
 - prevent duplicates key for localstorage
 
### Doc
- write more documentation for CacheResult decorator
- update doc for StoreService
- update readme 
 
### Bugs
- RAS
 
