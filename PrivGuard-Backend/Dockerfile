FROM alpine:3.18

# Install only CA certs
RUN apk --no-cache add ca-certificates

WORKDIR /app
COPY app .
RUN chmod +x ./app

EXPOSE 8080
CMD ["./app"]
