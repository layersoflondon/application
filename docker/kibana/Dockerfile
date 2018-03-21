FROM kibana:5.6.8

RUN apt-get update && apt-get install -y netcat

COPY ./docker/kibana/entrypoint.sh /tmp/entrypoint.sh
RUN chmod +x /tmp/entrypoint.sh

COPY ./docker/kibana/kibana.yml /opt/kibana/config/
