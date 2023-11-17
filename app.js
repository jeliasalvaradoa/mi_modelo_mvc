import fs from "fs";
import { filesApp } from "./file.js";
const fileArray = filesApp
const dirApp = [
  "./app/config/",
  "./app/controllers/",
  "./app/db/models",
  "./app/db/seeders",
  "./app/libs",
  "./app/middlewares/",
  "./app/mysql_data/",
  "./app/postgres_data/",
  "./app/public/",
  "./app/routes/",
  "./app/schemas/",
  "./app/services-models/sequelize",
  "./app/services-models/postgres/",
  "./app/services-models/mysql",
  "./app/utils/auth/strategies/",
];

async function createDir() {
  if (fs.existsSync("app")) {
    console.log("El directorio ya ha sido creado");
  } else {
    dirApp.map((dirsApp) => fs.mkdirSync(dirsApp, { recursive: true }));
  }
}
createDir().then(() => {
    fileArray.map(([archivo, contenido]) => {
        fs.writeFileSync(archivo, contenido)
      });
}).catch((err) => {
    console.log(err)
}) 



