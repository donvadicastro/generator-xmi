FROM donvadicastro/generator-xmi:base-1.0.8

ARG GENERATOR_TYPE
ENV GENERATOR_TYPE=$GENERATOR_TYPE

COPY ./generators ./generators
COPY ./resources/models/fixtures.xml .
COPY ./node_modules ./node_modules
COPY ./packages/core ./node_modules/generator-xmi-core

RUN yo xmi fixtures.xml --type=$GENERATOR_TYPE --destination=./output
WORKDIR /home/yeoman/generated/output
