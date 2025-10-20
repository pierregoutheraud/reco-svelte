/**
 * Svelte action that observes when an element intersects with a scroll container.
 * Useful for implementing infinite scroll patterns.
 *
 * @example
 * ```svelte
 * <div use:observeIntersection={{ onIntersect: loadMore, root: '.scroll-container' }}>
 *   Trigger element
 * </div>
 * ```
 */

export interface IntersectionObserverOptions {
  /** Callback function to execute when element intersects */
  onIntersect: () => void;
  /** Selector for the scrolling container (defaults to viewport) */
  root?: string | Element | null;
  /** Margin around the root (e.g., "0px") */
  rootMargin?: string;
  /** Visibility threshold (0 to 1) */
  threshold?: number;
}

export function observeIntersection(
  node: HTMLElement,
  options: IntersectionObserverOptions
) {
  const { onIntersect, root, rootMargin = "0px", threshold = 0.1 } = options;

  const rootElement =
    typeof root === "string" ? document.querySelector(root) : root;

  const observerOptions: IntersectionObserverInit = {
    root: rootElement,
    rootMargin,
    threshold
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        onIntersect();
      }
    });
  }, observerOptions);

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    }
  };
}
