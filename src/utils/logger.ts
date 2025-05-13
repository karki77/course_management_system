import morgan from 'morgan';

export const logger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
);
export const loggerStream = {
  write: (message: string): void => {
    // eslint-disable-next-line no-console
    console.log(message.trim());
  },

  error: (message: string): void => {
    console.error(message.trim());
  },
};
