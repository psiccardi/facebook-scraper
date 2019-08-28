FROM ubuntu:16.04

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

ENV NVM_DIR /usr/local/nvm
RUN mkdir -p ${NVM_DIR}
ENV NODE_VERSION 10.15.3

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -yq wget \
    && wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash \
    && apt-get install -y aptitude libfontconfig \
    && aptitude install bzip2 \
	&& apt-get -y install gconf-service\
	&& apt-get -y install libasound2\
	&& apt-get -y install libatk1.0-0\
	&& apt-get -y install libatk-bridge2.0-0\
	&& apt-get -y install libc6\
	&& apt-get -y install libcairo2\
	&& apt-get -y install libcups2\
	&& apt-get -y install libdbus-1-3\
	&& apt-get -y install libexpat1\
	&& apt-get -y install libfontconfig1\
	&& apt-get -y install libgcc1\
	&& apt-get -y install libgconf-2-4\
	&& apt-get -y install libgdk-pixbuf2.0-0\
	&& apt-get -y install libglib2.0-0\
	&& apt-get -y install libgtk-3-0\
	&& apt-get -y install libnspr4\
	&& apt-get -y install libpango-1.0-0\
	&& apt-get -y install libpangocairo-1.0-0\
	&& apt-get -y install libstdc++6\
	&& apt-get -y install libx11-6\
	&& apt-get -y install libx11-xcb1\
	&& apt-get -y install libxcb1\
	&& apt-get -y install libxcomposite1\
	&& apt-get -y install libxcursor1\
	&& apt-get -y install libxdamage1\
	&& apt-get -y install libxext6\
	&& apt-get -y install libxfixes3\
	&& apt-get -y install libxi6\
	&& apt-get -y install libxrandr2\
	&& apt-get -y install libxrender1\
	&& apt-get -y install libxss1\
	&& apt-get -y install libxtst6\
	&& apt-get -y install ca-certificates\
	&& apt-get -y install fonts-liberation\
	&& apt-get -y install libappindicator1\
	&& apt-get -y install libnss3\
	&& apt-get -y install lsb-release\
	&& apt-get -y install xdg-utils

RUN chmod a+x $NVM_DIR/nvm.sh

RUN bash -c 'source $NVM_DIR/nvm.sh \
    && source /root/.bashrc \
    && nvm install v$NODE_VERSION \
    && nvm use v$NODE_VERSION'

ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN DEBIAN_FRONTEND=noninteractive apt-get install -yq vim

ADD package.json /app/

WORKDIR /app

RUN npm install -g yarn
RUN npm i puppeteer
RUN npm install pending-xhr-puppeteer

RUN npm install


EXPOSE 4000

CMD ["yarn", "start"]

 