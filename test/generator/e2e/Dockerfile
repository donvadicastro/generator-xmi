FROM node:11-alpine

# @see http://label-schema.org/rc1/
LABEL maintainer "vb" \
  # Replacement for the old MAINTAINER directive has fragmented.
  # "vendor" prevents CentOS from leaking through, the other is for tools integrations.
  vendor="vb" \
  org.label-schema.vendor="vb" \
  # CentOS adds a name label but it is misleading in our instance.
  name="Yeoman" \
  org.label-schema.name="Yeoman" \
  org.label-schema.description="An Alpine & Node 6 base Yeoman support image. Add your code and generate!" \
  org.label-schema.docker.debug="docker exec -it $CONTAINER bash" \
  org.label-schema.schema-version="1.0"

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh curl

# For some internal modules Python in needed
RUN apk add --update --no-cache curl py-pip python2 make

RUN echo -n "Node: " && node -v && echo -n "npm: " && npm -v
RUN echo "Yeoman Doctor will warn about our npm version being outdated. It is expected and OK."
RUN npm install --global --silent yo forever generator-xmi@1.0.10

RUN adduser -D -u 501 yeoman && \
  echo "yeoman ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Yeoman needs the use of a home directory for caching and certain config storage.
ENV HOME /home/yeoman

RUN mkdir /generated && chown yeoman:yeoman /generated
WORKDIR /generated

# Always run as the yeoman user
USER yeoman

#RUN chmod g+rwx /root /root/.config /root/.config/insight-nodejs

#USER root
#RUN chmod g+rwx /root /root/.config /root/.config/insight-nodejs

# APP port
EXPOSE 4200

#USER node
ENTRYPOINT ["tail", "-f", "/dev/null"]
