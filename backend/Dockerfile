FROM golang:1.24-alpine

RUN apk add --no-cache gcc musl-dev

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

# プロジェクト丸ごと（cmdフォルダ含む）をコピー
COPY . .

# cmd/main.go を指定してビルド
RUN go build -o main ./cmd/main.go

CMD ["./main"]