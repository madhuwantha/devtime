


export type TaskHandler = {
    startTask: () => void;
    endTask: () => void;
}

export const useTaskHandler = (): TaskHandler =>{

    const startTask = ()=> {

    }

    const endTask = ()=> {

    }

    return { startTask, endTask }
}