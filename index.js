import express from "express";
import mongoose from "mongoose";
import { registerValidation, loginValidation } from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import { UserController, PostController, CommentController } from "./controllers/index.js";
import cors from "cors";
import { postCreateValidation } from "./validations/post.js";
import multer from "multer";

mongoose
  .connect("")
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post("/auth/register", registerValidation, UserController.register);
app.post("/auth/login", loginValidation, UserController.login);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post("/post", checkAuth, postCreateValidation, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, postCreateValidation, PostController.update);
app.get("/tags", PostController.getTags);
app.post("/posts/tags", PostController.getFilterPostsbyTags);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post("/comments", checkAuth, CommentController.create);
app.get("/comments/:id", CommentController.getAllById);
app.get("/comments/", CommentController.getAll);
app.delete("/comments/:id", checkAuth, CommentController.deleteComment);

//Для тестового задания (нужна модель комментариев, забрал для другого проекта)
// app.get("/cards", async (req, res) => {
//   try {
//     const cards = await CardModel.find();
//     res.json(cards);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: "Не удалось получить карточки товаров",
//     });
//   }
// });

// app.get("/cards/:id", async (req, res) => {
//   try {
//     const cardId = req.params.id;

//     await CardModel.findOneAndUpdate(
//       {
//         _id: cardId,
//       },
//       {
//         $inc: { viewsCount: 1 },
//       },
//       {
//         returnDocument: "after",
//       },
//     )

//       .then((doc) => {
//         if (!doc) {
//           return res.status(404).json({
//             message: "Не удалось найти статью",
//           });
//         }
//         res.json(doc);
//       })
//       .catch((err) => {
//         console.log(err);
//         return res.status(500).json({
//           message: "Не удалось вернуть статью",
//         });
//       });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: "Не удалось получить запрошенную статью",
//     });
//   }
// });

// app.post("/cards/", async (req, res) => {
//   try {
//     const doc = new CardModel({
//       title: req.body.title,
//       imageUrl: req.body.imageUrl,
//     });
//     const post = await doc.save();
//     res.status(200).json(post);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: "Не удалось создать статью",
//     });
//   }
// });

// app.post("/comment", checkAuth, async (req, res) => {
//   try {
//     const doc = new CommentModel({
//       text: req.body.text,
//       imageId: req.body.imageId,
//       userId: req.userId,
//     });
//     const post = await doc.save();
//     res.status(200).json(post);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: "Не удалось создать статью",
//     });
//   }
// });

// app.get("/comment/:id", async (req, res) => {
//   try {
//     const imageId = req.params.id;
//     const comments = await CommentModel.find({ imageId }).populate("userId").exec();
//     res.json(comments);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({
//       message: "Не удалось вернуть комментарии",
//     });
//   }
// });

// app.delete("/comment/:id", checkAuth, async (req, res) => {
//   try {
//     const commentId = req.params.id;
//     await CommentModel.findOneAndDelete({
//       _id: commentId,
//     })
//       .then((doc) => {
//         if (!doc) {
//           return res.status(404).json({
//             message: "Не удалось найти статью",
//           });
//         }
//         res.json({ success: true });
//       })
//       .catch((err) => {
//         console.log(err);
//         return res.status(500).json({
//           message: "Не удалось удалить статью",
//         });
//       });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: "Не удалось удалить статью",
//     });
//   }
// });

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK!");
});
