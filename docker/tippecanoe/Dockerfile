FROM alpine

RUN apk add --no-cache sudo git g++ make libgcc libstdc++ sqlite-libs sqlite-dev zlib-dev bash python3 py3-setuptools

RUN addgroup sudo && adduser -G sudo -D -H tippecanoe && echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
 RUN cd /root \
 && git clone https://github.com/mapbox/tippecanoe.git tippecanoe \
 && cd tippecanoe \
 && git checkout master \
 && cd /root/tippecanoe \
 && make \
 && make install \
 && cd /root \
 && rm -rf /root/tippecanoe
#
RUN cd /root \
 && git clone git://github.com/mapbox/mbutil.git mbutil \
 && cd /root/mbutil \
 && python3 setup.py install

RUN apk del git g++ make sqlite-dev

USER tippecanoe
WORKDIR /home/tippecanoe
ENTRYPOINT /bin/bash