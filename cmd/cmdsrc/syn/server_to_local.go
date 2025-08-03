package syn

import "fmt"

type ServerToLocalProjects struct{}

func (s ServerToLocalProjects) RunSync() {
	SynLocalProjects()
	fmt.Println("Syncing Projects from Server to Local is completed")
}

type ServerToLocalTasks struct{}

func (s ServerToLocalTasks) RunSync() {
	SynLocalTasks("6873e2fb6ebc409486ceb87c")
	fmt.Println("Syncing Tasks from Server to Local is completed")
}
