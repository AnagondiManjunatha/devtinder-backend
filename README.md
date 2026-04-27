**What is the difference between `methods` and `statics` in Mongoose?**

Answer:

> `schema.methods` defines instance methods that operate on a specific document and are accessed using the document instance (e.g., `user.comparePassword()`).
>
> `schema.statics` defines model-level methods that operate on the entire collection and are accessed using the model itself (e.g., `User.findByEmail()`).
>

Class method → statics , oneClass
Object method → methods , multiple

### Why `this` works?

`this` refers to  **the user document returned from DB** .
