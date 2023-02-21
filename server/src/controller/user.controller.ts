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
      : res.status(201).json({ ticketId: Tickets[0]?.id });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
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
      : res.status(201).json({ replyId: Replies[0]?.id });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getAllTicketController = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("Tickets")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    return error ? res.status(400).json(error) : res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getAnUserTicketController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.query;
    const { data, error } = await supabase
      .from("Tickets")
      .select("*")
      .eq("userId", id)
      .order("created_at", { ascending: false })
      .limit(10);

    return error ? res.status(400).json(error) : res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const viewATicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const { data: TicketFiles, error: TicketFilesError } = await supabase
      .from("File-ticket")
      .select("fileId, Files(url)")
      .eq("ticketId", id);

    const { data: TicketReply, error: TicketReplyError } = await supabase
      .from("Replies")
      .select("*")
      .eq("ticketId", id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (TicketFilesError) return res.status(400).json(TicketReplyError);

    let replyfiles = [];

    if (Array.isArray(TicketReply) && TicketReply.length > 0) {
      const { data, error } = await supabase
        .from("File-reply")
        .select("fileId, Files(url)")
        .eq("replyId", TicketReply[0]?.id);
      if (error) return res.status(400).json(error);

      replyfiles.push(...data);
    }
    return TicketFilesError
      ? res.status(400).json(TicketFilesError)
      : res
          .status(200)
          .json({ TicketFiles, replies: { TicketReply, replyfiles } });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
