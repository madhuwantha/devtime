### 🎯 Goal
- Create a background Go function that:
- Runs on macOS, Windows, and Linux
- Returns system idle time (keyboard/mouse inactivity)
- Triggers an event after X seconds of inactivity
- Integrates with a Cobra CLI command


| OS          | Method                                                   | Notes                                |
| ----------- | -------------------------------------------------------- | ------------------------------------ |
| **Windows** | Use `GetLastInputInfo()` WinAPI via syscall              | Official Windows way since Win95     |
| **Linux**   | Use `XScreenSaverQueryInfo()` (X11)                      | Works in most DEs (GNOME, KDE, etc.) |
| **macOS**   | Use IOKit via `CGEventSourceSecondsSinceLastEventType()` | Native Quartz API                    |




### 🧠 How It Works (Go Build Tags)
Go uses build constraints (a.k.a. build tags) to include platform-specific files during compilation. You write platform-specific implementations in different files like:


| File Name         | Build Tag            | Target OS |
| ----------------- | -------------------- | --------- |
| `idle_darwin.go`  | `//go:build darwin`  | macOS     |
| `idle_windows.go` | `//go:build windows` | Windows   |
| `idle_linux.go`   | `//go:build linux`   | Linux     |


---
Each of these files contains the function getIdleTime().
Meanwhile, your main code (idle.go) defines:

```bash
func GetIdleTime() (time.Duration, error) {
    return getIdleTime()
}
```

### 🔁 At compile time, Go includes only the *_os.go file matching the current platform and ignores the others. So:

- ✅ On macOS, only idle_darwin.go is included.
- ✅ On Windows, only idle_windows.go is included.
- ✅ On Linux, only idle_linux.go is included.

No if-else or runtime check is needed. Go handles it cleanly for you.
