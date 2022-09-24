FROM ubuntu:22.04

WORKDIR /app

RUN mkdir /app/reports

RUN apt-get update && \
    apt-get -y install ca-certificates gnupg wget tzdata && \
    gpg -k

ENV TZ="Asia/Jakarta"

RUN gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69 && \
    echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | tee /etc/apt/sources.list.d/k6.list && \
    apt-get update && \
    apt-get -y install k6

RUN wget https://dl.google.com/go/go1.19.1.linux-amd64.tar.gz && \
    tar -C /usr/local/ -xzf go1.19.1.linux-amd64.tar.gz

ENV PATH=/app:/usr/local:/usr/local/go/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

ENV GOPATH=/app/go

RUN go install github.com/containrrr/shoutrrr/shoutrrr@latest