import { useEffect, useState } from 'react';
import { IsPausedWorking, IsWorking, PauseWork, ResumeWork, StartWork, StopWork } from '../../wailsjs/go/main/App';
import { EventsOn } from "../../wailsjs/runtime/runtime";

export const useWorkState = () => {
  const [time, setTime] = useState("00:00:00");
  const [isWorking, setIsWorking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const startWorking = async () => {
    try {
      const result = await StartWork();
      setIsWorking(result);
    } catch (error) {
      console.error('Error starting work:', error);
    }
  };

  const stopWorking = async () => {
    try {
      await StopWork();
      setIsWorking(false);
    } catch (error) {
      console.error('Error stopping work:', error);
    }
  };

  const pauseWorking = async () => {
    try {
      console.log("pauseWorking clicked");
      const result = await PauseWork();
      console.log("res", result);
      setIsWorking(false);
      setIsPaused(true);
    } catch (error) {
      console.error('Error pausing work:', error);
    }
  };

  const resumeWorking = async () => {
    try {
      console.log("resumeWorking clicked");
      const result = await ResumeWork();
      setIsWorking(result);
      setIsPaused(false);
    } catch (error) {
      console.error('Error resuming work:', error);
    }
  };

  useEffect(() => {
    const initializeWorkState = async () => {
      try {
        const workingState = await IsWorking();
        const pausedState = await IsPausedWorking();
        
        setIsWorking(workingState);
        setIsPaused(pausedState);
      } catch (error) {
        console.error('Error initializing work state:', error);
      }
    };

    initializeWorkState();

    // Listen for timer updates
    EventsOn("workingTimer:update", (data: string) => {
      setTime(data);
    });
  }, []);

  return {
    time,
    isWorking,
    isPaused,
    startWorking,
    stopWorking,
    pauseWorking,
    resumeWorking
  };
};
