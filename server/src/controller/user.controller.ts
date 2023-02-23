import { Request, Response } from "express";
import cldInstance from "../config/cloudinary";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
interface FilesId {
  id: string;
  cldfileId: string;
}

export const ticketPostController = async (req: Request, res: Response) => {
  const { id } = req.query;
  const files = req.files;
  const {
    subject,
    description,
    priority,
    status,
    assignation,
    date_limit,
  } = req.body;
  const filesId: FilesId[] = [];
  try {
    // Insert ticket data into Supabase
    const prismaQueryTicket = await prisma.ticket.create({
      data: {
        subject,
        description,
        date_limit,
        status,
        priority,
        assigned: assignation,
        userId: id as string,
      },
      select: {
        id: true,
      },
    });
    // Upload files to Cloudinary and insert file data into Supabase in parallel using Promise.all
    const fileUploadPromises = (files as Express.Multer.File[]).map(
      async (file) => {
        const result = await cldInstance.uploader.upload(file.path);
        const prismaQueryFile = await prisma.files.create({
          data: {
            url: result.secure_url,
            userId: id as string,
            tickets: { connect: { id: prismaQueryTicket?.id } },
          },
          select: {
            id: true,
          },
        });
        filesId.push({
          id: prismaQueryFile?.id,
          cldfileId: result.public_id,
        });
      }
    );
    await Promise.all(fileUploadPromises);

    return res.status(201).json({ ticketId: prismaQueryTicket?.id });
  } catch (error) {
    // Delete uploaded files and their corresponding data in Supabase if an error occurs
    const fileDeletePromises = filesId.map(async (file) => {
      await cldInstance.uploader.destroy(file.cldfileId);
      await prisma.files.delete({
        where: {
          id: file?.id,
        },
      });
    });
    await Promise.all(fileDeletePromises);
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const replyPostController = async (req: Request, res: Response) => {
  const { id } = req.query;
  const files = req.files;
  const { content, ticketId } = req.body;
  const filesId: FilesId[] = [];
  try {
    // Insert reply data into Supabase
    const prismaQueryReplies = await prisma.replies.create({
      data: {
        content,
        assigned: id as string,
        ticketId: ticketId,
      },
      include: {
        files: true,
        assignation: true,
      },
    });

    // Upload files to Cloudinary and insert file data into Supabase in parallel using Promise.all
    const fileUploadPromises = (files as Express.Multer.File[]).map(
      async (file) => {
        const result = await cldInstance.uploader.upload(file.path);
        const prismaQueryFile = await prisma.files.create({
          data: {
            url: result.secure_url,
            userId: id as string,
            replies: { connect: { id: prismaQueryReplies.id } },
          },
          select: {
            id: true,
          },
        });
        filesId.push({
          id: prismaQueryFile?.id,
          cldfileId: result.public_id,
        });
      }
    );
    await Promise.all(fileUploadPromises);
    return res.status(201).json(prismaQueryReplies);
  } catch (error) {
    // Delete uploaded files and their corresponding data in Supabase if an error occurs
    const fileDeletePromises = filesId.map(async (file) => {
      await cldInstance.uploader.destroy(file.cldfileId);
      await prisma.files.delete({
        where: {
          id: file?.id,
        },
      });
    });
    await Promise.all(fileDeletePromises);
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getAllTicketController = async (req: Request, res: Response) => {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { created_at: "desc" },
      include: {
        user: true,
      },
      take: 10,
    });
    return res.status(200).json(tickets);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getAnUserTicketController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.query;
  try {
    const tickets = await prisma.ticket.findMany({
      where: { userId: id as string },
      orderBy: { created_at: "desc" },
      take: 10,
    });
    return res.status(200).json(tickets);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const closeticket = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    await prisma.ticket.update({
      where: {
        id: id as string,
      },
      data: {
        status: "closed",
      },
      select: {
        id: true,
      },
    });
    return res.status(200).json({ message: "Ticket closed" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const viewATicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    const ticketFiles = await prisma.ticket.findUnique({
      where: { id: id as string },
      include: {
        files: true,
        user: true,
      },
    });

    const ticketReply = await prisma.replies.findMany({
      where: { ticketId: id as string },
      include: {
        files: true,
        assignation: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return res.status(200).json({
      ticketFiles,
      ticketReply,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
