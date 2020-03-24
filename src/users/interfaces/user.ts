export interface User {
  readonly phone: string;
  readonly auth: {
    phone : {
      valid : boolean,
    },
  }
}