import events from "events";

const GENERAL_EVENTS = {
  ALL: "*",
  /* ERROR: "ERROR", */
};

const SIMPLE_EVENTS = {
  PURCHASE_COMPLETED: "PURCHASE_COMPLETED",
};

type EVENTSType = {
  readonly [event_name: string]: string;
} & typeof SIMPLE_EVENTS &
  typeof GENERAL_EVENTS;

export interface EventContext {
  gateway: string;
  trackingUrl?: string;
}

const eventEmitter = new events.EventEmitter();
export const EVENTS: EVENTSType = { ...GENERAL_EVENTS, ...SIMPLE_EVENTS };

export function emit(event_type: string, ctx: EventContext) {
  eventEmitter.emit(event_type, {
    type: event_type,
    ...ctx,
  });
}

export function on(
  event_type: string,
  cb: (ctx: EventContext & { type: string }) => void
) {
  if (event_type === EVENTS.ALL) {
    for (const event in EVENTS) {
      eventEmitter.on(event, cb);
    }
  } else if (EVENTS[event_type]) {
    eventEmitter.on(event_type, cb);
  } /* else if (this.EVENT[event_type] === this.EVENT.ERROR) {
      this.eventEmitter.on(event_type, cb);
    } */
}
