export namespace entity {
	
	export class IdleSummary {
	    date: string;
	    idle_hours: number;
	
	    static createFrom(source: any = {}) {
	        return new IdleSummary(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.date = source["date"];
	        this.idle_hours = source["idle_hours"];
	    }
	}
	export class PeakHourSummary {
	    hour: string;
	    hours_spent: number;
	
	    static createFrom(source: any = {}) {
	        return new PeakHourSummary(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.hour = source["hour"];
	        this.hours_spent = source["hours_spent"];
	    }
	}
	export class ProductivitySummary {
	    date: string;
	    productivity_percent: number;
	
	    static createFrom(source: any = {}) {
	        return new ProductivitySummary(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.date = source["date"];
	        this.productivity_percent = source["productivity_percent"];
	    }
	}
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
	export class ProjectSummary {
	    project_name: string;
	    period: string;
	    hours_spent: number;
	
	    static createFrom(source: any = {}) {
	        return new ProjectSummary(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.project_name = source["project_name"];
	        this.period = source["period"];
	        this.hours_spent = source["hours_spent"];
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
	export class TaskSummary {
	    task_name: string;
	    project_name: string;
	    period: string;
	    hours_spent: number;
	
	    static createFrom(source: any = {}) {
	        return new TaskSummary(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.task_name = source["task_name"];
	        this.project_name = source["project_name"];
	        this.period = source["period"];
	        this.hours_spent = source["hours_spent"];
	    }
	}
	export class WorkSummary {
	    date: string;
	    total_hours: number;
	
	    static createFrom(source: any = {}) {
	        return new WorkSummary(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.date = source["date"];
	        this.total_hours = source["total_hours"];
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

