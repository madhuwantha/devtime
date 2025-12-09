//go:build darwin
// +build darwin

package main

/*
#cgo CFLAGS: -x objective-c
#cgo LDFLAGS: -framework Cocoa -framework WebKit

#import <Cocoa/Cocoa.h>
#import <WebKit/WebKit.h>
#import <dispatch/dispatch.h>

static NSWindow* pipWindow = nil;

void createPipWindow(char* htmlContent, int width, int height) {
    if (pipWindow != nil) {
        return;
    }

    // Create a retained copy of the HTML content for use in async block
    NSString* htmlString = [[NSString stringWithUTF8String:htmlContent] retain];

    // Dispatch window creation to main thread
    dispatch_async(dispatch_get_main_queue(), ^{
        if (pipWindow != nil) {
            [htmlString release];
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
        [webView loadHTMLString:htmlString baseURL:nil];

        [pipWindow setContentView:webView];
        [pipWindow makeKeyAndOrderFront:nil];

        [htmlString release];
    });
}

void showPipWindow() {
    dispatch_async(dispatch_get_main_queue(), ^{
        if (pipWindow != nil) {
            [pipWindow makeKeyAndOrderFront:nil];
        }
    });
}

void hidePipWindow() {
    dispatch_async(dispatch_get_main_queue(), ^{
        if (pipWindow != nil) {
            [pipWindow orderOut:nil];
        }
    });
}

void updatePipWindowContent(char* htmlContent) {
    NSString* htmlString = [[NSString stringWithUTF8String:htmlContent] retain];
    dispatch_async(dispatch_get_main_queue(), ^{
        if (pipWindow != nil) {
            WKWebView* webView = (WKWebView*)[pipWindow contentView];
            if (webView != nil) {
                [webView loadHTMLString:htmlString baseURL:nil];
            }
        }
        [htmlString release];
    });
}
*/
import "C"
import (
	"log"
	"sync"
	"unsafe"
)

var (
	pipWindowCreated bool
	pipWindowMutex   sync.Mutex
)

func createNativePipWindow(htmlContent string, width, height int) {
	pipWindowMutex.Lock()
	defer pipWindowMutex.Unlock()

	if pipWindowCreated {
		return
	}

	cHTML := C.CString(htmlContent)
	defer C.free(unsafe.Pointer(cHTML))

	C.createPipWindow(cHTML, C.int(width), C.int(height))
	pipWindowCreated = true
	log.Println("Native PiP window creation dispatched to main thread")
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
