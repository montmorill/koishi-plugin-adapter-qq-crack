import * as QQ from './types';

interface StreamState
{
  id?: string;
  index: number;
  disposeFinal?: () => void;
}

const streamStates = new WeakMap<object, StreamState>();

const AUTO_STREAM_FINAL_DELAY = 2000;

export function applyAutoStream(session: object | undefined, request: QQ.Message.Request, enabled?: boolean)
{
  if (!enabled || request.stream || !session) return;
  const state = streamStates.get(session);
  state?.disposeFinal?.();
  request.stream = {
    state: 1,
    id: state?.id,
    index: state?.index ?? 0,
    reset: false,
  };
}

export function updateAutoStream(session: object | undefined, request: QQ.Message.Request, messageId?: string)
{
  if (!session || !request.stream) return;
  if (request.stream.reset || request.stream.state >= 10)
  {
    streamStates.delete(session);
    return;
  }
  const previous = streamStates.get(session);
  streamStates.set(session, {
    disposeFinal: previous?.disposeFinal,
    id: messageId || request.stream.id,
    index: (request.stream.index ?? 0) + 1,
  });
}

export function getAutoStreamFinalDelay(request: QQ.Message.Request)
{
  void request;
  return AUTO_STREAM_FINAL_DELAY;
}

export function createAutoStreamFinalRequest(request: QQ.Message.Request, messageId?: string)
{
  if (!request.stream || request.stream.reset || request.stream.state >= 10)
  {
    return;
  }
  const { msg_id, event_id, ...rest } = request;
  return {
    ...rest,
    ...(typeof request.msg_seq === 'number' ? { msg_seq: request.msg_seq + 1 } : {}),
    stream: {
      state: 10,
      id: messageId || request.stream.id,
      index: 1,
      reset: true,
    },
  } satisfies QQ.Message.Request;
}

export function scheduleAutoStreamFinal(
  timerHost: { setTimeout(callback: () => void, ms: number): () => void; },
  session: object | undefined,
  delay: number,
  callback: () => void,
)
{
  if (!session) return;
  const state = streamStates.get(session);
  if (!state) return;
  state.disposeFinal?.();
  state.disposeFinal = timerHost.setTimeout(() =>
  {
    callback();
  }, delay);
}

export function clearAutoStream(session: object | undefined)
{
  if (!session) return;
  const state = streamStates.get(session);
  state?.disposeFinal?.();
  streamStates.delete(session);
}
