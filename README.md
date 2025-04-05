<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repoistorio
2. Ejecutar:

```
npm install
```

3. Tener Nest Cli instalado

```
npm i -g @nestjs/cli
```

4. Levantar la base de datos

```
docker-compose up -d
```

5. Clonar el archivo `.env.template` de la raíz del proyecto y renombrarlo como `.env` en la misma raíz.

6. Rellenar las variables de entorno del `.env` que acabamos de crear.

7. Ejecutar la aplicacion en modo desarrollo
```
npm run start:dev
```

8. Ejecutar el endpoint seed para rellenar la base de datos. Reemplazar el puerto 3000 por el que hayas configurado en `.env`.

```
http://localhost:3000/api/v2/seed
```

## Stack utilizado

- NestJS
- MongoDB
