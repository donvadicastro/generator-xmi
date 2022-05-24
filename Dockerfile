FROM donvadicastro/generator-xmi:base-1.0.1

ARG GENERATOR_TYPE
ENV GENERATOR_TYPE=$GENERATOR_TYPE

COPY ./dist/generators .
COPY ./resources/models/fixtures.xml .
RUN yo xmi fixtures.xml --type=$GENERATOR_TYPE --destination=.
