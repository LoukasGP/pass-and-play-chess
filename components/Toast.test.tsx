import { render, screen } from "@testing-library/react";
import Toast from "@/components/Toast";

describe("Toast Component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("Rendering", () => {
    it("displays message when provided", () => {
      const onDismiss = jest.fn();
      render(<Toast message="Test message" onDismiss={onDismiss} />);

      expect(screen.getByText("Test message")).toBeInTheDocument();
    });

    it("does not render when message is null", () => {
      const onDismiss = jest.fn();
      const { container } = render(
        <Toast message={null} onDismiss={onDismiss} />,
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe("Accessibility", () => {
    it("includes ARIA live region for screen readers", () => {
      const onDismiss = jest.fn();
      render(<Toast message="Turn error" onDismiss={onDismiss} />);

      const liveRegion = screen.getByRole("status");
      expect(liveRegion).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("Auto-dismiss", () => {
    it("calls onDismiss after 2 seconds", () => {
      const onDismiss = jest.fn();
      render(<Toast message="Test message" onDismiss={onDismiss} />);

      expect(onDismiss).not.toHaveBeenCalled();

      jest.advanceTimersByTime(2000);

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it("does not call onDismiss when message is null", () => {
      const onDismiss = jest.fn();
      render(<Toast message={null} onDismiss={onDismiss} />);

      jest.advanceTimersByTime(2000);

      expect(onDismiss).not.toHaveBeenCalled();
    });
  });
});
