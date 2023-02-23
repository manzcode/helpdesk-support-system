import jwt from "jsonwebtoken";

const secret = process.env.JWT as jwt.Secret;
export function createToken(user: { id: string }) {
  const payload = {
    id: user.id,
    loggedIn: "success",
  };
  return jwt.sign(payload, secret);
}
