mkdir -p bin && \
# GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o bin/app-linux-amd64 main.go && \
# GOOS=darwin GOARCH=amd64 go build -ldflags="-s -w" -o bin/app-macos-amd64 main.go && \
# GOOS=darwin GOARCH=arm64 go build -ldflags="-s -w" -o bin/app-macos-arm64 main.go && \
# GOOS=windows GOARCH=amd64 go build -ldflags="-s -w" -o bin/app-windows-amd64.exe main.go


# build for macOS native
go build -ldflags="-s -w" -o bin/app-macos-native main.go

# GOARCH=amd64 go build -o bin/app-amd64 main.go
# GOARCH=arm64 go build -o bin/app-arm64 main.go
# lipo -create -output bin/app-universal bin/app-amd64 bin/app-arm64
