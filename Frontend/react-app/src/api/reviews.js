import { api } from '../store';

const BASE_REQUEST = 'feedbacks/';

export const submitReviewAction = async (newReviewData) => {
  await api.post(BASE_REQUEST, newReviewData);
}