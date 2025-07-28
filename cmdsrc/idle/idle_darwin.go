// idle_darwin.go
package idle

/*
#cgo CFLAGS: -x objective-c
#cgo LDFLAGS: -framework IOKit -framework ApplicationServices
#include <CoreGraphics/CoreGraphics.h>

double macIdleTime() {
    return CGEventSourceSecondsSinceLastEventType(
        kCGEventSourceStateCombinedSessionState,
        kCGAnyInputEventType
    );
}
*/
import "C"
import "time"

func getIdleTime() (time.Duration, error) {
	seconds := C.macIdleTime()
	return time.Duration(float64(time.Second) * float64(seconds)), nil
}
