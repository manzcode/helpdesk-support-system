import { Router } from "express";
import {
  replyPostController,
  ticketPostController,
} from "../controller/user.controller";
import { middlewareMulter } from "../middleware/multer";

const router: Router = Router();

//post a ticket
router.post(
  "/ticket",
  middlewareMulter([
    ".jpg",
    ".png",
    ".gif",
    ".jpeg",
    ".JPG",
    ".PNG",
    ".GIF",
    ".JPEG",
    ".pdf",
    ".PDF",
  ]).array("files"),
  ticketPostController
);

//post a reply
router.post(
  "/reply",
  middlewareMulter([
    ".jpg",
    ".png",
    ".gif",
    ".jpeg",
    ".JPG",
    ".PNG",
    ".GIF",
    ".JPEG",
    ".pdf",
    ".PDF",
  ]).array("files"),
  replyPostController
);

export default router;
