To **rename the CLI tool during build**, you simply change the name of the output binary with the `-o` flag in the `go build` command.

---

## ✅ Example: Rename Tool to `devtime`

```bash
go build -ldflags="-s -w" -o bin/devtime main.go
```

* `bin/devtime` is now the **name of your tool**.
* You can run it like:

  ```bash
  ./bin/devtime
  ```

---

## 💡 To Install as Global Tool

Move it to a system path like `/usr/local/bin`:

```bash
sudo mv bin/devtime /usr/local/bin/devtime
```

Now you can run it from **anywhere**:

```bash
devtime
```

---

Let me know if you want to automate version tagging, or create installers (`.deb`, `.pkg`, `.exe`) for different OSes.
