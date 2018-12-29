use express-example;

db.createCollection("posts");

db.createUser({
    user: "express-example-root",
    pwd: "1234",
    roles: [
        {role: "readWrite", db: "express-example"},
        {role: "dbOwner", db: "express-example"}
    ]
});
