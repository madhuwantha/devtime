package syn

import "fmt"

func GetSyncStrategy(direction, datatype string) SyncStrategy {
	switch direction {
	case "Server -> Local":
		switch datatype {
		case "Projects":
			return ServerToLocalProjects{}
		case "Tasks":
			return ServerToLocalTasks{}
		}
		// case "Local -> Server":
		// 	switch datatype {
		// 	case "Projects":
		// 		return LocalToServerProjects{}
		// 	case "Tasks":
		// 		return LocalToServerTasks{}
		// 	}
		// }
	default:
		fmt.Println("Invalid direction or datatype")
	}
	return nil
}
