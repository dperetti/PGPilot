FROM chriswessels/meteor-tupperware
ENV MONGO_URL=mongodb://localhost:27017/fakedb
ENV ROOT_URL=http://0.0.0.0/
ENV PORT=80
ENV CONFIGURATION_DIR=/config

# write a pm2.json file to launch simulaneously a mongodb server and the meteor app
COPY pm2.json /app/pm2.json
# overwrite meteor-tupperware entrypoint script with our own
RUN echo "/usr/local/bin/pm2 start /app/pm2.json --no-daemon" > /tupperware/scripts/start_app.sh

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com --recv EA312927
RUN echo "deb http://repo.mongodb.org/apt/debian wheezy/mongodb-org/3.2 main" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list
RUN apt-get update && apt-get install -y mongodb-org-server && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
