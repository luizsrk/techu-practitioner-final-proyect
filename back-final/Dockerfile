#Imagen inicial apartir de la cual creamos nuetra imagen
FROM node

#definir directorio del contenedor
WORKDIR /api_peru_jdcc

#Añadimos contenido  del proyecto en el directorio contenedor
ADD . /api_peru_jdcc

#puerto por donde escucha
EXPOSE 3000

#comando para lanzar nuetra API REST 'api_peru'
CMD [ "npm", "start" ]
#CMD [ "npm", "server.js" ]
