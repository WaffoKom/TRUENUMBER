import swaggerJsDoc from "swagger-jsdoc";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         role:
 *           type: string
 *           enum: [client, admin]
 *         balance:
 *           type: number
 *       example:
 *         _id: "60dbf4d8fdfd8e35b8f8df1d"
 *         username: daniel
 *         email: daniele@gmail.com
 *         phone: "454582"
 *         role: client
 *         balance: 0
 *
 *     GameHistory:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *           description: ID de l'utilisateur (référence vers User)
 *         gameId:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         generatedNumber:
 *           type: number
 *         result:
 *           type: string
 *           enum: [gagné, perdu]
 *         balanceChange:
 *           type: number
 *         newBalance:
 *           type: number
 *       example:
 *         _id: "60dbf4d8fdfd8e35b8f8df1e"
 *         userId: "60dbf4d8fdfd8e35b8f8df1d"
 *         gameId: "game_123"
 *         date: "2025-07-17T12:00:00.000Z"
 *         generatedNumber: 72
 *         result: gagné
 *         balanceChange: 100
 *         newBalance: 200
 */

const swaggerSpec = swaggerJsDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TRUENUMBER API",
      version: "1.0.0",
      description: "FIND A GOOD NUMBER TO WIN A GAME",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
  },
  apis: ["src/routes/**/*.ts", "src/models/**/*.ts", "src/swagger.ts"],
});

export default swaggerSpec;
