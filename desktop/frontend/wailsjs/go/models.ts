export namespace entity {
	
	export class Project {
	    ID: number;
	    Name: string;
	    Code: string;
	    ProjectId: string;
	
	    static createFrom(source: any = {}) {
	        return new Project(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Name = source["Name"];
	        this.Code = source["Code"];
	        this.ProjectId = source["ProjectId"];
	    }
	}
	export class Task {
	    ID: number;
	    Name: string;
	    ProjectId: string;
	    TaskId: string;
	
	    static createFrom(source: any = {}) {
	        return new Task(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Name = source["Name"];
	        this.ProjectId = source["ProjectId"];
	        this.TaskId = source["TaskId"];
	    }
	}

}

export namespace main {
	
	export class StartTaskResponse {
	    Status: boolean;
	    Error: any;
	
	    static createFrom(source: any = {}) {
	        return new StartTaskResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Status = source["Status"];
	        this.Error = source["Error"];
	    }
	}

}

