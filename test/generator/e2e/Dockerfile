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

RUN echo -n "Node: " && node -v && echo -n "npm: " && npm -v
RUN echo "Yeoman Doctor will warn about our npm version being outdated. It is expected and OK."
RUN npm install --global --silent yo generator-xmi

#USER root
#RUN chmod g+rwx /root /root/.config /root/.config/insight-nodejs

#USER node
ENTRYPOINT ["tail", "-f", "/dev/null"]
