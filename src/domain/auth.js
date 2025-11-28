import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const SECRET = "secreta-super-segura";

const USER = {
  username: "admin",
  passwordHash: bcrypt.hashSync("admin123", 10)
};

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Endpoints de autenticação
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autentica o usuário e retorna um token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "admin"
 *               password:
 *                 type: string
 *                 example: "admin123"
 *     responses:
 *       200:
 *         description: Token gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciais inválidas
 */
export function login(req, res) {
  const { username, password } = req.body;

  if (username !== USER.username) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  if (!bcrypt.compareSync(password, USER.passwordHash)) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });

  return res.json({ token });
}

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "Token ausente" });
  }

  const [, token] = header.split(" ");

  try {
    jwt.verify(token, SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}
