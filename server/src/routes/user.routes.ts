import { Router } from "express";
import {
  closeticket,
  getAllTicketController,
  getAnUserTicketController,
  replyPostController,
  ticketPostController,
  viewATicket,
} from "../controller/user.controller";
import { middlewareMulter } from "../middleware/multer";

const router: Router = Router();

//close ticket
router.get("/close/ticket", closeticket);
//get all tickets
router.get("/all/tickets", getAllTicketController);

router.get("/a/ticket", getAnUserTicketController);

router.get("/show/ticket", viewATicket);

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
