import { IActivity } from "./../models/activity";
import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import agent from "../api/agent";

configure({ enforceActions: "always" });
class ActivityStore {
  @observable activityRegistry = new Map();
  @observable loadingInitial = false;
  @observable activity: IActivity | null = null;
  @observable submitting = false;
  @observable target = "";

  @computed get activitiesByDate(): IActivity[] {
    return Array.from(this.activityRegistry.values()).sort((a, b) => {
      return Date.parse(a.date) - Date.parse(b.date);
    });
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction("Loading activities", () => {
        activities.forEach(activity => {
          activity.date = activity.date.split(".")[0];
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction("Load activities errors", () => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };

  @action loadActivity = async (id: string) => {
    let activity: IActivity = this.getActivity(id);
    if (activity) {
      //The activity exist in the registry
      this.activity = activity;
    } else {
      //Activity does not exist in registry..Load activity from api
      try {
        this.loadingInitial = true;
        activity = await agent.Activities.details(id);
        runInAction("getting activity", () => {
          activity.date = activity.date.split(".")[0];
          this.activity = activity;
          this.loadingInitial = false;
        });
      } catch (error) {
        runInAction("get activity error", () => {
          this.loadingInitial = false;
        });
        console.log(error);
      }
    }
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction("creating activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.submitting = false;
      });
    } catch (error) {
      runInAction("create activity error", () => {
        this.submitting = false;
        console.log(error);
      });
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction("Editing activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
      });
    } catch (error) {
      runInAction("edit activity error", () => {
        this.submitting = false;
        console.log(error);
      });
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    try {
      this.target = event.currentTarget.name;
      await agent.Activities.delete(id);
      runInAction("deleting activity", () => {
        //delete from the activity registry
        this.activityRegistry.delete(id);
        this.target = "";
        this.submitting = false;
      });
    } catch (error) {
      runInAction("delete activity errorr", () => {
        this.submitting = false;
        this.target = "";
        console.log(error);
      });
    }
  };

  @action clearActivity = () => {
    this.activity = null;
  };
}

export default createContext(new ActivityStore());
