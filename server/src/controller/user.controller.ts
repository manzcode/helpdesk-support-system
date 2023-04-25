import { Request, Response } from 'express';
import cldInstance from '../config/cloudinary';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
interface FilesId {
    id: string;
    cldfileId: string;
}

export const ticketPostController = async (req: Request, res: Response) => {
    const { id } = req.query;
    const files = req.files;
    const { subject, description, priority, status, assignation, date_limit } = req.body;
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
        const fileUploadPromises = (files as Express.Multer.File[]).map(async (file) => {
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
        });
        await Promise.all(fileUploadPromises);

        const newTicket = await prisma.ticket.findUnique({
            where: {
                id: prismaQueryTicket?.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        role: true,
                        username: true,
                    },
                },
                _count: {
                    select: {
                        files: true,
                        replies: true,
                    },
                },
            },
        });

        return res.status(201).json(newTicket);
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
        return res.status(500).json({ message: 'Server Error' });
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
        });

        // Upload files to Cloudinary and insert file data into Supabase in parallel using Promise.all
        const fileUploadPromises = (files as Express.Multer.File[]).map(async (file) => {
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
        });
        await Promise.all(fileUploadPromises);
        const newReply = await prisma.replies.findUnique({
            where: {
                id: prismaQueryReplies.id,
            },
            include: {
                _count: {
                    select: {
                        files: true,
                    },
                },
                assignation: {
                    select: {
                        id: true,
                        role: true,
                        username: true,
                    },
                },
            },
        });
        return res.status(201).json(newReply);
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
        return res.status(500).json({ message: 'Server Error' });
    }
};

export const getAllTicketController = async (req: Request, res: Response) => {
    try {
        const tickets = await prisma.ticket.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        role: true,
                    },
                },
                _count: {
                    select: {
                        files: true,
                        replies: true,
                    },
                },
            },
            take: 10,
        });
        return res.status(200).json(tickets);
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' });
    }
};

export const getAnUserTicketController = async (req: Request, res: Response) => {
    const { id } = req.query;
    try {
        const tickets = await prisma.ticket.findMany({
            where: { userId: id as string },
            include: {
                _count: {
                    select: {
                        files: true,
                        replies: true,
                    },
                },
            },
            orderBy: { created_at: 'desc' },
            take: 10,
        });
        return res.status(200).json(tickets);
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' });
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
                status: 'closed',
            },
            select: {
                id: true,
            },
        });
        return res.status(200).json({ message: 'Ticket closed' });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' });
    }
};

export const viewReplyTicket = async (req: Request, res: Response) => {
    try {
        const { ticketid } = req.query;

        const ticketReply = await prisma.replies.findMany({
            where: { ticketId: ticketid as string },
            include: {
                _count: {
                    select: {
                        files: true,
                    },
                },
                assignation: true,
            },
            orderBy: { createdAt: 'asc' },
            take: 10,
        });
        return res.status(200).json(ticketReply);
    } catch (error) {
        return res.status(500).json({ message: 'Server Error' });
    }
};

export const getFiles = async (req: Request, res: Response) => {
    const { ticketid, replyid } = req.query;
    try {
        const ticketFiles = await prisma.ticket.findMany({
            where: {
                id: ticketid as string,
            },
            select: {
                id: true,
                files: {
                    select: {
                        id: true,
                        url: true,
                    },
                },
            },
        });
        const replyFiles = await prisma.replies.findMany({
            where: {
                id: replyid as string,
            },
            select: {
                id: true,
                files: {
                    select: {
                        id: true,
                        url: true,
                    },
                },
            },
        });

        if (ticketid !== undefined) {
            return res.status(200).json(ticketFiles);
        }
        return res.status(200).json(replyFiles);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};
