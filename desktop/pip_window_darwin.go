//go:build darwin
// +build darwin

package main

/*
#cgo CFLAGS: -x objective-c
#cgo LDFLAGS: -framework Cocoa -framework WebKit

#import <Cocoa/Cocoa.h>
#import <WebKit/WebKit.h>

static NSWindow* pipWindow = nil;

void createPipWindow(char* htmlContent, int width, int height) {
    if (pipWindow != nil) {
        return;
    }

    pipWindow = [[NSWindow alloc]
        initWithContentRect:NSMakeRect(100, 100, width, height)
        styleMask:NSWindowStyleMaskBorderless | NSWindowStyleMaskNonactivatingPanel
        backing:NSBackingStoreBuffered
        defer:NO];

    [pipWindow setLevel:NSFloatingWindowLevel];
    [pipWindow setCollectionBehavior:NSWindowCollectionBehaviorCanJoinAllSpaces | NSWindowCollectionBehaviorFullScreenAuxiliary];
    [pipWindow setOpaque:NO];
    [pipWindow setBackgroundColor:[NSColor clearColor]];
    [pipWindow setHasShadow:YES];
    [pipWindow setTitleVisibility:NSWindowTitleHidden];
    [pipWindow setTitlebarAppearsTransparent:YES];

    WKWebView* webView = [[WKWebView alloc] initWithFrame:NSMakeRect(0, 0, width, height)];
    NSString* htmlString = [NSString stringWithUTF8String:htmlContent];
    [webView loadHTMLString:htmlString baseURL:nil];

    [pipWindow setContentView:webView];
    [pipWindow makeKeyAndOrderFront:nil];
}

void showPipWindow() {
    if (pipWindow != nil) {
        [pipWindow makeKeyAndOrderFront:nil];
    }
}

void hidePipWindow() {
    if (pipWindow != nil) {
        [pipWindow orderOut:nil];
    }
}

void updatePipWindowContent(char* htmlContent) {
    if (pipWindow != nil) {
        WKWebView* webView = (WKWebView*)[pipWindow contentView];
        if (webView != nil) {
            NSString* htmlString = [NSString stringWithUTF8String:htmlContent];
            [webView loadHTMLString:htmlString baseURL:nil];
        }
    }
}
*/
import "C"
import (
	"log"
	"unsafe"
)

var pipWindowCreated bool

func createNativePipWindow(htmlContent string, width, height int) {
	if pipWindowCreated {
		return
	}

	cHTML := C.CString(htmlContent)
	defer C.free(unsafe.Pointer(cHTML))

	C.createPipWindow(cHTML, C.int(width), C.int(height))
	pipWindowCreated = true
	log.Println("Native PiP window created")
}

func showNativePipWindow() {
	if !pipWindowCreated {
		return
	}
	C.showPipWindow()
}

func hideNativePipWindow() {
	if !pipWindowCreated {
		return
	}
	C.hidePipWindow()
}

func updateNativePipWindowContent(htmlContent string) {
	if !pipWindowCreated {
		return
	}
	cHTML := C.CString(htmlContent)
	defer C.free(unsafe.Pointer(cHTML))
	C.updatePipWindowContent(cHTML)
}
