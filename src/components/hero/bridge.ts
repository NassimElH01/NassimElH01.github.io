// The hero bridge: a slider (pointer, touch and keyboard) that moves the split
// between the business and the tech panel. Without JS the split stays at 50.

const STEP = 5;
const PAGE = 20;

export function initBridges(): void {
  for (const bridge of document.querySelectorAll<HTMLElement>("[data-bridge]")) {
    const handle = bridge.querySelector<HTMLElement>("[data-bridge-handle]");
    if (handle) initBridge(bridge, handle);
  }
}

function initBridge(bridge: HTMLElement, handle: HTMLElement): void {
  const template = bridge.dataset.valueText ?? "{business} / {tech}";
  let value = Number(handle.getAttribute("aria-valuenow")) || 50;
  let dragging = false;

  const set = (next: number) => {
    value = Math.round(Math.min(100, Math.max(0, next)));
    bridge.style.setProperty("--split", String(value));
    handle.setAttribute("aria-valuenow", String(value));
    handle.setAttribute(
      "aria-valuetext",
      template.replace("{business}", String(value)).replace("{tech}", String(100 - value)),
    );
  };

  const fromPointer = (event: PointerEvent) => {
    const rect = bridge.getBoundingClientRect();
    set(((event.clientX - rect.left) / rect.width) * 100);
  };

  handle.addEventListener("keydown", (event) => {
    const moves: Record<string, number> = {
      ArrowLeft: value - STEP,
      ArrowDown: value - STEP,
      ArrowRight: value + STEP,
      ArrowUp: value + STEP,
      PageDown: value - PAGE,
      PageUp: value + PAGE,
      Home: 0,
      End: 100,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    set(moves[event.key]);
  });

  handle.addEventListener("pointerdown", (event) => {
    dragging = true;
    handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  });
  handle.addEventListener("pointermove", (event) => {
    if (dragging) fromPointer(event);
  });
  const stop = () => {
    dragging = false;
  };
  handle.addEventListener("pointerup", stop);
  handle.addEventListener("pointercancel", stop);
  handle.addEventListener("lostpointercapture", stop);
}
