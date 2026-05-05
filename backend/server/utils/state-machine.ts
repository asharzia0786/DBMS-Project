import { AppError } from "./app-error";

export function assertStateTransition<TState extends string>(
  current: TState,
  next: TState,
  allowed: Record<TState, readonly TState[]>,
  label: string,
): void {
  if (current === next) {
    return;
  }

  if (!allowed[current]?.includes(next)) {
    throw new AppError(
      `Invalid ${label} transition: ${current} -> ${next}.`,
      "INVALID_STATE_TRANSITION",
      400,
    );
  }
}
