import { render, screen, fireEvent } from "@testing-library/react";
import SoundToggle from "@/components/SoundToggle";

describe("SoundToggle", () => {
  it("displays speaker icon when enabled", () => {
    render(<SoundToggle enabled={true} onToggle={() => {}} />);
    const button = screen.getByRole("button");
    expect(button.textContent).toContain("🔊");
  });

  it("displays muted icon when disabled", () => {
    render(<SoundToggle enabled={false} onToggle={() => {}} />);
    const button = screen.getByRole("button");
    expect(button.textContent).toContain("🔇");
  });

  it("calls onToggle when clicked", () => {
    const mockToggle = jest.fn();
    render(<SoundToggle enabled={true} onToggle={mockToggle} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it("has minimum 44x44px touch target", () => {
    render(<SoundToggle enabled={true} onToggle={() => {}} />);
    const button = screen.getByRole("button") as HTMLElement;

    // In jsdom, computed styles don't work, so check Tailwind classes
    expect(button).toHaveClass("w-12"); // 48px = 12 * 4px
    expect(button).toHaveClass("h-12"); // 48px = 12 * 4px
    // 48px >= 44px requirement met
  });

  it("has accessible label", () => {
    render(<SoundToggle enabled={true} onToggle={() => {}} />);
    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("aria-label", "Toggle sound");
  });
});
