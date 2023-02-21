import { Request, Response } from "express";
import cldInstance from "../config/cloudinary";
import { supabase } from "../config/supabase";

interface FilesId {
  id: number;
  cldfileId: string;
}

export const ticketPostController = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const files = req.files;
    const { description, priority, status, assignation, date_limit } = req.body;
    const filesId: FilesId[] = [];
    for (const file of files as Express.Multer.File[]) {
      const result = await cldInstance.uploader.upload(file.path);
      const { data, error } = await supabase
        .from("Files")
        .insert({
          url: result.secure_url,
          userId: id,
        })
        .select("id");
      if (Array.isArray(data) && data.length > 0) {
        filesId.push({ id: data[0]?.id, cldfileId: result.public_id });
      }
      if (error) {
        for (const newfile of filesId) {
          await cldInstance.uploader.destroy(newfile.cldfileId);
          await supabase
            .from("Files")
            .delete()
            .eq("id", newfile.id);
        }
        return res.status(400).json(error);
      }
    }

    const { data: Tickets, error: TicketsError } = await supabase
      .from("Tickets")
      .insert({
        description,
        date_limit,
        status,
        priority,
        assignation,
        userId: id,
      })
      .select("id");

    if (Array.isArray(Tickets) && Tickets.length < 1)
      return res.status(400).json({ message: "failed to save the ticket." });

    if (Array.isArray(Tickets) && Tickets.length > 0) {
      for (let i = 0; i < filesId.length; i++) {
        const { error } = await supabase.from("File-ticket").insert({
          ticketId: Tickets[0]?.id,
          fileId: filesId[i]?.id,
        });
        if (error) {
          for (const newfile of filesId) {
            await cldInstance.uploader.destroy(newfile.cldfileId);
            await supabase
              .from("Files")
              .delete()
              .eq("id", newfile.id);
            await supabase
              .from("File-ticket")
              .delete()
              .eq("fileId", newfile.id);
          }
          return res.status(400).json(error);
        }
      }
    }
    return TicketsError
      ? res.status(400).json(TicketsError)
      : res.status(200).json({ ticketId: Tickets[0]?.id });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const replyPostController = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const files = req.files;
    const { content, ticketId } = req.body;
    const filesId: FilesId[] = [];
    for (const file of files as Express.Multer.File[]) {
      const result = await cldInstance.uploader.upload(file.path);
      const { data, error } = await supabase
        .from("Files")
        .insert({
          url: result.secure_url,
          userId: id,
        })
        .select("id");
      if (Array.isArray(data) && data.length > 0) {
        filesId.push({ id: data[0]?.id, cldfileId: result.public_id });
      }
      if (error) {
        for (const newfile of filesId) {
          await cldInstance.uploader.destroy(newfile.cldfileId);
          await supabase
            .from("Files")
            .delete()
            .eq("id", newfile.id);
        }
        return res.status(400).json(error);
      }
    }

    const { data: Replies, error: RepliesError } = await supabase
      .from("Replies")
      .insert({
        content,
        ticketId,
        replier: id,
      })
      .select("id");

    if (Array.isArray(Replies) && Replies.length < 1)
      return res.status(400).json({ message: "failed to save the ticket." });

    if (Array.isArray(Replies) && Replies.length > 0) {
      for (let i = 0; i < filesId.length; i++) {
        const { error } = await supabase.from("File-reply").insert({
          replyId: Replies[0]?.id,
          fileId: filesId[i]?.id,
        });
        if (error) {
          for (const newfile of filesId) {
            await cldInstance.uploader.destroy(newfile.cldfileId);
            await supabase
              .from("Files")
              .delete()
              .eq("id", newfile.id);
            await supabase
              .from("File-ticket")
              .delete()
              .eq("fileId", newfile.id);
          }
          return res.status(400).json(error);
        }
      }
    }
    return RepliesError
      ? res.status(403).json(RepliesError)
      : res.status(200).json({ replyId: Replies[0]?.id });
  } catch (error) {
    return res.status(500).json(error);
  }
};
