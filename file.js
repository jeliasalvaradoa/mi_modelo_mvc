export const filesApp = [ ["./app/config/config.js", `import 'dotenv/config'\n

export const config = {\n
  env: process.env.NODE_ENV || 'dev',\n
  isProd: process.env.NODE_ENV === 'production',\n
  port: process.env.PORT || 3000,\n
  dbUser:  process.env.DB_USER,\n
  dbPassword:  process.env.DB_PASSWORD,\n
  dbHost:  process.env.DB_HOST,\n
  dbName:  process.env.DB_NAME,\n
  dbPort:  process.env.DB_PORT,\n
  dbUrl: process.env.DATABASE_URL,\n
  apiKey: process.env.API_KEY,\n
  jwtSecret: process.env.JWT_SECRET,\n
  smtpEmail: process.env.SMTP_EMAIL,\n
  smtpPassword: process.env.SMTP_PASSWORD,\n
}`],
["./app/schemas/auth.schema.js", `import joi from 'joi';`],
["./app/schemas/models1.schema.js", `import joi from 'joi';`],
["./app/middlewares/auth.handler.js", `import boom from '@hapi/boom';\n
import { config } from './../config/config.js';\n
\n
export function checkApiKey(req, res, next) {\n
  const apikey = req.headers['api']\n
  if (apikey === config.apiKey) {\n
    next()\n
  } else {\n
    //<----message error boom----->\n
  }\n
}\n
\n
export function checkRoles(...roles) {\n
  return (req, res, next) => {\n
   //<-------code----------> \n
    \n
  }\n
}`],
["./app/middlewares/cors.js", `import cors from 'cors'\n

const ACCEPTED_ORIGINS = [\n
  'http://localhost:8080',\n
  'http://localhost:1234'\n
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({\n
  origin: (origin, callback) => {\n
    if (acceptedOrigins.includes(origin)) {\n
      return callback(null, true)\n
    }\n
    if (!origin) {\n
      return callback(null, true)\n
    }\n
    return callback(new Error('Not allowed by CORS'))\n
  }\n
})`],
["./app/middlewares/error.handler.js", `import { ValidationError } from "sequelize";\n
\n
function logErrors (err, req, res, next){\n
  console.log('logErrors');\n
  console.error(err);\n
  next(err);\n
}\n
function errorHandler(err, req, res, next){\n
  console.log('errorHandler');\n
  res.status(500).json(\n
    {\n
    message:err.message,\n
    stack:err.stack,\n
  }\n
  )\n
}\n
\n
function boomErrorHandler(err,req,res, next){\n
  if(err.isBoom){\n
    const { output } = err;\n
    res.status(output.statusCode).json(output.payload);\n
  }\n
  next(err);\n
}
function ormErrorHandler(err, req, res, next) {\n
  if (err instanceof ValidationError) {\n
    res.status(409).json({\n
      statusCode: 409,\n
      message: err.name,\n
      errors: [ err.errors[0].message, err.errors[0].type]\n
      //errors: err.errors Si quiero ver toda la información\n
    })\n
  }\n
  next(err)\n
}\n

export { logErrors, errorHandler, boomErrorHandler, ormErrorHandler }\n
`],
["./app/middlewares/validator.handler.js", `import  boom from '@hapi/boom';\n

function validatorHandler(schema, property) {\n
  return (req, res, next) => {\n
    const data = req[property];\n
    const { error } = schema.validate(data, { abortEarly: false });\n
    if (error) {\n
      next(boom.badRequest(error));\n
    }\n
    next();\n
  }\n
}\n
\n
export default validatorHandler;\n`],
["./app/libs/postgres.pool.js", `import mypool from 'pg';\n
import { config } from './../config/config.js'\n
\n
const USER = encodeURIComponent(config.dbUser)\n
const PASSWORD = encodeURIComponent(config.dbPassword)\n
const URI = 'postgres://USER:PASSWORD@config.dbHost:config.dbPort/config.dbName'\n //colocar cada variable de entorno como corresponde
const { Pool } = mypool\n
export const pool = new Pool({ connectionString: URI })\n`],
["./app/libs/mysql.pool.js", `import mysql from 'mysql2/promise'\n`],
["./app/libs/sequelize.js", `import  Sequelize from 'sequelize';\n
import { config } from '../config/config.js';\n
import setupModels from '../db/models/index.js';\n
\n
const options = {\n
  dialect: 'postgres',\n
  logging: config.isProd ? false : true,\n
}\n
\n
if (config.isProd) {\n
  options.dialectOptions = {\n
    ssl: {\n
      rejectUnauthorized: false\n
    }\n
  }\n
}\n
\n
export const sequelize = new Sequelize(config.dbUrl, options)\n

setupModels(sequelize)\n`],
["./app/db/models/index.js", `import Models1, { Models1Schema } from './models1.model.js';\n
\n
export default function setupModels(sequelize) {\n
\n
  Models1.init(Models1Schema, Models1.config(sequelize))\n
\n
  Models1.associate(sequelize.models);\n
\n
}\n`],
["./app/db/models/models1.model.js", `import { Model, DataTypes, Sequelize } from 'sequelize';\n
\n
export const MODELS1_TABLE = 'models1';\n
 export const Models1Schema = {\n
\n
  id: {\n
    allowNull: false,\n
    type: DataTypes.UUID,\n
    defaultValue: DataTypes.UUIDV1,\n
    primaryKey: true,\n
  },\n
  email: {\n
    allowNull: false,\n
    type: DataTypes.STRING,\n
    unique: true,\n
  },\n
  password: {\n
    allowNull: false,\n
    type: DataTypes.STRING,\n
  },\n
  recoveryToken: {\n
    field: 'recovery_token',\n
    allowNull: true,\n
    type: DataTypes.STRING,\n
  },\n
  role: {\n
    allowNull: false,\n
    type: DataTypes.STRING,\n
    defaultValue: 'customer'\n
  },\n
  createdAt: {\n
    allowNull: false,\n
    type: DataTypes.DATE,\n
    field: 'create_at',\n
    defaultValue: Sequelize.NOW,\n
  },\n
}\n
\n
class Models1 extends Model {\n
 static associate(models) {\n
 }\n
\n
 static config(sequelize) {\n
  return {\n
    sequelize,\n
    tableName: MODELS1_TABLE,\n
    modelName: 'Models1',\n
    timestamps: false\n
  }\n
 }\n
\n
}\n
export default User\n`],
["./app/controllers/auth.controllers.js", `export class AuthController {\n
  constructor({authModel}) {\n
  this.authModel = authModel\n
  }\n
}\n`],
["./app/controllers/models1.controllers.js", `export class Models1Controller {\n
  constructor({ models1Model }) {\n
    this.models1Model = models1Model;\n
  }\n
}\n`],
["./app/routes/auth.router.js", `import { Router } from 'express';\n
import passport from 'passport';\n
import { AuthController } from '../controllers/auth.controllers.js';\n
import validatorHandler from '../middlewares/validator.handler.js';\n
import {\n
  AuthSchema1,\n
  AuthSchema2,\n
  AuthSchema3,\n
} from '../schemas/auth.schema.js';\n
\n
export const createAuthRouter = ({ authModel }) => {\n
  const authRouter = Router();\n
\n
  const authController = new AuthController({ authModel });\n
\n
  return authRouter;\n
}\n`],
["./app/routes/models1.router.js", `import { Router } from 'express';\n
import passport from 'passport';\n
import { Models1Controller } from '../controllers/models1.controllers.js';\n
import validatorHandler from '../middlewares/validator.handler.js';\n
import { checkRoles } from '../middlewares/auth.handler.js';\n
import {\n
  models1Schema1,\n
  models1Schema2,\n
  models1Schema3,\n
} from '../schemas/models1.schema.js';\n
\n
export const createModels1Router = ({ models1Model }) =>{\n
\n
  const models1Router = Router()\n
\n
  const models1Controller = new Models1Controller({ models1Model })\n
\n
  return models1Router\n
}\n`],
["./app/routes/index.js", `import { Router } from 'express';\n
import { createModels1Router } from './models1.router.js';\n
import { createAuthRouter } from './auth.router.js';\n
\n
export default function routerApi(app, services) {\n
\n
  const {\n
     models1Model,\n
     authModel\n
  } = services\n

  const router = Router();\n
  app.use('/', router);\n
  router.use('/models1', createModels1Router({ models1Model }));\n
  router.use('/auth', createAuthRouter({ authModel }));\n
\n
}\n`],
["./app/services-models/sequelize/auth.service.js", `import boom from '@hapi/boom';\n
import { config } from '../../config/config.js';\n
import jwt from 'jsonwebtoken';\n

export class AuthModel {\n
  constructor() {}\n
}\n`],
["./app/services-models/sequelize/models1.service.js", `import boom from '@hapi/boom';\n
import { sequelize } from '../../libs/sequelize.js';\n
\n
const models = sequelize.models;\n
\n
export class UserModel {\n
  constructor() {}\n
}\n`],
["./app/services-models/sequelize/services.js", `import { Models1Model } from './models1.service.js';\n
import { AuthModel } from './auth.service.js';\n
\n
export const services = {\n
  models1Model: Models1Model,\n
  authModel: AuthModel,\n
}\n`],
["./app/services-models/postgres/auth.service.js", ``],
["./app/services-models/postgres/models1.service.js",``],
["./app/services-models/postgres/services.js", ``],
["./app/services-models/mysql/auth.service.js", ``],
["./app/services-models/mysql/models1.service.js", ``],
["./app/services-models/mysql/services.js", `//`],
["./app/public/index.html", `//`],
["./app/utils/auth/index.js", `import passport from 'passport';\n
 import { LocalStrategy } from './strategies/local.strategy.js';\n
 import { JwtStrategy } from './strategies/jwt.strategy.js';\n
\n
 passport.use(LocalStrategy)\n
 passport.use(JwtStrategy)\n`],
["./app/utils/auth/strategies/jwt.strategy.js", `import { Strategy, ExtractJwt } from 'passport-jwt';\n
import { config } from '../../../config/config.js';\n
\n
const options = {\n
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),\n
  secretOrKey: config.jwtSecret\n
}\n
export const JwtStrategy = new Strategy(options, (payload, done) => {\n
  return done(null, payload);\n
})\n`],
["./app/utils/auth/strategies/local.strategy.js", `import { Strategy } from 'passport-local';\n
import { AuthModel } from './../../../services-models/sequelize/auth.service.js';\n
\n
export const LocalStrategy = new Strategy(\n
)\n`],
["./app/server-with-sequelize.js", `import { createApp } from './index.js';\n
import { services } from './services-models/sequelize/services.js';\n
\n
createApp(services);\n`],
["./app/server-with-postgres.js",`//`],
["./app/server-with-mysql.js",`//`],
["./app/.editorconfig", `root: true\n
\n
[*]\n
charset = utf-8\n
indent_style = space\n
indent_size = 2\n
insert_final_newline = true\n
trim_trailing_whitespace = true\n
\n
[*.js]\n
quote_type = single\n
\n
[*.md]\n
max_line_length = off\n
trim_trailing_whitespace = false\n`],
["./app/.env", `//`],
["./app/.env-example", `PORT =\n
  DB_USER = ''\n
  DB_PASSWORD = ''\n
  DB_HOST = ''\n
  DB_NAME = ''\n
  DB_PORT = ''\n
  DATABASE_URL = ''\n
  API_KEY =\n
  JWT_SECRET =\n
  SMTP_EMAIL = ''\n
  SMTP_PASSWORD =\n `],
["./app/.eslintrc.json",`{
  "parserOptions": {\n
    "ecmaVersion": "latest",\n
    "sourceType": "module"\n
  },\n
  "extends": ["eslint:recommended", "prettier"],\n
  "env": {\n
    "es6": true,\n
    "node": true,\n
    "jest": true\n
  },\n
  "rules": {\n
    "no-console": "warn"\n
  }\n
}\n`],
["./app/.gitignore",`//`],
["./app/.sequelizerc", `//`],
["./app/docker-compose.yml", `//`],
["./app/Dockerfile", `//`],
["./app/index.js", `import express, { json } from 'express';\n
import { corsMiddleware } from './middlewares/cors.js';\n
import routerApi from './routes/index.js';\n
import { checkApiKey } from './middlewares/auth.handler.js';\n
import {\n
  logErrors,\n
  errorHandler,\n
  boomErrorHandler,\n
  ormErrorHandler,\n
} from './middlewares/error.handler.js';\n
\n
export const createApp = (services) => {\n
  const app = express();\n
  app.use(json());\n
  app.use(corsMiddleware());\n
  app.disable('x-powered-by');\n
  import('./utils/auth/index.js');\n
\n
app.use(express.static("public"));\n

  app.get('/nueva-ruta', checkApiKey, (req, res) => {\n
    res.send('Hola mi server en express');\n
  });\n
\n
  routerApi(app,services);\n
\n
  app.use(logErrors)\n
  app.use (ormErrorHandler)\n
  app.use(boomErrorHandler)\n
  app.use(errorHandler)\n
\n
  const port = process.env.PORT || 3000;\n
  app.listen(port, () => {\n
    console.log('app listening on port =>', port);\n
  })\n
}\n`],
["./app/README.md", `//`] ]
