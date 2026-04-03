import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export const formatMessageDate = (date: string) => {
  return format(new Date(date), 'a h:mm', { locale: ko });
};
