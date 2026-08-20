"use client";

import { useState, useCallback } from "react";

/**
 * Lightweight compatibility hook for `useActionState` used across the app.
 * Returns [state, actionFn, isPending].
 * - `action` may be a server-action or client function; it's invoked and
 *   its result merged into state when it resolves.
 */
export default function useActionState(action, initialState = {}) {
  const [state, setState] = useState(initialState || {});
  const [isPending, setIsPending] = useState(false);

  const actionFn = useCallback(
    async (formData) => {
      setIsPending(true);
      try {
        // Some server-action helpers expect (prevState, formData)
        // while direct server actions accept (formData). Inspect
        // the declared parameter count and forward appropriately.
        let result = await action(state, formData);

        if (result && typeof result === "object") {
          setState((s) => ({ ...s, ...result }));

          // Dispatch a client-side toast event if available
          if (typeof window !== "undefined") {
            try {
              if (result.errors) {
                const firstError =
                  result.errors?.server?.[0] ||
                  result.errors?.[Object.keys(result.errors)[0]]?.[0] ||
                  "An error occurred.";
                window.dispatchEvent(
                  new CustomEvent("toast", {
                    detail: { type: "error", message: firstError },
                  }),
                );
              } else if (result.success) {
                const msg = result.message || "Success";
                window.dispatchEvent(
                  new CustomEvent("toast", {
                    detail: { type: "success", message: msg },
                  }),
                );
              } else if (result.liked !== undefined) {
                const msg = result.liked ? "Liked" : "Unliked";
                window.dispatchEvent(
                  new CustomEvent("toast", {
                    detail: { type: "success", message: msg },
                  }),
                );
              }
            } catch (e) {
              /* ignore client dispatch errors */
            }
          }
        }
        return result;
      } catch (err) {
        if (isRedirectError(err)) throw err;
        console.error("useActionState action error:", err);
        const serverErr = { errors: { server: [err?.message || String(err)] } };
        setState((s) => ({ ...s, ...serverErr }));
        return serverErr;
      } finally {
        setIsPending(false);
      }
    },
    [action],
  );

  return [state, actionFn, isPending];
}
