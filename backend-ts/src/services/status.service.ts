import * as statusRepository from "../repositories/status.repository";

export async function getStatuses() {
  const statuses = await statusRepository.getStatuses();
  return statuses;
}