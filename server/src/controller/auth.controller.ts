import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createToken } from "../helpers/jwt";

const prisma = new PrismaClient();

export const signInController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const checkUser = await prisma.user.findFirst({
      where: {
        email,
        password,
      },
      select: {
        id: true,
      },
    });
    if (!checkUser)
      return res
        .status(404)
        .json({ message: "Verifier l'email ou le mot de passe" });

    const token = createToken(checkUser);

    return res.status(200).json({ message: "successfully log in", token });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const signUpController = async (req: Request, res: Response) => {
  try {
    const { email, password, username, role } = req.body;

    const checkUser = await prisma.user.create({
      data: {
        email,
        password,
        role,
        username,
      },
      select: {
        id: true,
      },
    });

    const token = createToken(checkUser);

    return res.status(200).json({
      message: "successfully registered",
      token,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getAUser = async (req: Request, res: Response) => {
  const { id } = req.query;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id as string,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    });
    if (!user) return res.status(404).json({ message: "No user Found" });
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
