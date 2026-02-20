import api from "../api";

import type {
  GetWaitlistByUserBookIdPath,
  GetWaitlistByUserBookIdResponse,
  ToggleWaitlistPath,
  ToggleWaitlistQuery,
  ToggleWaitlistResponse
} from "@/types/waitList";

export default {
  getWaitListByBookId: (param: GetWaitlistByUserBookIdPath) => {
    if (!param.userBookId) throw new Error("Book Id is required.");
    return api<GetWaitlistByUserBookIdResponse>('get', `/waitlist/${param.userBookId}`);
  },

  toggleWaitList: (param: ToggleWaitlistPath, query: ToggleWaitlistQuery) => {
    if (!param.userBookId) throw new Error("Book Id is required.");
    return api<ToggleWaitlistResponse>('post', `/waitlist/${param.userBookId}?addToWaitlist=${query.addToWaitlist}`);
  }
}
