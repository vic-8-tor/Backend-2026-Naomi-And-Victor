const express = require("express");
const app = express();


app.get("/", (req, res) => {
  res.send("Welcome to backend");
});

app.get("/victor", (req, res) => {
  res.send("This is victor's page");
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});




// async function run() {
//   try {
//     // CREATE
//     const newUsers = await User.insertMany([
//       {email: "test@gmail.com", password: "abcdef12", gender: "male"},
//       {email: "vic0@gmail.com", password: "abcdef12", gender: "male"},
//       {email: "ton69@gmail.com", password: "bigTon618", gender: "female"}
//     ]);
//     console.log("Users created:", newUsers);

//     // READ
//     const maleUsers = await User.find({gender: "male"})
//     console.log("Male users:", maleUsers);

//     // UPDATE
//     const updateResult = await User.updateOne(
//       {email: "vic0@gmail.com"},
//       {userName: "dante", password: "12345"}
//     );
//     console.log("Update result:", updateResult);

//     // DELETE
//     const deleteResult = await User.deleteOne({email: "test@gmail.com"});
//     console.log("Delete result:", deleteResult);

//   } catch (err) {
//     console.error("Error:", err.message);
//   }
// }
// run();

// app.get("/users", (req, res) => {
//   res.send({message: "All Users"})
// });