FROM golang:alpine AS builder

ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

WORKDIR /build

COPY go.mod .
RUN go mod download

COPY Makefile .
COPY go/beans go/beans

RUN apk add --no-cache make bash
RUN make tiger

WORKDIR /dist

RUN cp /build/go/bin/tiger .

FROM scratch

COPY --from=builder /dist/tiger /

ENTRYPOINT ["/tiger"]