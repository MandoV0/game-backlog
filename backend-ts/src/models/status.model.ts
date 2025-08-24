export interface Status {
  statusid: number;
  status_name: string;
}

export enum StatusEnum {
  NotStarted = 1,
  NotPlaying = 2,
  Playing = 3,
  Completed = 4,
  OnHold = 5,
  Dropped = 6,
}