//go:build !darwin
// +build !darwin

package main

// Stub implementations for non-macOS platforms
func createNativePipWindow(htmlContent string, width, height int) {
	// Not implemented for this platform
}

func showNativePipWindow() {
	// Not implemented for this platform
}

func hideNativePipWindow() {
	// Not implemented for this platform
}

func updateNativePipWindowContent(htmlContent string) {
	// Not implemented for this platform
}

