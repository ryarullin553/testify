export const formatDate = (date) => {
  const now = Date.now();
  const timePassed = (now - date)/1000;
  if (timePassed < 1) {
    return 'только что';
  } else if (timePassed < 60) {
    return `${parseInt(timePassed)} секунд назад`;
  } else if (timePassed < 3600) {
    return `${parseInt(timePassed / 60)} минут назад`;
  } else if (timePassed < 86400) {
    return `${parseInt(timePassed / 3600)} часов назад`;
  } else if (timePassed < 172800) {
    return 'вчера';
  } else return (
    date.toLocaleString(
      'ru-Ru',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }
    )
  );
}
